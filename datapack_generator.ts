import * as Minecraft from './minecraft.ts'

abstract class ResourceGenerator
{
  public abstract readonly category: Minecraft.ResourceCategory
  private readonly location: Minecraft.ResourceLocation
  private readonly children: ResourceGenerator[] = []

  constructor (location: Minecraft.ResourceLocation | string)
  {
    if (typeof location === 'string')
    {
      location = Minecraft.ResourceLocation.fromString (location)
    }
    this.location = location
  }

  let <R> (f: (it: this) => R)
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

  protected define_inline_resource <T extends ResourceGenerator, Us extends readonly unknown[]> (ctor: new (... args: Us) => T, ... args: Us)
  {
    return new ctor (... args).also (it => this.children.push (it))
  }

  abstract generateResource (): Minecraft.ResourceType <Minecraft.ResourceCategory>

  * writeResourceTasks (): IterableIterator <(path_of_datapack: string) => Promise <void>>
  {
    yield (path_of_datapack: string) => Minecraft.writeResource (path_of_datapack, this.category, this.location, this.generateResource ())
    for (const child of this.children)
    {
      yield * child.writeResourceTasks ()
    }
  }
}

class AdvancementGenerator extends ResourceGenerator
{
  override readonly category = 'advancement'
  public data: Minecraft.ResourceType <typeof this.category> = {
    criteria: {
      "": {
        trigger: "impossible"
      }
    }
  }

  override generateResource ()
  {
    return this.data
  }
}

class DamageTypeGenerator extends ResourceGenerator
{
  override readonly category = 'damage_type'
  public data: Minecraft.ResourceType <typeof this.category> = {
    exhaustion: 0,
    message_id: '',
    scaling: 'never',
  }

  override generateResource ()
  {
    return this.data
  }
}

class DimensionTypeGenerator extends ResourceGenerator
{
  override readonly category = 'dimension_type'
  public data: Minecraft.ResourceType <typeof this.category> = {}

  override generateResource ()
  {
    return this.data
  }
}

class ItemModifierGenerator extends ResourceGenerator
{
  override readonly category = 'item_modifier'
  public data: Minecraft.ResourceType <typeof this.category> = []

  override generateResource ()
  {
    return this.data
  }
}

class LootTableGenerator extends ResourceGenerator
{
  override readonly category = 'loot_table'
  public data: Minecraft.ResourceType <typeof this.category> = {}

  override generateResource ()
  {
    return this.data
  }
}

class PredicateGenerator extends ResourceGenerator
{
  override readonly category = 'predicate'
  public data: Minecraft.ResourceType <typeof this.category> = []

  override generateResource ()
  {
    return this.data
  }
}

class RecipeGenerator extends ResourceGenerator
{
  override readonly category = 'recipe'
  public data: Minecraft.ResourceType <typeof this.category> = {
    type: "crafting_special_armordye"
  }

  override generateResource ()
  {
    return this.data
  }
}

class TagBlockGenerator extends ResourceGenerator
{
  override readonly category = 'tag/block'
  public data: Minecraft.ResourceType <typeof this.category> = {
    values: []
  }

  override generateResource ()
  {
    return this.data
  }
}

class TagDamageTypeGenerator extends ResourceGenerator
{
  override readonly category = 'tag/damage_type'
  public data: Minecraft.ResourceType <typeof this.category> = {
    values: []
  }

  override generateResource ()
  {
    return this.data
  }
}

class TagEntityTypeGenerator extends ResourceGenerator
{
  override readonly category = 'tag/entity_type'
  public data: Minecraft.ResourceType <typeof this.category> = {
    values: []
  }

  override generateResource ()
  {
    return this.data
  }
}

class TagFluidGenerator extends ResourceGenerator
{
  override readonly category = 'tag/fluid'
  public data: Minecraft.ResourceType <typeof this.category> = {
    values: []
  }

  override generateResource ()
  {
    return this.data
  }
}

class TagFunctionGenerator extends ResourceGenerator
{
  override readonly category = 'tag/function'
  public data: Minecraft.ResourceType <typeof this.category> = {
    values: []
  }

  override generateResource ()
  {
    return this.data
  }
}

class TagGameEventGenerator extends ResourceGenerator
{
  override readonly category = 'tag/game_event'
  public data: Minecraft.ResourceType <typeof this.category> = {
    values: []
  }

  override generateResource ()
  {
    return this.data
  }
}

class TagItemGenerator extends ResourceGenerator
{
  override readonly category = 'tag/item'
  public data: Minecraft.ResourceType <typeof this.category> = {
    values: []
  }

  override generateResource ()
  {
    return this.data
  }
}

class MCFunctionGenerator extends ResourceGenerator
{
  override readonly category = 'function'
  public readonly IMP_DOC: string[] = [`#> ${this}`]
  private readonly body: string[] = []

  define_inline_function (location: Minecraft.ResourceLocation | string)
  {
    return this.define_inline_resource (MCFunctionGenerator, location).also ((THIS) => {
      THIS.IMP_DOC.push (`#@within function ${this}`)
    })
  }

  command (... xs: Parameters <typeof String.raw>)
  {
    this.body.push (String.raw (... xs))
  }

  tellraw (targets: string, args: string | Minecraft.TellrawJSONComponent[] | Minecraft.TellrawJSONComponent)
  {
    this.command `tellraw ${targets} ${JSON.stringify (args)}`
  }

  override generateResource ()
  {
    return [
      ... this.IMP_DOC,
      ``,
      ... this.body,
    ].join ('\n')
  }
}

export class DatapackGenerator
{
  private readonly children: ResourceGenerator[] = []
  constructor (
    private readonly path_of_datapack: string
  )
  {}

  define_advancement (location: Minecraft.ResourceLocation | string)
  {
    return new AdvancementGenerator (location).also (it => this.children.push (it))
  }

  define_damage_type (location: Minecraft.ResourceLocation | string)
  {
    return new DamageTypeGenerator (location).also (it => this.children.push (it))
  }

  define_dimension_type (location: Minecraft.ResourceLocation | string)
  {
    return new DimensionTypeGenerator (location).also (it => this.children.push (it))
  }

  define_function (location: Minecraft.ResourceLocation | string)
  {
    return new MCFunctionGenerator (location).also (it => this.children.push (it))
  }

  define_item_modifier (location: Minecraft.ResourceLocation | string)
  {
    return new ItemModifierGenerator (location).also (it => this.children.push (it))
  }

  define_loot_table (location: Minecraft.ResourceLocation | string)
  {
    return new LootTableGenerator (location).also (it => this.children.push (it))
  }

  define_predicate (location: Minecraft.ResourceLocation | string)
  {
    return new PredicateGenerator (location).also (it => this.children.push (it))
  }

  define_recipe (location: Minecraft.ResourceLocation | string)
  {
    return new RecipeGenerator (location).also (it => this.children.push (it))
  }

  define_tag_block (location: Minecraft.ResourceLocation | string)
  {
    return new TagBlockGenerator (location).also (it => this.children.push (it))
  }

  define_tag_damage_type (location: Minecraft.ResourceLocation | string)
  {
    return new TagDamageTypeGenerator (location).also (it => this.children.push (it))
  }

  define_tag_entity_type (location: Minecraft.ResourceLocation | string)
  {
    return new TagEntityTypeGenerator (location).also (it => this.children.push (it))
  }

  define_tag_fluid (location: Minecraft.ResourceLocation | string)
  {
    return new TagFluidGenerator (location).also (it => this.children.push (it))
  }

  define_tag_function (location: Minecraft.ResourceLocation | string)
  {
    return new TagFunctionGenerator (location).also (it => this.children.push (it))
  }

  define_tag_game_event (location: Minecraft.ResourceLocation | string)
  {
    return new TagGameEventGenerator (location).also (it => this.children.push (it))
  }

  define_tag_item (location: Minecraft.ResourceLocation | string)
  {
    return new TagItemGenerator (location).also (it => this.children.push (it))
  }

  async writeResources ()
  {
    const tasks = this.children.flatMap ((child) => [... child.writeResourceTasks ()])
    await Promise.all (tasks.map ((task) => task (this.path_of_datapack)))
  }
}

