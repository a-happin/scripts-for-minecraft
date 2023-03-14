import * as stdpath from 'https://deno.land/std@0.178.0/path/mod.ts'

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

export const fetchVersionManifest = (): Promise <VersionManifest> => fetch ('https://launchermeta.mojang.com/mc/game/version_manifest_v2.json').then ((response) => response.json ())

// export type ProcessedRegistries = {
//   [k: string]: readonly string[]
// }
// export const get_registries = (path_of_vanilla_datapack: string) => Deno.readTextFile (stdpath.join (path_of_vanilla_datapack, 'generated', 'reports', 'registries.json')).then ((contents) => {
//   const data: {[k: string]: {entries: {[k: string]: any}}} = JSON.parse (contents)
//   const res: ProcessedRegistries = {}
//   for (const key of Object.keys (data))
//   {
//     res[`${ResourceLocation.fromString (key)}`] = Object.keys (data[key].entries).map ((x) => `${ResourceLocation.fromString (x)}`).sort ()
//   }
//   return res
// })

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

const ResourceCategory = {
  "advancements": {
    folder: "advancements",
    suffix: ".json",
    type: undefined as Advancement | undefined,
  },
  "dimension_type": {
    folder: "dimension_type",
    suffix: ".json",
    type: undefined as DimensionType | undefined,
  },
  "function": {
    folder: "functions",
    suffix: ".mcfunction",
    type: undefined as string | undefined,
  },
  "item_modifier": {
    folder: "item_modifiers",
    suffix: ".json",
    type: undefined as ItemModifier | undefined,
  },
  "loot_table": {
    folder: "loot_tables",
    suffix: ".json",
    type: undefined as LootTable | undefined,
  },
  "predicate": {
    folder: "predicates",
    suffix: ".json",
    type: undefined as Predicate | undefined,
  },
  "recipe": {
    folder: "recipes",
    suffix: ".json",
    type: undefined as Recipe | undefined,
  },
  "structure": {
    folder: "structures",
    suffix: ".nbt",
    type: undefined as Uint8Array | undefined,
  },
  "tag/block": {
    folder: "tags/blocks",
    suffix: ".json",
    type: undefined as Tag | undefined,
  },
  "tag/entity_type": {
    folder: "tags/entity_types",
    suffix: ".json",
    type: undefined as Tag | undefined,
  },
  "tag/fluid": {
    folder: "tags/fluids",
    suffix: ".json",
    type: undefined as Tag | undefined,
  },
  "tag/function": {
    folder: "tags/functions",
    suffix: ".json",
    type: undefined as Tag | undefined,
  },
  "tag/game_event": {
    folder: "tags/game_events",
    suffix: ".json",
    type: undefined as Tag | undefined,
  },
  "tag/item": {
    folder: "tags/items",
    suffix: ".json",
    type: undefined as Tag | undefined,
  },
} as const
type ResourceCategory = keyof typeof ResourceCategory

export const path_of_resource = (path_of_datapack: string, category: ResourceCategory, location: ResourceLocation | string) => {
  if (typeof location === 'string')
  {
    location = ResourceLocation.fromString (location)
  }
  return `${path_of_datapack}/data/${location.namespace}/${ResourceCategory[category].folder}/${location.path}${ResourceCategory[category].suffix}`
}

type RequireOne <T, K extends keyof T = keyof T> = K extends keyof T ? {[k in K]-?: Exclude <T[k], undefined>} & T : never

export type Advancement = {}
export type DimensionType = {}
export type ItemModifier = {}
export type LootTable = {}
export type Predicate = {}

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

export type ResourceType <T extends ResourceCategory> = Exclude <typeof ResourceCategory[T]['type'], undefined>

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

export const writeResource: {
  <T extends ResourceCategory> (path_of_datapack: string, category: T, location: ResourceLocation | string, data: ResourceType <T>): Promise <void>
} = async (path_of_datapack: string, category: ResourceCategory, location: ResourceLocation | string, data: any) =>
{
  const path = path_of_resource (path_of_datapack, category, location)
  if (ResourceCategory[category].suffix === '.mcfunction')
  {
    await Deno.mkdir (stdpath.dirname (path), {recursive: true})
    await Deno.writeTextFile (path, data)
  }
  else if (ResourceCategory[category].suffix === '.json')
  {
    await Deno.mkdir (stdpath.dirname (path), {recursive: true})
    await Deno.writeTextFile (path, JSON.stringify (data, undefined, 2))
  }
  else if (ResourceCategory[category].suffix === '.nbt')
  {
    await Deno.mkdir (stdpath.dirname (path), {recursive: true})
    await Deno.writeFile (path, data)
  }
}
