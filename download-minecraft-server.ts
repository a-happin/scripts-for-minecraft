import {VersionManifest, exists, fetchJSON, download} from './util.ts'

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
  const version_manifest = await fetchJSON ('https://launchermeta.mojang.com/mc/game/version_manifest.json') as VersionManifest

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
          const version = await fetchJSON (target_version.url)
          console.log (`Downloading ${filePath} ...`)
          await download (version.downloads.server.url, filePath)
          console.log (`Downloaded ${filePath}`)
        })
      }
    }
    else
    {
      console.error (`${target} is not a valid version`)
      Deno.exit (1)
    }
  }

  Promise.all (tasks.map ((task) => task ()))
}
