import * as stdpath from 'https://deno.land/std@0.182.0/path/mod.ts'

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
  "advancement": {
    folder: "advancements",
    suffix: ".json",
    declval: (): Advancement => { throw new Error ('unreachable') },
  },
  "damage_type": {
    folder: "damage_type",
    suffix: ".json",
    declval: (): DamageType => { throw new Error ('unreachable') },
  },
  "dimension_type": {
    folder: "dimension_type",
    suffix: ".json",
    declval: (): DimensionType => { throw new Error ('unreachable') },
  },
  "function": {
    folder: "functions",
    suffix: ".mcfunction",
    declval: (): string => { throw new Error ('unreachable') },
  },
  "item_modifier": {
    folder: "item_modifiers",
    suffix: ".json",
    declval: (): ItemModifier | ItemModifier[] => { throw new Error ('unreachable') },
  },
  "loot_table": {
    folder: "loot_tables",
    suffix: ".json",
    declval: (): LootTable => { throw new Error ('unreachable') },
  },
  "predicate": {
    folder: "predicates",
    suffix: ".json",
    declval: (): Predicate | Predicate[] => { throw new Error ('unreachable') },
  },
  "recipe": {
    folder: "recipes",
    suffix: ".json",
    declval: (): Recipe => { throw new Error ('unreachable') },
  },
  "structure": {
    folder: "structures",
    suffix: ".nbt",
    declval: (): Uint8Array => { throw new Error ('unreachable') },
  },
  "tag/block": {
    folder: "tags/blocks",
    suffix: ".json",
    declval: (): Tag => { throw new Error ('unreachable') },
  },
  "tag/damage_type": {
    folder: "tags/damage_type",
    suffix: ".json",
    declval: (): Tag => { throw new Error ('unreachable') },
  },
  "tag/entity_type": {
    folder: "tags/entity_types",
    suffix: ".json",
    declval: (): Tag => { throw new Error ('unreachable') },
  },
  "tag/fluid": {
    folder: "tags/fluids",
    suffix: ".json",
    declval: (): Tag => { throw new Error ('unreachable') },
  },
  "tag/function": {
    folder: "tags/functions",
    suffix: ".json",
    declval: (): Tag => { throw new Error ('unreachable') },
  },
  "tag/game_event": {
    folder: "tags/game_events",
    suffix: ".json",
    declval: (): Tag => { throw new Error ('unreachable') },
  },
  "tag/item": {
    folder: "tags/items",
    suffix: ".json",
    declval: (): Tag => { throw new Error ('unreachable') },
  },
} as const
export type ResourceCategory = keyof typeof ResourceCategory

export class ResourceLocation
{
  constructor (
    public readonly namespace: string,
    public readonly path: string
  )
  {
  }

  static fromString (str: string)
  {
    if (str.includes (':'))
    {
      const [namespace, path] = str.split (':')
      return new ResourceLocation (namespace || 'minecraft', path)
    }
    else
    {
      return new ResourceLocation ('minecraft', str)
    }
  }

  toFullString ()
  {
    return `${this.namespace}:${this.path}`
  }

  toString ()
  {
    return this.namespace === 'minecraft' ? (this.path || ':') : this.toFullString ()
  }
}

export const path_of_resource = (path_of_datapack: string, category: ResourceCategory, location: ResourceLocation | string) => {
  if (typeof location === 'string')
  {
    location = ResourceLocation.fromString (location)
  }
  return `${path_of_datapack}/data/${location.namespace}/${ResourceCategory[category].folder}/${location.path}${ResourceCategory[category].suffix}`
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

export type DimensionType = {}

export type DamageType = {
  exhaustion: number
  message_id: string
  scaling: 'never' | 'always' | 'when_caused_by_living_non_player'
  death_message_type?: 'default' | 'fall_variants' | 'intentional_game_design'
}

//#region Predicate
export type ItemPredicate = {
  count?: Ranged <number>
  durability?: Ranged <number>
  enchantments?: {
    enchantment: string
    levels: Ranged <number>
  }[]
  stored_enchantments?: {
    enchantment: string
    levels: Ranged <number>
  }[]
  items?: string[]
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
  condition: `${'minecraft:' | ''}alternative`
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
  lore: any[]
  entity: 'this' | 'killer' | 'direct_killer' | 'killer_player'
  replace?: boolean
} | {
  function: `${'minecraft:' | ''}set_name`
  name: any
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
  conditions: Predicate[]
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
}
//#endregion

//#region Advancement
export type Advancement = {
  display?: {
    icon: {
      item: string
      nbt?: string
    }
    title: any
    frame?: 'task' | 'goal' | 'challenge'
    background?: string
    description: any
    show_toast?: boolean
    announce_to_chat?: boolean
    hidden?: boolean
  }
  parent?: string
  criteria: {
    [criterion_id in string]: ({
      trigger: `${'minecraft:' | ''}allay_drop_item_on_block`
      location?: LocationPredicate
      item?: ItemPredicate
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
      trigger: `${'minecraft:' | ''}cured_zombie_villager`
      conditions?: {
        villager?: EntityPredicate | Predicate[]
        zombie?: EntityPredicate | Predicate[]
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
        location?: LocationPredicate
        item?: ItemPredicate
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
        block?: string
        item?: ItemPredicate
        location?: LocationPredicate
        state?: {
          [k in string]: Ranged <boolean | number | string>
        }
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
}
//#endregion

//#region Recipe
export type CraftingShapedRecipe = {
  type: `${'minecraft:' | ''}crafting_shaped`
  group?: string
  key: {
    [k: string]: {
      item: string
      tag: undefined
    } | {
      item: undefined
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
    tag: undefined
  } | {
    item: undefined
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
      tag: undefined
    } | {
      item: undefined
      tag: string
    }
  result: string
}
export type StoneCuttingRecipe = {
  type: `${'minecraft:' | ''}stonecutting`
  group?: string
  ingredient: {
      item: string
      tag: undefined
    } | {
      item: undefined
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
      tag: undefined
    } | {
      item: undefined
      tag: string
    }
  addition: {
      item: string
      tag: undefined
    } | {
      item: undefined
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

export type ResourceType <T extends ResourceCategory> = ReturnType <typeof ResourceCategory[T]['declval']>

export const readResource: {
  <T extends ResourceCategory> (path_of_datapack: string, category: T, location: ResourceLocation | string): Promise <ResourceType <T>>
} = async (path_of_datapack: string, category: ResourceCategory, location: ResourceLocation | string) =>
{
  const path = path_of_resource (path_of_datapack, category, location)
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
    location = new ResourceLocation (location.namespace, `${location.path}/`)
  }
  const dir = stdpath.dirname (path_of_resource (path_of_datapack, category, location))
  const root = stdpath.dirname (path_of_resource (path_of_datapack, category, new ResourceLocation (location.namespace, '')))
  for await (const path of enumurate_files (dir))
  {
    if (path.endsWith (ResourceCategory[category].suffix))
    {
      const relative = stdpath.relative (root, path)
      const entryLocation = new ResourceLocation (location.namespace, relative.slice (0, - ResourceCategory[category].suffix.length))
      yield {path, location: entryLocation, data: await readResource (path_of_datapack, category, entryLocation)}
    }
  }
}

const append_ln_if_missing = (text: string) => text.endsWith ('\n') ? text : `${text}\n`

export const writeResource: {
  <T extends ResourceCategory> (path_of_datapack: string, category: T, location: ResourceLocation | string, data: ResourceType <T>): Promise <void>
} = async (path_of_datapack: string, category: ResourceCategory, location: ResourceLocation | string, data: any) =>
{
  const path = path_of_resource (path_of_datapack, category, location)
  if (ResourceCategory[category].suffix === '.mcfunction')
  {
    await Deno.mkdir (stdpath.dirname (path), {recursive: true})
    await Deno.writeTextFile (path, append_ln_if_missing (data))
  }
  else if (ResourceCategory[category].suffix === '.json')
  {
    await Deno.mkdir (stdpath.dirname (path), {recursive: true})
    await Deno.writeTextFile (path, append_ln_if_missing (JSON.stringify (data, undefined, 2)))
  }
  else if (ResourceCategory[category].suffix === '.nbt')
  {
    await Deno.mkdir (stdpath.dirname (path), {recursive: true})
    await Deno.writeFile (path, data)
  }
}

export const removeResource = async (path_of_datapack: string, category: ResourceCategory, location: ResourceLocation | string) =>
{
  const path = path_of_resource (path_of_datapack, category, location)
  await Deno.remove (path)
}
