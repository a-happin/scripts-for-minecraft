type VersionManifest = {
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

const exists = async (filePath: string): Promise <boolean> => {
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

if (Deno.args.length === 0)
{
  console.log (`Download Minecraft server.jar into current directory.

Usage:
 deno run --allow-net --allow-read --allow-write download-minecraft-server <versions>

versions:
  release   -- latest release
  snapshot  -- latest snapshot
  <version> -- specified version
`)
}
else
{
  const version_manifest = await fetch ('https://launchermeta.mojang.com/mc/game/version_manifest.json').then ((response) => response.json ()) as VersionManifest

  const targets = new Set ()
  for (const arg of Deno.args)
  {
    if (arg === 'release')
    {
      targets.add (version_manifest.latest.release)
    }
    else if (arg === 'snapshot')
    {
      targets.add (version_manifest.latest.snapshot)
    }
    else
    {
      targets.add (arg)
    }
  }

  const tasks = []
  for (const target of targets)
  {
    const target_version = version_manifest.versions.find ((x) => x.id === target)
    if (target_version !== undefined)
    {
      const filePath = `./${target}.server.jar`
      if (await exists (filePath))
      {
        console.error (`${filePath} already exists`)
      }
      else
      {
        tasks.push (async () => {
          const version = await fetch (target_version.url).then ((response) => response.json ())
          console.log (`Downloading ${filePath} ...`)
          const binary = await fetch (version.downloads.server.url).then ((response) => response.arrayBuffer ()).then ((arrayBuffer) => new Uint8Array (arrayBuffer))
          await Deno.writeFile (filePath, binary)
          console.log (`Downloaded ${filePath}`)
        })
      }
    }
    else
    {
      console.error (`${target} is not a valid version`)
    }
  }

  Promise.all (tasks.map ((task) => task ()))
}
