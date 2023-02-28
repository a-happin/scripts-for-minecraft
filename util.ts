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

export const exists = async (filePath: string): Promise <boolean> => {
  try
  {
    await Deno.lstat (filePath)
    return true
  }
  catch (error)
  {
    if (error instanceof Deno.errors.NotFound)
    {
      return false
    }
    else
    {
      throw error
    }
  }
}

export const ensure_directory = (path: string | URL) => Deno.mkdir (path, {recursive: true})

export const writeTextFile = async (path: string, data: string) => {
  await ensure_directory (stdpath.dirname (path))
  await Deno.writeTextFile (path, data)
}

export const writeJSONFile = (path: string, data: any) => writeTextFile (path, JSON.stringify (data, undefined, 2))

export const fetchJSON = (url: string) => fetch (url).then ((response) => response.json ())

export const readJSONFile = (path: string) => Deno.readTextFile (path).then ((contents) => JSON.parse (contents))

export const download = async (url: string, filePath: string): Promise <void> => {
  const data = await fetch (url)
    .then ((response) => response.arrayBuffer ())
    .then ((arrayBuffer) => new Uint8Array (arrayBuffer))
  await Deno.writeFile (filePath, data)
}

export class ResourceLocation
{
  constructor (
    public namespace: string,
    public path: string
  )
  {}

  static fromString (str: string)
  {
    if (str.includes (':'))
    {
      const [namespace, path] = str.split (':')
      return new ResourceLocation(namespace === '' ? 'minecraft' : namespace, path)
    }
    else
    {
      return new ResourceLocation ('minecraft', str)
    }
  }

  toString ()
  {
    return this.namespace === 'minecraft' ? this.path === '' ? ':' : this.path : `${this.namespace}:${this.path}`
  }
}
