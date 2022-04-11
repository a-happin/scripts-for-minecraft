import {VersionManifest, exists, fetchJSON, download} from './util.ts'

if (Deno.args.length === 0)
{
  console.log (`Download Minecraft vanilla datapacks and resourcepacks

Usage:
 deno run --allow-net --allow-read --allow-run --allow-write get-minecraft-vanilla-data <versions>

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
      const dirPath = `./${target}`
      if (await exists (dirPath))
      {
        console.error (`${dirPath} already exists`)
      }
      else
      {
        tasks.push (async () => {
          await Deno.mkdir (dirPath)
          const version = await fetchJSON (target_version.url)
          const clientPath = `${dirPath}/client.jar`

          console.log (`Downloading ${clientPath} ...`)
          await download (version.downloads.client.url, clientPath)
          console.log (`Downloaded ${clientPath}`)

          console.log (`Extracting ${clientPath} ...`)
          await Deno.run ({
            cmd: ['unzip', '-q', 'client.jar', 'assets/*', 'data/*', '-x', '*/.mcassetsroot'],
            cwd: dirPath})
          .status ()
          console.log (`Extracted ${clientPath}`)

          const lang = 'ja_jp'
          const langFilePath = `${dirPath}/assets/minecraft/lang/${lang}.json`
          console.log (`Downloading ${langFilePath} ...`)
          const assetIndex = await fetchJSON (version.assetIndex.url)
          const hash = assetIndex.objects[`minecraft/lang/${lang}.json`].hash
          const lang_json = await fetchJSON (`http://resources.download.minecraft.net/${hash.slice (0, 2)}/${hash}`)
          await Deno.writeTextFile (langFilePath, JSON.stringify (lang_json, undefined, 2))
          console.log (`Downloaded ${langFilePath}`)

          await Deno.remove (clientPath)
          console.log (`Removed ${clientPath}`)
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
