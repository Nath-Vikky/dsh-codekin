import { Session, SessionId } from '@deepseek-ai/dsh-session'
import type { SessionEvent, ToolResultMessage } from '@deepseek-ai/dsh-session'
import { describe, expect, it } from 'vitest'
import { TraceWildEventClassifier } from '../packages/dsh-adapter/src/classifier.ts'

const callId = 'tool-1' as SessionEvent<'tool/call'>['data']['callId']

function toolResult(session: Session): SessionEvent<'tool/result'> {
  return session.append('tool/result', {
    turn: 1, step: 1,
    message: {
      id: 'result-1' as ToolResultMessage['id'],
      role: 'user',
      source: { kind: 'tool', callId },
      content: [{ type: 'tool-result', toolCallId: callId,
        content: [{ type: 'text', text: 'Timed out' }], isError: true }],
    },
    error: { name: 'TimeoutError', code: 'TIMEOUT' },
  }, { surfaceOp: 'append' })
}

function rewriteResult(session: Session, original: SessionEvent<'tool/result'>): SessionEvent<'tool/result'> {
  return session.append('tool/result', {
    ...original.data,
    message: {
      ...original.data.message,
      content: [{ ...original.data.message.content[0], content: [{ type: 'text', text: 'Summary: timed out' }] }],
    },
  }, {
    surfaceOp: { op: 'replace', startSeq: original.seq, endSeq: original.seq },
    sourceEventSeqs: [original.seq],
  })
}

describe('DSH Session V3 reward compatibility', () => {
  it.each([false, true])('does not count a rewritten tool result as another failure (child activity: %s)', (childActivity: boolean) => {
    const classifier = new TraceWildEventClassifier()
    const root = Session.create(SessionId('codekin-root'))
    const session = childActivity ? Session.create(SessionId('codekin-child')) : root
    classifier.observe(root, root.append('turn/start', { turn: 1 }))
    const observe = (event: SessionEvent) => childActivity
      ? classifier.observeRelatedActivity(root, event)
      : classifier.observe(root, event)
    observe(session.append('tool/call', { turn: 1, step: 1, callId, name: 'read', arguments: '{}' }))
    const original = toolResult(session)
    observe(original)
    observe(rewriteResult(session, original))
    const reward = classifier.observe(root, root.append('turn/end', { turn: 1, reason: { kind: 'interrupted' } }))
    expect(reward).toMatchObject({ ecology: 'glitch', outcome: 'failed', intensity: 2, variant: 'crash' })
  })

  it('ignores rewrites from an earlier turn while classifying current work', () => {
    const classifier = new TraceWildEventClassifier()
    const session = Session.create(SessionId('codekin-history'))
    classifier.observe(session, session.append('turn/start', { turn: 1 }))
    const original = toolResult(session)
    classifier.observe(session, original)
    classifier.observe(session, session.append('turn/end', { turn: 1, reason: { kind: 'completed' } }))
    classifier.observe(session, session.append('turn/start', { turn: 2 }))
    classifier.observe(session, session.append('tool/call', { turn: 2, step: 1, callId, name: 'read', arguments: '{}' }))
    classifier.observe(session, rewriteResult(session, original))
    const reward = classifier.observe(session, session.append('turn/end', { turn: 2, reason: { kind: 'completed' } }))
    expect(reward).toMatchObject({ ecology: 'lumen', ecologyCandidates: ['lumen'], outcome: 'completed' })
  })

  it('classifies a completed turn from the real V3 event log and suppresses aborted turns', () => {
    const classifier = new TraceWildEventClassifier()
    const session = Session.create(SessionId('codekin-completed'))
    classifier.observe(session, session.append('turn/start', { turn: 1 }))
    classifier.observe(session, session.append('tool/call', { turn: 1, step: 1, callId, name: 'read', arguments: '{}' }))
    const reward = classifier.observe(session, session.append('turn/end', { turn: 1, reason: { kind: 'completed' } }))
    expect(reward).toMatchObject({ ecology: 'lumen', outcome: 'completed', intensity: 1 })
    classifier.observe(session, session.append('turn/start', { turn: 2 }))
    expect(classifier.observe(session, session.append('turn/end', {
      turn: 2, reason: { kind: 'aborted', reason: { kind: 'user' } },
    }))).toBeUndefined()
  })
})
