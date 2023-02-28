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

          const internal_tasks = []
          internal_tasks.push (async () => {
            const clientPath = `${dirPath}/client.jar`

            console.log (`Downloading ${version.downloads.client.url} to ${clientPath} ...`)
            await download (version.downloads.client.url, clientPath)
            console.log (`Downloaded ${clientPath}`)

            console.log (`Extracting ${clientPath} ...`)
            await Deno.run ({
              cmd: ['unzip', '-q', 'client.jar', 'assets/*', 'data/*', '-x', '*/.mcassetsroot'],
              cwd: dirPath
            }).status ()
            console.log (`Extracted ${clientPath}`)

            const lang = 'ja_jp'
            const langFilePath = `${dirPath}/assets/minecraft/lang/${lang}.json`
            console.log (`Fetching AssetIndex from ${version.assetIndex.url} ...`)
            const assetIndex = await fetchJSON (version.assetIndex.url)
            console.log (`Fetched AssetIndex`)
            const hash = assetIndex.objects[`minecraft/lang/${lang}.json`].hash
            const langFileURL = `https://resources.download.minecraft.net/${hash.slice (0, 2)}/${hash}`
            console.log (`Downloading ${langFileURL} to ${langFilePath} ...`)
            const lang_json = await fetchJSON (langFileURL)
            await Deno.writeTextFile (langFilePath, JSON.stringify (lang_json, undefined, 2))
            console.log (`Downloaded ${langFilePath}`)

            console.log (`Removing ${clientPath} ...`)
            await Deno.remove (clientPath)
            console.log (`Removed ${clientPath}`)
          })

          internal_tasks.push (async () => {
            const serverPath = `${dirPath}/server.jar`

            console.log (`Downloading ${version.downloads.server.url} to ${serverPath} ...`)
            await download (version.downloads.server.url, serverPath)
            console.log (`Downloaded ${serverPath}`)

            console.log (`Generating Registory Data...`)
            await Deno.run ({
              cmd: ['java.exe', '-DbundlerMainClass=net.minecraft.data.Main', '-jar', 'server.jar', '--reports'],
              cwd: dirPath
            }).status ()
            console.log (`Generated Registory Data`)

            console.log (`Removing ${serverPath} ...`)
            await Promise.all ([
              Deno.remove (serverPath),
              Deno.remove (`${dirPath}/libraries`, {recursive: true}),
              Deno.remove (`${dirPath}/logs`, {recursive: true}),
              Deno.remove (`${dirPath}/versions`, {recursive: true}),
            ])
            console.log (`Removed ${serverPath}`)
          })

          await Promise.all (internal_tasks.map ((task) => task ()))
        })
      }
    }
    else
    {
      console.error (`${target} is not a valid version`)
      Deno.exit (1)
    }
  }

  await Promise.all (tasks.map ((task) => task ()))
}
