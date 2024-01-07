import * as Minecraft from './minecraft.ts'

abstract class ResourceGenerator
{
  public abstract readonly category: Minecraft.ResourceCategory
  public readonly location: Minecraft.ResourceLocation
  public readonly children: ResourceGenerator[] = []

  private inline_cnt = 0
  // アロー関数で定義することでthisを束縛する
  // (method定義だとthisは呼び出し元になる)
  private new_inline_location = () => `${this.location}${this.location.path === '' || this.location.path.endsWith ('/') ? '' : '/'}__inline__/${this.inline_cnt ++}`

  constructor (
    location: Minecraft.ResourceLocation | string,
  )
  {
    if (typeof location === 'string')
    {
      location = Minecraft.ResourceLocation.fromString (location)
    }
    this.location = location
  }

  let <T> (f: (it: this) => T)
  {
    return f (this)
  }

  also (f: (it: this) => unknown)
  {
    f (this)
    return this
  }

  toString ()
  {
    return this.location.toString ()
  }

  toFullString ()
  {
    return this.location.toFullString ()
  }

  public define_inline_resource <C extends Minecraft.ResourceCategory> (category: C, location?: Minecraft.ResourceLocation | string): InstanceType <typeof ResourceGenerators[C]>
  {
    const it = new ResourceGenerators[category] (location ?? this.new_inline_location ()) as InstanceType <typeof ResourceGenerators[C]>
    if (location == null)
    {
      // 関数を上書きする。アロー関数なのでthisが書き換わらない。
      it.new_inline_location = this.new_inline_location
    }
    this.children.push (it)
    if (category === 'function')
    {
      if (this.category === 'tag/function')
      {
        (it as MCFunctionGenerator).doc `@handles #${this.location}`
      }
      (it as MCFunctionGenerator).doc `@within ${this.category} ${this.location}`
    }
    return it
  }

  abstract generate_resource (): Minecraft.ResourceType <typeof this.category>

  * generate_resources (): IterableIterator <[Minecraft.ResourceCategory, Minecraft.ResourceLocation, Minecraft.ResourceType <Minecraft.ResourceCategory>]>
  {
    yield [this.category, this.location, this.generate_resource ()]
    for (const child of this.children)
    {
      yield * child.generate_resources ()
    }
  }
}

class MCFunctionGenerator extends ResourceGenerator {
  override readonly category = 'function'
  private readonly IMP_DOC: string[] = [`#> ${this}`]
  private readonly body: string[] = []
  private indent_level = 0

  doc (... xs: Parameters <typeof String.raw>)
  {
    this.IMP_DOC.push (`#${String.raw (... xs)}`)
  }

  command (... xs: Parameters <typeof String.raw>)
  {
    this.body.push ([... new Array (this.indent_level).fill (' '), ... String.raw (... xs).split (/[^\S\n]*\n[^\S\n]*/)].join (' '))
  }

  tellraw (targets: string, args: string | Minecraft.TellrawJSONComponent | (string | Minecraft.TellrawJSONComponent)[])
  {
    this.command `tellraw ${targets} ${JSON.stringify (args)}`
  }

  indent (f: () => void)
  {
    ++ this.indent_level
    f ()
    -- this.indent_level
  }

  stack (f: () => void)
  {
    this.command `data modify storage : _ append value {}`
    this.indent (f)
    this.command `data remove storage : _[-1]`
  }

  override generate_resource (): Minecraft.ResourceType <typeof this.category> {
    return [
      ... this.IMP_DOC,
      ``,
      ... this.body,
    ].join ('\n')
  }
}

abstract class JSONResourceGenerator extends ResourceGenerator
{
  public abstract data: Minecraft.ResourceType <typeof this.category>
  override generate_resource ()
  {
    return this.data
  }
}

class PackMCMetaGenerator extends JSONResourceGenerator
{
  override readonly category = 'pack.mcmeta'
  override data = Minecraft.ResourceCategory[this.category].default_value
}

class AdvancementGenerator extends JSONResourceGenerator
{
  override readonly category = 'advancement'
  override data = Minecraft.ResourceCategory[this.category].default_value
}

class DamageTypeGenerator extends JSONResourceGenerator
{
  override readonly category = 'damage_type'
  override data = Minecraft.ResourceCategory[this.category].default_value
}

class DimensionTypeGenerator extends JSONResourceGenerator
{
  override readonly category = 'dimension_type'
  override data = Minecraft.ResourceCategory[this.category].default_value
}

class ItemModifierGenerator extends JSONResourceGenerator
{
  override readonly category = 'item_modifier'
  override data = Minecraft.ResourceCategory[this.category].default_value
}

class LootTableGenerator extends JSONResourceGenerator
{
  override readonly category = 'loot_table'
  override data = Minecraft.ResourceCategory[this.category].default_value
}

class PredicateGenerator extends JSONResourceGenerator
{
  override readonly category = 'predicate'
  override data = Minecraft.ResourceCategory[this.category].default_value
}

class RecipeGenerator extends JSONResourceGenerator
{
  override readonly category = 'recipe'
  override data = Minecraft.ResourceCategory[this.category].default_value
}

class StructureGenerator extends ResourceGenerator
{
  override readonly category = 'structure'
  override generate_resource (): Minecraft.ResourceType <typeof this.category>
  {
    throw new Error ('not implemented')
  }
}

class TagBlockGenerator extends JSONResourceGenerator
{
  override readonly category = 'tag/block'
  override data = Minecraft.ResourceCategory[this.category].default_value
}

class TagDamageTypeGenerator extends JSONResourceGenerator
{
  override readonly category = 'tag/damage_type'
  override data = Minecraft.ResourceCategory[this.category].default_value
}

class TagEntityTypeGenerator extends JSONResourceGenerator
{
  override readonly category = 'tag/entity_type'
  override data = Minecraft.ResourceCategory[this.category].default_value
}

class TagFluidGenerator extends JSONResourceGenerator
{
  override readonly category = 'tag/fluid'
  override data = Minecraft.ResourceCategory[this.category].default_value
}

class TagFunctionGenerator extends JSONResourceGenerator
{
  override readonly category = 'tag/function'
  override data = Minecraft.ResourceCategory[this.category].default_value
}

class TagGameEventGenerator extends JSONResourceGenerator
{
  override readonly category = 'tag/game_event'
  override data = Minecraft.ResourceCategory[this.category].default_value
}

class TagItemGenerator extends JSONResourceGenerator
{
  override readonly category = 'tag/item'
  override data = Minecraft.ResourceCategory[this.category].default_value
}

class LangGenerator extends JSONResourceGenerator
{
  override readonly category = 'lang'
  override data = Minecraft.ResourceCategory[this.category].default_value
}

const ResourceGenerators = {
  'advancement': AdvancementGenerator,
  'damage_type': DamageTypeGenerator,
  'dimension_type': DimensionTypeGenerator,
  'function': MCFunctionGenerator,
  'item_modifier': ItemModifierGenerator,
  'loot_table': LootTableGenerator,
  'predicate': PredicateGenerator,
  'recipe': RecipeGenerator,
  'structure': StructureGenerator,
  'tag/block': TagBlockGenerator,
  'tag/damage_type': TagDamageTypeGenerator,
  'tag/entity_type': TagEntityTypeGenerator,
  'tag/fluid': TagFluidGenerator,
  'tag/function': TagFunctionGenerator,
  'tag/game_event': TagGameEventGenerator,
  'tag/item': TagItemGenerator,
  'lang': LangGenerator,
  'pack.mcmeta': PackMCMetaGenerator,
} as const

type DefineResource = <C extends Minecraft.ResourceCategory> (category: C, location: string, also: (THIS: InstanceType <typeof ResourceGenerators[C]>) => void) => void

export const generate_pack_f = async (path_of_pack: string, f: (define: DefineResource) => void) => {
  const tasks: {[k in string]: () => Promise <void>} = {}

  f (<C extends Minecraft.ResourceCategory> (category: C, location: string, also: (THIS: InstanceType <typeof ResourceGenerators[C]>) => void): void => {
    const generator = new ResourceGenerators[category] (location)
    // deno-lint-ignore no-explicit-any
    also (generator as any)
    for (const [category, location, res] of generator.generate_resources ())
    {
      if (tasks[`${category} ${location}`] === undefined)
      {
        tasks[`${category} ${location}`] = () => Minecraft.writeResource (path_of_pack, category, location, res)
      }
      else
      {
        throw new Error (`Duplicate Resource Definition:\n ${category} ${location} is already exists.`)
      }
    }
  })

  await Promise.all (Object.values (tasks).map ((task) => task ()))
}

export type Pack = {
  'pack.mcmeta'?: Minecraft.ResourceType <'pack.mcmeta'>
} & {
  [category in Exclude <Minecraft.ResourceCategory, 'pack.mcmeta'>]?: {
    [location in string]: (THIS: InstanceType <typeof ResourceGenerators[category]>) => void
  }
}

// deno-lint-ignore ban-types no-explicit-any
const object_keys = <T extends {}> (obj: T): (keyof T)[] => Object.keys (obj) as any
// deno-lint-ignore ban-types no-explicit-any
const object_entries = <T extends {}> (obj: T): Exclude <{[k in keyof T]: [k, T[k]]}[keyof T], undefined>[] => Object.entries (obj) as any

export const generate_pack = async (path_of_pack: string, pack: Pack) => {
  if (object_keys (pack).length === 0)
  {
    // nothing to do
    return
  }
  const tasks: {[k in string]: () => Promise <void>} = {}
  for (const [category, location_and_f] of object_entries (pack))
  {
    if (location_and_f === undefined)
    {
      throw new Error (`unexpected error`)
    }
    if (category === 'pack.mcmeta')
    {
      if (tasks[category] === undefined)
      {
        tasks[category] = () => Minecraft.writeResource (path_of_pack, category, '', location_and_f)
      }
      else
      {
        throw new Error (`Duplicate Resource Definition:\n ${category} ${location} is already exists.`)
      }
    }
    else
    {
      for (const [location, f] of object_entries (location_and_f))
      {
        const generator = new ResourceGenerators[category] (location)
        // deno-lint-ignore no-explicit-any
        f (generator as any)
        for (const [category, location, res] of generator.generate_resources ())
        {
          if (tasks[`${category} ${location}`] === undefined)
          {
            tasks[`${category} ${location}`] = () => Minecraft.writeResource (path_of_pack, category, location, res)
          }
          else
          {
            throw new Error (`Duplicate Resource Definition:\n ${category} ${location} is already exists.`)
          }
        }
      }
    }
  }
  await Promise.all (Object.values (tasks).map ((task) => task ()))
}
