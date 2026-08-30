// Temporary compatibility bridge. Runtime composition will inject this
// content-owned table and remove the engine-to-core dependency.
export {
  CORE_CREATURE_MECHANICS,
  mechanicsByCreatureId,
} from '../../../content-packs/core/src/mechanics.ts'
