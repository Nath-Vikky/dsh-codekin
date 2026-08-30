import type { CodekinContentPack } from './types.ts'

export function defineContentPack<const Pack extends CodekinContentPack>(pack: Pack): Pack {
  return pack
}
