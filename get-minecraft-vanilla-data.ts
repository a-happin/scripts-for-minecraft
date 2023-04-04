import {exists, fetchJSON, download, readJSONFile, writeJSONFile} from './util.ts'
import * as Minecraft from './minecraft.ts'

const download_with_progress = async (url: string | URL, path: string | URL) => {
  console.log (`Downloading ${url} to ${path} ...`)
  await download (url, path)
  console.log (`Downloaded ${path}`)
}

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
  const version_manifest = await Minecraft.fetch_version_manifest ()

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
      tasks.push (async () => {
        await Deno.mkdir (dirPath, {recursive: true})
        const version = await fetchJSON (target_version.url)

        const internal_tasks = []

        if (await Promise.any (['assets', 'data'].map ((path) => exists (`${dirPath}/${path}`))))
        {
          console.log (`${dirPath}/assets or ${dirPath}/data already exist`)
        }
        else
        {
          internal_tasks.push (async () => {
            const clientPath = `${dirPath}/client.jar`
            await download_with_progress (version.downloads.client.url, clientPath)

            console.log (`Extracting ${clientPath} ...`)
            const unzip = new Deno.Command ('unzip', {
              args: ['-q', 'client.jar', 'assets/*', 'data/*', '-x', '*/.mcassetsroot'],
              cwd: dirPath,
              stdout: 'inherit',
              stderr: 'inherit',
            })
            const {code} = await unzip.output ()
            if (code === 0)
            {
              console.log (`Extracted ${clientPath}`)
            }
            else
            {
              console.error (`Error» Failed to Extacting ${clientPath} with error code ${code}`)
            }

            console.log (`Removing ${clientPath} ...`)
            await Deno.remove (clientPath)
            console.log (`Removed ${clientPath}`)
          })
        }

        for (const lang of ['ja_jp'] as const)
        {
          const langFilePath = `${dirPath}/assets/minecraft/lang/${lang}.json`
          if (await exists (langFilePath))
          {
            console.log (`${langFilePath} already exists`)
          }
          else
          {
            internal_tasks.push (async () => {
              console.log (`Fetching AssetIndex from ${version.assetIndex.url} ...`)
              const assetIndex = await fetchJSON (version.assetIndex.url)
              console.log (`Fetched AssetIndex`)
              const hash = assetIndex.objects[`minecraft/lang/${lang}.json`].hash
              const langFileURL = `https://resources.download.minecraft.net/${hash.slice (0, 2)}/${hash}`
              console.log (`Downloading ${langFileURL} to ${langFilePath} ...`)
              const lang_json = await fetchJSON (langFileURL)
              await Deno.writeTextFile (langFilePath, JSON.stringify (lang_json, undefined, 2))
              console.log (`Downloaded ${langFilePath}`)
            })
          }
        }

        // internal_tasks.push (async () => {
        //   const clientPath = `${dirPath}/client.jar`

        //   console.log (`Downloading ${version.downloads.client.url} to ${clientPath} ...`)
        //   await download (version.downloads.client.url, clientPath)
        //   console.log (`Downloaded ${clientPath}`)

        //   console.log (`Extracting ${clientPath} ...`)
        //   await Deno.run ({
        //     cmd: ['unzip', '-q', 'client.jar', 'assets/*', 'data/*', '-x', '*/.mcassetsroot'],
        //     cwd: dirPath
        //   }).status ()
        //   console.log (`Extracted ${clientPath}`)

        //   const lang = 'ja_jp'
        //   const langFilePath = `${dirPath}/assets/minecraft/lang/${lang}.json`
        //   console.log (`Fetching AssetIndex from ${version.assetIndex.url} ...`)
        //   const assetIndex = await fetchJSON (version.assetIndex.url)
        //   console.log (`Fetched AssetIndex`)
        //   const hash = assetIndex.objects[`minecraft/lang/${lang}.json`].hash
        //   const langFileURL = `https://resources.download.minecraft.net/${hash.slice (0, 2)}/${hash}`
        //   console.log (`Downloading ${langFileURL} to ${langFilePath} ...`)
        //   const lang_json = await fetchJSON (langFileURL)
        //   await Deno.writeTextFile (langFilePath, JSON.stringify (lang_json, undefined, 2))
        //   console.log (`Downloaded ${langFilePath}`)

        //   console.log (`Removing ${clientPath} ...`)
        //   await Deno.remove (clientPath)
        //   console.log (`Removed ${clientPath}`)
        // })

        const process_registries_task = async () => {
          console.log (`Processing Registory Data ...`)
          const registries: {[k: string]: {entries: {[k: string]: any}}} = await readJSONFile (`${dirPath}/generated/reports/registries.json`)
          const processed_registries: {[k: string]: string[]} = {}
          for (const [key, value] of Object.entries (registries))
          {
            processed_registries[`${Minecraft.ResourceLocation.fromString (key)}`] = Object.keys (value.entries).map ((x) => `${Minecraft.ResourceLocation.fromString (x)}`).sort ()
          }
          for (const [key, values] of Object.entries (processed_registries))
          {
            await writeJSONFile (`${dirPath}/processed/reports/registries/${key}.json`, {values})
          }
          await writeJSONFile (`${dirPath}/processed/reports/registries.json`, processed_registries)
          console.log (`Processed Registory Data`)
        }


        if (await exists (`${dirPath}/generated/reports/registries.json`))
        {
          console.log (`${dirPath}/generated/reports/registries.json already exists`)
          if (await exists (`${dirPath}/processed/reports/registries.json`))
          {
            console.log (`${dirPath}/processed/reports/registries.json already exists`)
          }
          else
          {
            internal_tasks.push (process_registries_task)
          }
        }
        else
        {
          internal_tasks.push (async () => {
            const serverPath = `${dirPath}/server.jar`

            await download_with_progress (version.downloads.server.url, serverPath)

            console.log (`Generating Registries Data...`)
            const command = new Deno.Command ('java.exe', {
              args: ['-DbundlerMainClass=net.minecraft.data.Main', '-jar', 'server.jar', '--reports'],
              cwd: dirPath,
              stdout: 'inherit',
              stderr: 'inherit',
            })
            const {code} = await command.output ()
            if (code === 0)
            {
              console.log (`Generated Registires Data`)
            }
            else
            {
              console.error (`Error» Failed to Generating Registires Data`)
            }

            console.log (`Removing ${serverPath} ...`)
            await Promise.all ([
              Deno.remove (serverPath),
              Deno.remove (`${dirPath}/libraries`, {recursive: true}),
              Deno.remove (`${dirPath}/logs`, {recursive: true}),
              Deno.remove (`${dirPath}/versions`, {recursive: true}),
            ])
            console.log (`Removed ${serverPath}`)

            await process_registries_task ()
          })
        }

        await Promise.all (internal_tasks.map ((task) => task ()))
      })
    }
    else
    {
      console.error (`${target} is not a valid version`)
      Deno.exit (1)
    }
  }

  await Promise.all (tasks.map ((task) => task ()))
}
