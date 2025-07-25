// deno-lint-ignore-file no-explicit-any
import * as stdpath from 'https://deno.land/std/path/mod.ts'

export type VersionManifest = {
  latest: {
    release: string
    snapshot: string
  }
  versions: readonly {
    id: string
    type: string
    url: string
    time: string
    releaseTime: string
  }[]
}

export type Version = {
  arguments: {
    game: unknown
    jvm: unknown
  }
  assetIndex: {
    id: string
    sha1: string
    size: number
    totalSize: number
    url: string
  }
  assets: unknown
  complianceLevel: number
  downloads: {
    [k in 'client' | 'client_mappings' | 'server' | 'server_mappings']: {
      sha1: string
      size: number
      url: string
    }
  }
  id: string
  javaVersion: unknown
  libraries: unknown
  logging: unknown
  mainClass: string
  minimumLauncherVersion: number
  releaseTime: string
  time: string
  type: string
}

export type AssetIndex = {
  objects: {
    [k in string]: {
      hash: string
      size: number
    }
  }
}

export const fetch_version_manifest = (): Promise <VersionManifest> => fetch ('https://launchermeta.mojang.com/mc/game/version_manifest_v2.json').then ((response) => response.json ())

// export const get_processed_registries = async (path_of_vanilla_datapack: string) => {
//   const response = await fetch (stdpath.join (path_of_vanilla_datapack, 'generated', 'reports', 'registries.json'))
//   const data: {[k in string]: { entries: {[k in string]: any} }} = await response.json ()
//   const res: {[k in string]: readonly string[]} = {}
//   for (const key of Object.keys (data))
//   {
//     res[`${ResourceLocation.fromString (key)}`] = Object.keys (data[key].entries).map ((x) => `${ResourceLocation.fromString (x)}`).sort ()
//   }
//   return res
// }

export const ResourceCategory = {
  "pack.mcmeta": {
    pack_type: '.',
    folder: "..",
    suffix: ".json", // 横着。これで問題になるのはpath_of_resourceかな
    get default_value (): PackMCMeta {
      throw new Error ('not implemented')
    },
  },
  "advancement": {
    pack_type: 'data',
    folder: "advancement",
    suffix: ".json",
    declval: (): Advancement => { throw new Error ('unreachable') },
    get default_value (): Advancement {
      return {
        criteria: {
          '': {
            trigger: 'impossible'
          }
        }
      }
    },
  },
  "damage_type": {
    pack_type: 'data',
    folder: "damage_type",
    suffix: ".json",
    declval: (): DamageType => { throw new Error ('unreachable') },
    get default_value (): DamageType {
      return {
        exhaustion: 0,
        message_id: '',
        scaling: 'never',
      }
    },
  },
  "dimension_type": {
    pack_type: 'data',
    folder: "dimension_type",
    suffix: ".json",
    declval: (): DimensionType => { throw new Error ('unreachable') },
    get default_value (): DimensionType {
      throw new Error ('not implemented')
    },
  },
  "function": {
    pack_type: 'data',
    folder: "function",
    suffix: ".mcfunction",
    declval: (): string => { throw new Error ('unreachable') },
    get default_value (): string {
      return ''
    },
  },
  "item_modifier": {
    pack_type: 'data',
    folder: "item_modifier",
    suffix: ".json",
    declval: (): ItemModifier | ItemModifier[] => { throw new Error ('unreachable') },
    get default_value (): ItemModifier | ItemModifier[] {
      return []
    },
  },
  "loot_table": {
    pack_type: 'data',
    folder: "loot_table",
    suffix: ".json",
    declval: (): LootTable => { throw new Error ('unreachable') },
    get default_value (): LootTable {
      return {}
    },
  },
  "predicate": {
    pack_type: 'data',
    folder: "predicate",
    suffix: ".json",
    declval: (): Predicate | Predicate[] => { throw new Error ('unreachable') },
    get default_value (): Predicate | Predicate[] {
      return []
    },
  },
  "recipe": {
    pack_type: 'data',
    folder: "recipe",
    suffix: ".json",
    declval: (): Recipe => { throw new Error ('unreachable') },
    get default_value (): Recipe {
      return {
        type: 'crafting_special_armordye'
      }
    },
  },
  "structure": {
    pack_type: 'data',
    folder: "structure",
    suffix: ".nbt",
    declval: (): Uint8Array => { throw new Error ('unreachable') },
    get default_value (): Uint8Array {
      throw new Error ('not implemented')
    },
  },
  "tag/block": {
    pack_type: 'data',
    folder: "tags/block",
    suffix: ".json",
    declval: (): Tag => { throw new Error ('unreachable') },
    get default_value (): Tag {
      return {
        values: []
      }
    },
  },
  "tag/damage_type": {
    pack_type: 'data',
    folder: "tags/damage_type",
    suffix: ".json",
    declval: (): Tag => { throw new Error ('unreachable') },
    get default_value (): Tag {
      return {
        values: []
      }
    },
  },
  "tag/entity_type": {
    pack_type: 'data',
    folder: "tags/entity_type",
    suffix: ".json",
    declval: (): Tag => { throw new Error ('unreachable') },
    get default_value (): Tag {
      return {
        values: []
      }
    },
  },
  "tag/fluid": {
    pack_type: 'data',
    folder: "tags/fluid",
    suffix: ".json",
    declval: (): Tag => { throw new Error ('unreachable') },
    get default_value (): Tag {
      return {
        values: []
      }
    },
  },
  "tag/function": {
    pack_type: 'data',
    folder: "tags/function",
    suffix: ".json",
    declval: (): Tag => { throw new Error ('unreachable') },
    get default_value (): Tag {
      return {
        values: []
      }
    },
  },
  "tag/game_event": {
    pack_type: 'data',
    folder: "tags/game_event",
    suffix: ".json",
    declval: (): Tag => { throw new Error ('unreachable') },
    get default_value (): Tag {
      return {
        values: []
      }
    },
  },
  "tag/item": {
    pack_type: 'data',
    folder: "tags/item",
    suffix: ".json",
    declval: (): Tag => { throw new Error ('unreachable') },
    get default_value (): Tag {
      return {
        values: []
      }
    },
  },
  "lang": {
    pack_type: 'assets',
    folder: "lang",
    suffix: ".json",
    declval: (): {[k in string]: string} => { throw new Error ('unreachable') },
    get default_value (): {[k in string]: string} {
      return {}
    },
  },
} as const
export type ResourceCategory = keyof typeof ResourceCategory
export type DataResourceCategory = {[k in ResourceCategory]: typeof ResourceCategory[k]['pack_type'] extends 'data' ? k : never}[ResourceCategory]
export type AssetsResourceCategory = {[k in ResourceCategory]: typeof ResourceCategory[k]['pack_type'] extends 'assets' ? k : never}[ResourceCategory]

// type ResourceLocationLetter = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h' | 'i' | 'j' | 'k' | 'l' | 'm' | 'n' | 'o' | 'p' | 'q' | 'r' | 's' | 't' | 'u' | 'v' | 'w' | 'x' | 'y' | 'z' | '_'

export class ResourceLocation
{
  private static readonly DEFAULT_NAMESPACE = 'minecraft'

  private constructor (
    public readonly namespace: string,
    public readonly path: string
  )
  {}

  static fromNamespaceAndPath (namespace: string, path: string)
  {
    if (! (/^[-.0-9_a-z]*$/.test (namespace) && /^[-./0-9_a-z]*$/.test (path)))
    {
      throw new Error (`ResourceLocation Error» ${namespace}:${path} is not a valid ResourceLocation`)
    }
    return new ResourceLocation (namespace || ResourceLocation.DEFAULT_NAMESPACE, path)
  }

  static fromString (str: string)
  {
    // wikiによると空文字列でもいいらしい (':'と同じ)
    const colon = str.indexOf (':')
    if (colon !== -1)
    {
      const colon_len = 1

      const namespace = str.slice (0, colon) || ResourceLocation.DEFAULT_NAMESPACE
      const path = str.slice (colon + colon_len)

      return ResourceLocation.fromNamespaceAndPath (namespace, path)
    }
    else
    {
      return ResourceLocation.fromNamespaceAndPath (ResourceLocation.DEFAULT_NAMESPACE, str)
    }
  }

  static fromPathComponents (parts: readonly string[])
  {
    const re = /^[-.0-9_a-z]*$/
    if (! parts.every ((x) => re.test (x)))
    {
      throw new Error (`ResourceLocation Error» ${JSON.stringify (parts)} is invalid path components`)
    }
    return new ResourceLocation (parts[0] || ResourceLocation.DEFAULT_NAMESPACE, parts.slice (1).join ('/'))
  }

  toFullString ()
  {
    return `${this.namespace}:${this.path}`
  }

  toString ()
  {
    return this.namespace === ResourceLocation.DEFAULT_NAMESPACE ? (this.path || ':') : this.toFullString ()
  }
}

export const path_of_resource = (category: ResourceCategory, location: ResourceLocation | string | string[]) => {
  if (category === 'pack.mcmeta')
  {
    return 'pack.mcmeta'
  }

  if (typeof location === 'string')
  {
    location = ResourceLocation.fromString (location)
  }
  else if (location instanceof Array)
  {
    location = ResourceLocation.fromPathComponents (location)
  }
  return `${ResourceCategory[category].pack_type}/${location.namespace}/${ResourceCategory[category].folder}/${location.path}${ResourceCategory[category].suffix}`
}

type RequireOne <T, K extends keyof T = keyof T> = K extends keyof T ? {[k in K]-?: Exclude <T[k], undefined>} & T : never


//#region UtilityType
export type Ranged <T> = T | {
  min?: T
  max?: T
}
export type NumberProvider = number | {
  type: 'constant'
  value: number
} | {
  type: 'uniform'
  min?: NumberProvider
  max?: NumberProvider
} | {
  type: 'binomial'
  n: NumberProvider
  p: NumberProvider
} | {
  type: 'score'
  target: {
    type: 'fixed'
    name: string
  } | {
    type: 'context'
    target: 'this' | 'killer' | 'direct_killer' | 'killer_player'
  }
  score: string
  scale?: number
}
export type UUID_hex_string = string
//#endregion

export type PackMCMeta = {
  pack: {
    pack_format: number
    description: string | TellrawJSONComponent | (string | TellrawJSONComponent)[]
    supported_formats?: number | number[] | {
      min_inclusive: number
      max_inclusive: number
    }
  }
  filter?: {
    block: {
      namespace: string
      path: string
    }[]
  }
  overlays?: {
    entries: {
      formats: number | number[] | {
        min_inclusive: number
        max_inclusive: number
      }
      directory: string
    }[]
  }

  // resource pack
  language?: {
    [k in string]: {
      name: string
      region: string
      bidirectional: boolean
    }
  }
}

export type DimensionType = Record <string, unknown>

export type DamageType = {
  exhaustion: number
  message_id: string
  scaling: 'never' | 'always' | 'when_caused_by_living_non_player'
  death_message_type?: 'default' | 'fall_variants' | 'intentional_game_design'
}

//#region Predicate
export type ItemPredicate = {
  items?: string[]
  count?: Ranged <number>
  components?: any
  predicates?: any
  durability?: Ranged <number>
  enchantments?: {
    enchantment: string
    levels: Ranged <number>
  }[]
  stored_enchantments?: {
    enchantment: string
    levels: Ranged <number>
  }[]
  nbt?: string
  potion?: string
  tag?: string
}
export type DamageTypePredicate = {
  direct_entity?: EntityPredicate
  source_entity?: EntityPredicate
  tags?: {
    id: string
    expected: boolean
  }[]
}
export type DamagePredicate = {
  blocked?: boolean
  dealt?: Ranged <number>
  taken?: Ranged <number>
  type?: DamageTypePredicate
  source_entity?: EntityPredicate
}
export type DistancePredicate = {
  absolute?: Ranged <number>
  horizontal?: Ranged <number>
  x?: Ranged <number>
  y?: Ranged <number>
  z?: Ranged <number>
}
export type EffectsPredicate = {
  [effect_name in string]: {
    ambient?: boolean
    amplifier?: Ranged <number>
    duration?: Ranged <number>
    visible?: boolean
  }
}
export type EntityPredicate = {
  distance?: DistancePredicate
  effects?: EffectsPredicate
  equipment?: {
    mainhand?: ItemPredicate
    offhand?: ItemPredicate
    head?: ItemPredicate
    chest?: ItemPredicate
    legs?: ItemPredicate
    feet?: ItemPredicate
  }
  flags?: {
    is_baby?: boolean
    is_on_fire?: boolean
    is_sneaking?: boolean
    is_sprinting?: boolean
    is_swimming?: boolean
  }
  location?: LocationPredicate
  nbt?: string
  passenger?: EntityPredicate
  stepping_on?: LocationPredicate
  team?: string
  type?: string
  targeted_entity?: EntityPredicate
  vehicle?: EntityPredicate
  type_specific?: {
    type: 'cat'
    variant?: string
  } | {
    type: 'fishing_hook'
    in_open_water?: boolean
  } | {
    type: 'frog'
    variant?: string
  } | {
    type: 'lightning'
    blocks_set_on_fire?: Ranged <number>
    entity_struck?: EntityPredicate
  } | {
    type: 'player'
    looking_at?: EntityPredicate
    advancements?: {
      [advancement_id in string]: boolean | {
        [criterion_id in string]: boolean
      }
    }
    gamemode?: 'survival' | 'creative' | 'adventure' | 'spectator'
    level?: Ranged <number>
    recipes?: {
      [recipe_id in string]: boolean
    }
    stats?: {
      type: string
      stat: string
      value: Ranged <number>
    }[]
  } | {
    type: 'slime'
    size?: Ranged <number>
  }
}
export type LocationPredicate = {
  biome?: string
  block?: {
    blocks?: string[]
    tag?: string
    nbt?: string
    state?: {
      [k in string]: Ranged <boolean | number | string>
    }
  }
  dimension?: string
  fluid?: {
    fluid?: string
    tag?: string
    state?: {
      [k in string]: Ranged <boolean | number | string>
    }
  }
  light?: Ranged <number>
  position?: {
    x?: Ranged <number>
    y?: Ranged <number>
    z?: Ranged <number>
  }
  smokey?: boolean
  structure?: string
}
export type Predicate = ({
  condition: `${'minecraft:' | ''}all_of`
  terms: Predicate[]
} | {
  condition: `${'minecraft:' | ''}${'alternative' | 'any_of'}`
  terms: Predicate[]
} | {
  condition: `${'minecraft:' | ''}block_state_property`
  block?: string
  properties?: {
    [k in string]: Ranged <boolean | number | string>
  }
} | {
  condition: `${'minecraft:' | ''}damage_source_properties`
  predicate: DamageTypePredicate
} | {
  condition: `${'minecraft:' | ''}entity_properties`
  entity: 'this' | 'killer' | 'direct_killer' | 'killer_player'
  predicate: EntityPredicate
} | {
  condition: `${'minecraft:' | ''}entity_scores`
  entity: 'this' | 'killer' | 'direct_killer' | 'killer_player'
  scores: {
    [k in string]: number | {
      min?: NumberProvider
      max?: NumberProvider
    }
  }
} | {
  condition: `${'minecraft:' | ''}inverted`
  term: Predicate
} | {
  condition: `${'minecraft:' | ''}killed_by_player`
} | {
  condition: `${'minecraft:' | ''}location_check`
  offsetX?: number
  offsetY?: number
  offsetZ?: number
  predicate: LocationPredicate
} | {
  condition: `${'minecraft:' | ''}match_tool`
  predicate: ItemPredicate
} | {
  condition: `${'minecraft:' | ''}random_chance`
  chance: number
} | {
  condition: `${'minecraft:' | ''}random_chance_with_looting`
  chance: number
  looting_multiplier: number
} | {
  condition: `${'minecraft:' | ''}reference`
  name: string
} | {
  condition: `${'minecraft:' | ''}survives_explosion`
} | {
  condition: `${'minecraft:' | ''}table_bonus`
  enchantment: string
  chances: number[]
} | {
  condition: `${'minecraft:' | ''}time_check`
  value: number | {
    min?: NumberProvider
    max?: NumberProvider
  }
  period?: number
} | {
  condition: `${'minecraft:' | ''}value_check`
  value: NumberProvider
  range: number | {
    min?: NumberProvider
    max?: NumberProvider
  }
} | {
  condition: `${'minecraft:' | ''}weather_check`
  raining?: boolean
  thundering?: boolean
})
//#endregion

//#region ItemModifier
export type ItemModifier = (({
  function: `${'minecraft:' | ''}apply_bonus`
  enchantment: string
  formula: string
  parameters: {
    extra?: number
    probability?: number
    bonusMultiplier?: number
  }[]
} | {
  function: `${'minecraft:' | ''}copy_name`
  source: 'block_entity' | 'this' | 'killer' | 'killer_player'
} | {
  function: `${'minecraft:' | ''}copy_nbt`
  source: 'block_entity' | 'this' | 'killer' | 'direct_killer' | 'killer_player' | {
    type: 'context'
    target: 'block_entity' | 'this' | 'killer' | 'direct_killer' | 'killer_player'
  } | {
    type: 'storage'
    source: string
  }
  ops: {
    source: string
    target: string
    op: 'replace' | 'append' | 'merge'
  }[]
} | {
  function: `${'minecraft:' | ''}copy_state`
  block: string
  properties: string[]
} | {
  function: `${'minecraft:' | ''}enchant_randomly`
  enchantments?: string[]
} | {
  function: `${'minecraft:' | ''}enchant_with_levels`
  treasure?: boolean
  levels: NumberProvider
} | {
  function: `${'minecraft:' | ''}exploration_map`
  destination?: string
  decoration?: string
  zoom?: number
  search_radius?: number
  skip_existing_chunks?: boolean
} | {
  function: `${'minecraft:' | ''}explosion_decay`
} | {
  function: `${'minecraft:' | ''}fill_player_head`
  entity: 'this' | 'killer' | 'direct_killer' | 'killer_player'
} | {
  function: `${'minecraft:' | ''}furnace_smelt`
} | {
  function: `${'minecraft:' | ''}limit_count`
  limit: number | {
    min?: NumberProvider
    max?: NumberProvider
  }
} | {
  function: `${'minecraft:' | ''}looting_enchant`
  count: NumberProvider
  limit?: number
} | {
  function: `${'minecraft:' | ''}reference`
  name: string
} | {
  function: `${'minecraft:' | ''}set_attributes`
  modifiers: {
    name: string
    attribute: string
    operation: 'addition' | 'multiply_base' | 'multiply_total'
    amount: NumberProvider
    id?: UUID_hex_string
    slot: 'mainhand' | 'offhand' | 'feet' | 'legs' | 'chest' | 'head' | ('mainhand' | 'offhand' | 'feet' | 'legs' | 'chest' | 'head')[]
  }[]
} | {
  function: `${'minecraft:' | ''}set_banner_pattern`
  patterns: {
    pattern: string
    color: string
    append: boolean
  }[]
} | {
  function: `${'minecraft:' | ''}set_components`
  components: {[k in string]: any}
} | {
  function: `${'minecraft:' | ''}set_contents`
  entries: LootTableEntryProvider[]
  type: string
} | {
  function: `${'minecraft:' | ''}set_count`
  count: NumberProvider
  add?: boolean
} | {
  function: `${'minecraft:' | ''}set_damage`
  damage: NumberProvider
  add?: boolean
} | {
  function: `${'minecraft:' | ''}set_enchantments`
  enchantments: {
    [k in string]: NumberProvider
  }[]
  add?: boolean
} | {
  function: `${'minecraft:' | ''}set_instrument`
  options: string
} | {
  function: `${'minecraft:' | ''}set_loot_table`
  name: string
  seed?: number
  type: string
} | {
  function: `${'minecraft:' | ''}set_lore`
  lore: (TellrawJSONComponent[] | TellrawJSONComponent)[]
  entity: 'this' | 'killer' | 'direct_killer' | 'killer_player'
  replace?: boolean
} | {
  function: `${'minecraft:' | ''}set_name`
  name: TellrawJSONComponent[] | TellrawJSONComponent
  entity: 'this' | 'killer' | 'direct_killer' | 'killer_player'
} | {
  function: `${'minecraft:' | ''}set_nbt`
  tag: string
} | {
  function: `${'minecraft:' | ''}set_potion`
  id: string
} | {
  function: `${'minecraft:' | ''}set_stew_effect`
  effects: {
    type: string
    duration: NumberProvider
  }[]
}) & {
  conditions?: Predicate[]
})
//#endregion

//#region LootTable
export type LootTableEntryProvider = (({
  type: `${'minecraft:' | ''}item`
  functions?: ItemModifier[]
  weight?: number
  quality?: number
  name: string
} | {
  type: `${'minecraft:' | ''}tag`
  functions?: ItemModifier[]
  weight?: number
  quality?: number
  name: string
  expand?: boolean
} | {
  type: `${'minecraft:' | ''}loot_table`
  functions?: ItemModifier[]
  weight?: number
  quality?: number
  name: string
} | {
  type: `${'minecraft:' | ''}dynamic`
  functions?: ItemModifier[]
  weight?: number
  quality?: number
  name: string
} | {
  type: `${'minecraft:' | ''}empty`
  functions?: ItemModifier[]
  weight?: number
  quality?: number
} | {
  type: `${'minecraft:' | ''}group`
  children: LootTableEntryProvider[]
} | {
  type: `${'minecraft:' | ''}alternatives`
  children: LootTableEntryProvider[]
} | {
  type: `${'minecraft:' | ''}sequence`
  children: LootTableEntryProvider[]
}) & {
  conditions?: Predicate[]
})
export type LootTable = {
  type?: string
  functions?: ItemModifier[]
  pools?: {
    conditions?: Predicate[]
    functions?: ItemModifier[]
    rolls: NumberProvider
    bonus_rolls?: NumberProvider
    entries: LootTableEntryProvider[]
  }[]
  random_sequence?: string
}
//#endregion

//#region Advancement
export type Advancement = {
  display?: {
    icon: {
      item: string
      nbt?: string
    }
    title: string | TellrawJSONComponent | (string | TellrawJSONComponent)[]
    frame?: 'task' | 'goal' | 'challenge'
    background?: string
    description: string | TellrawJSONComponent | (string | TellrawJSONComponent)[]
    show_toast?: boolean
    announce_to_chat?: boolean
    hidden?: boolean
  }
  parent?: string
  criteria: {
    [criterion_id in string]: ({
      trigger: `${'minecraft:' | ''}allay_drop_item_on_block`
      conditions?: {
        location?: Predicate[]
      }
    } | {
      trigger: `${'minecraft:' | ''}any_block_use`
      conditions?: {
        location?: Predicate[]
      }
    } | {
      trigger: `${'minecraft:' | ''}avoid_vibration`
    } | {
      trigger: `${'minecraft:' | ''}bee_nest_destroyed`
      conditions?: {
        block?: string
        item?: ItemPredicate
        num_bees_inside?: Ranged <number>
      }
    } | {
      trigger: `${'minecraft:' | ''}bred_animals`
      conditions?: {
        child?: EntityPredicate | EntityPredicate[]
        parent?: EntityPredicate[]
        partner?: EntityPredicate | EntityPredicate[]
      }
    } | {
      trigger: `${'minecraft:' | ''}brewed_potion`
      conditions?: {
        potion?: string
      }
    } | {
      trigger: `${'minecraft:' | ''}changed_dimension`
      conditions?: {
        from?: string
        to?: string
      }
    } | {
      trigger: `${'minecraft:' | ''}channeled_lightning`
      conditions?: {
        victims?: (EntityPredicate | Predicate[])[]
      }
    } | {
      trigger: `${'minecraft:' | ''}construct_beacon`
      conditions?: {
        level?: Ranged <number>
      }
    } | {
      trigger: `${'minecraft:' | ''}consume_item`
      conditions?: {
        item?: ItemPredicate
      }
    } | {
      trigger: `${'minecraft:' | ''}crafter_recipe_crafted`
      conditions: {
        recipe_id: string
        ingredients?: ItemPredicate[]
      }
    } | {
      trigger: `${'minecraft:' | ''}cured_zombie_villager`
      conditions?: {
        villager?: EntityPredicate | Predicate[]
        zombie?: EntityPredicate | Predicate[]
      }
    } | {
      trigger: `${'minecraft:' | ''}default_use_block`
      conditions?: {
        location?: Predicate[]
      }
    } | {
      trigger: `${'minecraft:' | ''}effects_changed`
      conditions?: {
        effects?: EffectsPredicate
        source?: EntityPredicate | Predicate[]
      }
    } | {
      trigger: `${'minecraft:' | ''}enchanted_item`
      conditions?: {
        item?: ItemPredicate
        levels?: Ranged <number>
      }
    } | {
      trigger: `${'minecraft:' | ''}enter_block`
      conditions?: {
        block?: string
        state?: {
          [k in string]: Ranged <boolean | number | string>
        }
      }
    } | {
      trigger: `${'minecraft:' | ''}entity_hurt_player`
      conditions?: {
        damage?: DamagePredicate
      }
    } | {
      trigger: `${'minecraft:' | ''}entity_killed_player`
      conditions?: {
        entity?: EntityPredicate | Predicate[]
        killing_blow?: DamageTypePredicate
      }
    } | {
      trigger: `${'minecraft:' | ''}fall_after_explosion`
      conditions?: {
        start_position?: LocationPredicate
        distance?: DistancePredicate
        source?: EntityPredicate | Predicate[]
      }
    } | {
      trigger: `${'minecraft:' | ''}fall_from_height`
      conditions?: {
        start_position?: LocationPredicate
        distance?: DistancePredicate
      }
    } | {
      trigger: `${'minecraft:' | ''}filled_bucket`
      conditions?: {
        item?: ItemPredicate
      }
    } | {
      trigger: `${'minecraft:' | ''}fishing_rod_hooked`
      conditions?: {
        entity?: EntityPredicate | Predicate[]
        item?: ItemPredicate
        rod?: ItemPredicate
      }
    } | {
      trigger: `${'minecraft:' | ''}hero_of_the_village`
    } | {
      trigger: `${'minecraft:' | ''}impossible`
    } | {
      trigger: `${'minecraft:' | ''}inventory_changed`
      conditions?: {
        items?: ItemPredicate[]
        slots?: {
          empty?: Ranged <number>
          full?: Ranged <number>
          occupied?: Ranged <number>
        }
      }
    } | {
      trigger: `${'minecraft:' | ''}item_durability_changed`
      conditions?: {
        delta?: Ranged <number>
        durability?: Ranged <number>
        item?: ItemPredicate
      }
    } | {
      trigger: `${'minecraft:' | ''}item_used_on_block`
      conditions?: {
        location?: Predicate[]
      }
    } | {
      trigger: `${'minecraft:' | ''}kill_mob_near_sculk_catalyst`
      conditions?: {
        entity?: EntityPredicate | Predicate[]
        killing_blow?: DamageTypePredicate
      }
    } | {
      trigger: `${'minecraft:' | ''}killed_by_crossbow`
      conditions?: {
        unique_entity_types?: Ranged <number>
        victims?: (EntityPredicate | Predicate[])[]
      }
    } | {
      trigger: `${'minecraft:' | ''}levitation`
      conditions?: {
        distance?: DistancePredicate
        duration?: Ranged <number>
      }
    } | {
      trigger: `${'minecraft:' | ''}lightning_strike`
      conditions?: {
        lightning?: EntityPredicate | Predicate[]
        bystander?: EntityPredicate | Predicate[]
      }
    } | {
      trigger: `${'minecraft:' | ''}location`
    } | {
      trigger: `${'minecraft:' | ''}nether_travel`
      conditions?: {
        start_position?: LocationPredicate
        distance?: DistancePredicate
      }
    } | {
      trigger: `${'minecraft:' | ''}placed_block`
      conditions?: {
        location?: Predicate[]
      }
    } | {
      trigger: `${'minecraft:' | ''}player_generates_container_loot`
      conditions?: {
        loot_table: string
      }
    } | {
      trigger: `${'minecraft:' | ''}player_hurt_entity`
      conditions?: {
        damage?: DamagePredicate
        entity?: EntityPredicate | Predicate[]
      }
    } | {
      trigger: `${'minecraft:' | ''}player_interacted_with_entity`
      conditions?: {
        item?: ItemPredicate
        entity?: EntityPredicate | Predicate[]
      }
    } | {
      trigger: `${'minecraft:' | ''}player_killed_entity`
      conditions?: {
        entity?: EntityPredicate | Predicate[]
        killing_blow?: DamageTypePredicate
      }
    } | {
      trigger: `${'minecraft:' | ''}recipe_crafted`
      conditions: {
        recipe_id: string
        ingredients?: ItemPredicate[]
      }
    } | {
      trigger: `${'minecraft:' | ''}recipe_unlocked`
      conditions?: {
        recipe: string
      }
    } | {
      trigger: `${'minecraft:' | ''}ride_entity_in_lava`
      conditions?: {
        start_position?: LocationPredicate
        distance?: DistancePredicate
      }
    } | {
      trigger: `${'minecraft:' | ''}shot_crossbow`
      conditions?: {
        item?: ItemPredicate
      }
    } | {
      trigger: `${'minecraft:' | ''}slept_in_bed`
    } | {
      trigger: `${'minecraft:' | ''}slide_down_block`
      conditions?: {
        block?: string
        state?: {
          [k in string]: Ranged <boolean | number | string>
        }
      }
    } | {
      trigger: `${'minecraft:' | ''}started_riding`
    } | {
      trigger: `${'minecraft:' | ''}summoned_entity`
      conditions?: {
        entity?: EntityPredicate | Predicate[]
      }
    } | {
      trigger: `${'minecraft:' | ''}tame_animal`
      conditions?: {
        entity?: EntityPredicate | Predicate[]
      }
    } | {
      trigger: `${'minecraft:' | ''}target_hit`
      conditions?: {
        signal_strength?: Ranged <boolean | number | string>
        projectile?: EntityPredicate | Predicate[]
      }
    } | {
      trigger: `${'minecraft:' | ''}thrown_item_picked_up_by_entity`
      conditions?: {
        item?: ItemPredicate
        entity?: EntityPredicate | Predicate[]
      }
    } | {
      trigger: `${'minecraft:' | ''}thrown_item_picked_up_by_player`
      conditions?: {
        item?: ItemPredicate
        entity?: EntityPredicate | Predicate[]
      }
    } | {
      trigger: `${'minecraft:' | ''}tick`
    } | {
      trigger: `${'minecraft:' | ''}used_ender_eye`
      conditions?: {
        distance?: Ranged <number>
      }
    } | {
      trigger: `${'minecraft:' | ''}used_totem`
      conditions?: {
        item?: ItemPredicate
      }
    } | {
      trigger: `${'minecraft:' | ''}using_item`
      conditions?: {
        item?: ItemPredicate
      }
    } | {
      trigger: `${'minecraft:' | ''}villager_trade`
      conditions?: {
        item?: ItemPredicate
        villager?: EntityPredicate | Predicate[]
      }
    } | {
      trigger: `${'minecraft:' | ''}voluntary_exile`
    }) & {
      conditions?: {
        player?: EntityPredicate | Predicate[]
      }
    }
  }
  requirements?: string[][]
  rewards?: {
    recipes?: string[]
    loot?: string[]
    experience?: number
    function?: string
  }
  sends_telemetry_event?: boolean
}
//#endregion

//#region Recipe
export type CraftingShapedRecipe = {
  type: `${'minecraft:' | ''}crafting_shaped`
  group?: string
  key: {
    [k: string]: {
      item: string
      tag?: undefined
    } | {
      item?: undefined
      tag: string
    }
  }
  pattern: string[]
  result: {
    item: string
    count?: number
  }
}
export type CraftingShapelessRecipe = {
  type: `${'minecraft:' | ''}crafting_shapeless`
  group?: string
  ingredients: {
    item: string
    tag?: undefined
  } | {
    item?: undefined
    tag: string
  }[]
  result: {
    item: string
    count?: number
  }
}
export type SmeltingRecipe = {
  type: `${'minecraft:' | ''}${'smelting' | 'blasting' | 'smoking' | 'campfire_cooking'}`
  group?: string
  cookingtime?: number
  experience?: number
  ingredient: {
      item: string
      tag?: undefined
    } | {
      item?: undefined
      tag: string
    }
  result: string
}
export type StoneCuttingRecipe = {
  type: `${'minecraft:' | ''}stonecutting`
  group?: string
  ingredient: {
      item: string
      tag?: undefined
    } | {
      item?: undefined
      tag: string
    }
  result: string
  count: number
}
export type SmithingRecipe = {
  type: `${'minecraft:' | ''}smithing`
  group?: string
  base: {
      item: string
      tag?: undefined
    } | {
      item?: undefined
      tag: string
    }
  addition: {
      item: string
      tag?: undefined
    } | {
      item?: undefined
      tag: string
    }
  result: {
    item: string,
    count?: number
  }
}
export type SpecialRecipe = {
  type: `${'minecraft:' | ''}crafting_special_${'armordye' | 'bannerduplicate' | 'bookcloning' | 'firework_rocket' | 'firework_star' | 'firework_star_fade' | 'mapcloning' | 'mapextending' | 'repairitem' | 'shielddecoration' | 'shulkerboxcoloring' | 'suspiciousstew' | 'tippedarrow'}`
}
export type Recipe = CraftingShapedRecipe | CraftingShapelessRecipe | SmeltingRecipe | StoneCuttingRecipe | SmithingRecipe | SpecialRecipe
//#endregion

export type Tag = {
  replace?: boolean
  values: (string | {id: string, required?: boolean})[]
}

export type TellrawJSONComponent = ({
  text: string
} | {
  translate: string
  with?: (string | TellrawJSONComponent)[]
} | {
  score: {
    name: string
    objective: string
    value?: string
  }
} | {
  selector: string
  separator?: string
} | {
  keybind: string
} | {
  block: string
  nbt: string
  interpret?: boolean
  separator?: string
} | {
  entity: string
  nbt: string
  interpret?: boolean
  separator?: string
} | {
  storage: string
  nbt: string
  interpret?: boolean
  separator?: string
}) & {
  extra?: (string | TellrawJSONComponent)[]
  color?: `#${string}` | 'black' | 'dark_blue' | 'dark_green' | 'dark_aqua' | 'dark_red' | 'dark_purple' | 'gold' | 'gray' | 'dark_gray' | 'blue' | 'green' | 'aqua' | 'red' | 'light_purple' | 'yellow' | 'white'
  font?: string
  bold?: boolean
  italic?: boolean
  underlined?: boolean
  strikethrough?: boolean
  obfuscated?: boolean
  insertion?: string
  clickEvent?: {
    action: 'open_url' | 'open_file' | 'run_command' | 'suggest_command' | 'change_page' | 'copy_to_clipboard'
    value: string
  }
  hoverEvent?: {
    action: 'show_text'
    contents: string | TellrawJSONComponent | (string | TellrawJSONComponent)[]
  } | {
    action: 'show_item'
    contents: {
      id: string
      count?: number
      tag?: object
    }
  } | {
    action: 'show_entity'
    contents: {
      name?: TellrawJSONComponent,
      type: string
      id: string
    }
  }
}

export type ResourceType <T extends ResourceCategory> = typeof ResourceCategory[T]['default_value']

export const readResource: {
  <T extends ResourceCategory> (path_of_datapack: string, category: T, location: ResourceLocation | string): Promise <ResourceType <T>>
} = async (path_of_datapack: string, category: ResourceCategory, location: ResourceLocation | string) =>
{
  const path = `${path_of_datapack}/${path_of_resource (category, location)}`
  if (ResourceCategory[category].suffix === '.mcfunction')
  {
    return await Deno.readTextFile (path)
  }
  else if (ResourceCategory[category].suffix === '.json')
  {
    const text = await Deno.readTextFile (path)
    return JSON.parse (text)
  }
  else if (ResourceCategory[category].suffix === '.nbt')
  {
    return await Deno.readFile (path)
  }
}

async function * enumurate_files (dir: string): AsyncIterableIterator <string>
{
  for await (const entry of Deno.readDir (dir))
  {
    const path = stdpath.join (dir, entry.name)
    if (entry.isFile)
    {
      yield path
    }
    else if (entry.isDirectory)
    {
      yield * enumurate_files (path)
    }
  }
}

export async function * readResources <T extends ResourceCategory> (path_of_datapack: string, category: T, location: ResourceLocation | string) {
  if (typeof location === 'string')
  {
    location = ResourceLocation.fromString (location)
  }
  if (! (location.path === '' || location.path.endsWith ('/')))
  {
    location = ResourceLocation.fromNamespaceAndPath (location.namespace, `${location.path}/`)
  }
  const dir = stdpath.dirname (`${path_of_datapack}/${path_of_resource (category, location)}`)
  const root = stdpath.dirname (`${path_of_datapack}/${path_of_resource (category, ResourceLocation.fromNamespaceAndPath (location.namespace, ''))}`)
  for await (const path of enumurate_files (dir))
  {
    if (path.endsWith (ResourceCategory[category].suffix))
    {
      const relative = stdpath.relative (root, path)
      const entryLocation = ResourceLocation.fromNamespaceAndPath (location.namespace, relative.slice (0, - ResourceCategory[category].suffix.length))
      yield {path, location: entryLocation, data: await readResource (path_of_datapack, category, entryLocation)}
    }
  }
}

const append_ln_if_missing = (text: string) => text.endsWith ('\n') ? text : `${text}\n`

const array_equals = (a: Uint8Array, b: Uint8Array) => {
  if (a.length !== b.length)
  {
    return false
  }

  for (let i = 0; i < a.length; ++ i)
  {
    if (! (a[i] === b[i]))
    {
      return false
    }
  }

  return true
}

export const writeResource: {
  <T extends ResourceCategory> (path_of_pack: string, category: T, location: ResourceLocation | string, data: ResourceType <T>): Promise <void>
} = async (path_of_pack: string, category: ResourceCategory, location: ResourceLocation | string, data: any) =>
{
  const path = `${path_of_pack}/${path_of_resource (category, location)}`
  if (ResourceCategory[category].suffix === '.mcfunction')
  {
    const old_content = await Deno.readTextFile (path).catch ((e) => { if (e instanceof Deno.errors.NotFound) return undefined; throw e } )
    const new_content = append_ln_if_missing (data)
    if (old_content != null && old_content === new_content)
    {
      console.log (`${location} has the same content. skipped.`)
    }
    else
    {
      await Deno.mkdir (stdpath.dirname (path), {recursive: true})
      await Deno.writeTextFile (path, new_content)
    }
  }
  else if (ResourceCategory[category].suffix === '.json')
  {
    const old_content = await Deno.readTextFile (path).catch ((e) => { if (e instanceof Deno.errors.NotFound) return undefined; throw e } )
    const new_content = append_ln_if_missing (JSON.stringify (data, undefined, 2))
    if (old_content != null && old_content === new_content)
    {
      console.log (`${location} has the same content. skipped.`)
    }
    else
    {
      await Deno.mkdir (stdpath.dirname (path), {recursive: true})
      await Deno.writeTextFile (path, new_content)
    }
  }
  else if (ResourceCategory[category].suffix === '.nbt')
  {
    const old_content = await Deno.readFile (path).catch ((e) => { if (e instanceof Deno.errors.NotFound) return undefined; throw e } )
    const new_content = data
    if (old_content != null && array_equals (old_content, new_content))
    {
      console.log (`${location} has the same content. skipped.`)
    }
    else
    {
      await Deno.mkdir (stdpath.dirname (path), {recursive: true})
      await Deno.writeFile (path, new_content)
    }
  }
  else
  {
    throw new Error ('unreachable')
  }
}

export const removeResource = async (path_of_pack: string, category: ResourceCategory, location: ResourceLocation | string) =>
{
  const path = `${path_of_pack}/${path_of_resource (category, location)}`
  await Deno.remove (path)
}

