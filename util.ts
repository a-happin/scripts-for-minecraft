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

export const fetchJSON = (url: string) => fetch (url).then ((response) => response.json ())

export const download = async (url: string, filePath: string): Promise <void> => {
  const data = await fetch (url)
    .then ((response) => response.arrayBuffer ())
    .then ((arrayBuffer) => new Uint8Array (arrayBuffer))
  await Deno.writeFile (filePath, data)
}
