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

type JSONResourceCategory <T extends Minecraft.ResourceCategory = Minecraft.ResourceCategory> = T extends Minecraft.ResourceCategory ? typeof Minecraft.ResourceCategory[T]['suffix'] extends '.json' ? T : never : never
class JSONResourceGenerator <T extends JSONResourceCategory> extends ResourceGenerator
{
  public data: Minecraft.ResourceType <T>

  constructor (
    override readonly category: T,
    location: Minecraft.ResourceLocation | string,
  )
  {
    super (location)
    this.data = Minecraft.ResourceCategory[category].default_data
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
  public readonly body: string[] = []

  // static define_function (location:Minecraft.ResourceLocation | string, setup: (THIS: MCFunctionResourceGenerator) => unknown)
  // {
  //   // const resource = new MCFunctionResourceGenerator (location)
  //   const resource = newResource ([], MCFunctionResourceGenerator, location)
  //   setup (resource)
  //   return resource
  // }

  define_inline_function (location: Minecraft.ResourceLocation | string)
  {
    return this.define_inline_resource (MCFunctionGenerator, location).also ((THIS) => {
      THIS.IMP_DOC.push (`#@within function ${this}`)
    })
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

  define_advancement (location: Minecraft.ResourceLocation | string)
  {
    return new JSONResourceGenerator ('advancement', location).also (it => this.children.push (it))
  }

  define_dimension_type (location: Minecraft.ResourceLocation | string)
  {
    return new JSONResourceGenerator ('dimension_type', location).also (it => this.children.push (it))
  }

  define_function (location: Minecraft.ResourceLocation | string)
  {
    return new MCFunctionGenerator (location).also (it => this.children.push (it))
  }

  define_item_modifier (location: Minecraft.ResourceLocation | string)
  {
    return new JSONResourceGenerator ('item_modifier', location).also (it => this.children.push (it))
  }

  define_loot_table (location: Minecraft.ResourceLocation | string)
  {
    return new JSONResourceGenerator ('loot_table', location).also (it => this.children.push (it))
  }

  define_predicate (location: Minecraft.ResourceLocation | string)
  {
    return new JSONResourceGenerator ('predicate', location).also (it => this.children.push (it))
  }

  define_recipe (location: Minecraft.ResourceLocation | string)
  {
    return new JSONResourceGenerator ('recipe', location).also (it => this.children.push (it))
  }

  define_tag_block (location: Minecraft.ResourceLocation | string)
  {
    return new JSONResourceGenerator ('tag/block', location).also (it => this.children.push (it))
  }

  define_tag_entity_type (location: Minecraft.ResourceLocation | string)
  {
    return new JSONResourceGenerator ('tag/entity_type', location).also (it => this.children.push (it))
  }

  define_tag_fluid (location: Minecraft.ResourceLocation | string)
  {
    return new JSONResourceGenerator ('tag/fluid', location).also (it => this.children.push (it))
  }

  define_tag_function (location: Minecraft.ResourceLocation | string)
  {
    return new JSONResourceGenerator ('tag/function', location).also (it => this.children.push (it))
  }

  define_tag_game_event (location: Minecraft.ResourceLocation | string)
  {
    return new JSONResourceGenerator ('tag/game_event', location).also (it => this.children.push (it))
  }

  define_tag_item (location: Minecraft.ResourceLocation | string)
  {
    return new JSONResourceGenerator ('tag/item', location).also (it => this.children.push (it))
  }

  async writeResources (path_of_datapack: string)
  {
    const tasks = this.children.flatMap ((child) => [... child.writeResourceTasks ()])
    await Promise.all (tasks.map ((task) => task (path_of_datapack)))
  }
}

