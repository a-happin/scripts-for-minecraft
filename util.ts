import * as stdpath from 'https://deno.land/std@0.182.0/path/mod.ts'

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

export const fetchJSON = (url: string | URL) => fetch (url).then ((response) => response.json ())

export const readJSONFile = (path: string | URL) => Deno.readTextFile (path).then ((contents) => JSON.parse (contents))

export const download = async (url: string | URL, filePath: string | URL): Promise <void> => {
  const data = await fetch (url)
    .then ((response) => response.arrayBuffer ())
    .then ((arrayBuffer) => new Uint8Array (arrayBuffer))
  await Deno.writeFile (filePath, data)
}
