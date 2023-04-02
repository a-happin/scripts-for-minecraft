import * as Minecraft from './minecraft.ts'

abstract class ResourceGenerator
{
  protected abstract readonly category: Minecraft.ResourceCategory
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

class PredicateResourceGenerator extends ResourceGenerator
{
  protected override readonly category = 'predicate'
  public data = Minecraft.ResourceCategory[this.category].default_data

  override generateResource ()
  {
    return this.data
  }
}

class MCFunctionResourceGenerator extends ResourceGenerator
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
    return this.define_inline_resource (MCFunctionResourceGenerator, location).also ((THIS) => {
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

  define_function (location: Minecraft.ResourceLocation | string)
  {
    return new MCFunctionResourceGenerator (location).also (it => this.children.push (it))
  }

  define_predicate (location: Minecraft.ResourceLocation | string)
  {
    return new PredicateResourceGenerator (location).also (it => this.children.push (it))
  }

  async writeResource (path_of_datapack: string)
  {
    const tasks = this.children.flatMap ((child) => [... child.writeResourceTasks ()])
    await Promise.all (tasks.map ((task) => task (path_of_datapack)))
  }
}

type JSONResourceCategory <T extends Minecraft.ResourceCategory = Minecraft.ResourceCategory> = T extends Minecraft.ResourceCategory ? typeof Minecraft.ResourceCategory[T]['suffix'] extends '.json' ? T : never : never
