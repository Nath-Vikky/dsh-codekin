import Ajv from 'ajv'
import type { ErrorObject, ValidateFunction } from 'ajv'
import { CONTENT_PACK_SCHEMA } from './schema.ts'
import type { CodekinContentPack, ContentValidationIssue } from './types.ts'

const ajv = new Ajv({ allErrors: true, strict: true })
const validate = ajv.compile(CONTENT_PACK_SCHEMA) as ValidateFunction<CodekinContentPack>

function issuesFrom(errors: readonly ErrorObject[] | null | undefined): ContentValidationIssue[] {
  return (errors ?? []).map(error => ({
    path: error.instancePath === '' ? '/' : error.instancePath,
    message: error.message ?? error.keyword,
  }))
}

export class ContentPackValidationError extends TypeError {
  readonly issues: readonly ContentValidationIssue[]

  constructor(issues: readonly ContentValidationIssue[]) {
    super(`invalid Codekin content pack: ${issues.map(issue => `${issue.path} ${issue.message}`).join('; ')}`)
    this.name = 'ContentPackValidationError'
    this.issues = Object.freeze([...issues])
  }
}

export function assertContentPack(value: unknown): asserts value is CodekinContentPack {
  if (!validate(value)) throw new ContentPackValidationError(issuesFrom(validate.errors))
}

export function contentPackIssues(value: unknown): readonly ContentValidationIssue[] {
  return validate(value) ? [] : Object.freeze(issuesFrom(validate.errors))
}
