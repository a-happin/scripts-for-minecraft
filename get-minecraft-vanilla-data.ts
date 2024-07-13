import {exists, fetchJSON, download, readJSONFile, writeJSONFile} from './util.ts'
import * as Minecraft from './minecraft.ts'
import * as stdpath from 'https://deno.land/std/path/mod.ts'
//import * as logs from './log.ts'

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
  Deno.exit (0)
}

const log = (x: string) => console.log (x)

const version_manifest = await Minecraft.fetch_version_manifest ()

// collect targets
function * get_target_versions  ()
{
  const targets = new Set ()
  for (const arg of Deno.args)
  {
    const version = (arg === 'release')
      ? version_manifest.latest.release : (arg === 'snapshot')
      ? version_manifest.latest.snapshot : arg

    // duplicate check
    if (targets.has (version))
    {
      continue
    }

    // validate
    const target_version = version_manifest.versions.find ((x) => x.id === version)
    if (target_version !== undefined)
    {
      targets.add (version)
      yield target_version
    }
    else
    {
      throw new Error (`${version} is not a valid version`)
    }
  }
}

const task_with_log = async (text: string, task: () => Promise <unknown>) =>
{
  //const log = logs.add (`${text} ...`)
  console.log (`${text} ...`)
  //logs.render ()
  await task ()
  //log.update (`${log.str}done`)
}

const tasks = []

for (const target_version of get_target_versions ())
{
  const dirPath = `./${target_version.id}`
  await Deno.mkdir (dirPath, {recursive: true})
  const version: Minecraft.Version = await fetchJSON (target_version.url)

  tasks.push (async () => {
    // datapack and resourcepack
    const [exists_assets, exists_data] = await Promise.all (['assets', 'data'].map ((x) => exists (`${dirPath}/${x}`)))
    if (exists_assets && exists_data)
    {
      log (`${dirPath}/assets and ${dirPath}/data already exist. skipped.`)
    }
    else
    {
      if (exists_assets)
      {
        log (`${dirPath}/assets already exists.`)
      }
      if (exists_data)
      {
        log (`${dirPath}/data already exists.`)
      }
      const clientPath = `${dirPath}/client.jar`
      await task_with_log (`Downloading ${clientPath} from ${version.downloads.client.url}`, () => download (version.downloads.client.url, clientPath))

      await task_with_log (`Extracting ${clientPath}`, async () => {
        const unzip = new Deno.Command ('unzip', {
          args: ['-q', 'client.jar', ... (exists_assets ? [] : ['assets/*']), ... (exists_data ? []: ['data/*']), '-x', '*/.mcassetsroot'],
          cwd: stdpath.dirname (clientPath),
          stdout: 'inherit',
          stderr: 'inherit',
        })
        const {code} = await unzip.output ()
        if (code === 0)
        {
          await task_with_log (`Removing ${clientPath}`, () => Deno.remove (clientPath))
        }
        else
        {
          throw new Error (`Failed to Extracting ${clientPath} with error code ${code}`)
        }
      })
    }

    // extra assets
    if (await exists (`${dirPath}/assets/pack.mcmeta`))
    {
      log (`Assets already exist. skipped.`)
    }
    else
    {
      await task_with_log (`Downloading Assets`, async () => {
        const assetIndex: Minecraft.AssetIndex = await fetchJSON (version.assetIndex.url)
        //const internal_tasks = []
        for (const [key, {hash}] of Object.entries (assetIndex.objects))
        {
          const path = `${dirPath}/assets/${key}`
          const url = `https://resources.download.minecraft.net/${hash.slice (0, 2)}/${hash}`
          //console.log (`Downloading ${path} from ${url} ...`)
          if (key.endsWith ('.json'))
          {
            try {
              await fetchJSON (url).then ((data) => writeJSONFile (path, data))
            }
            catch (e)
            {
              console.error (`Error! ${url}: ${path}, ${e}`)
              await download (url, path)
            }
          }
          else
          {
            await download (url, path)
          }
        }
        //await Promise.all (internal_tasks)
      })
    }
  })


  tasks.push (async () => {
    // registries
    if (await exists (`${dirPath}/generated/reports/registries.json`))
    {
      log (`${dirPath}/generated/reports/registries.json already exists. skipped.`)
    }
    else
    {
      const serverPath = `${dirPath}/server.jar`
      await task_with_log (`Downloading ${serverPath} from ${version.downloads.server.url}`, () => download (version.downloads.server.url, serverPath))
      await task_with_log (`Generating Registries Data`, async () => {
        const command = new Deno.Command ('java.exe', {
          args: ['-DbundlerMainClass=net.minecraft.data.Main', '-jar', 'server.jar', '--reports'],
          cwd: stdpath.dirname (serverPath),
          stdout: 'inherit',
          stderr: 'inherit',
        })
        const {code} = await command.output ()
        if (code === 0)
        {
          await task_with_log (`Removing ${serverPath}`, () => Promise.all ([
            Deno.remove (serverPath),
            Deno.remove (`${dirPath}/libraries`, {recursive: true}),
            Deno.remove (`${dirPath}/logs`, {recursive: true}),
            Deno.remove (`${dirPath}/versions`, {recursive: true}),
          ]))
        }
        else
        {
          throw new Error (`Failed to Generating Registires Data`)
        }
      })
    }

    // processed_registries
    if (await exists (`${dirPath}/processed/reports/registries.json`))
    {
      log (`${dirPath}/processed/reports/registries.json already exists. skipped.`)
    }
    else
    {
      await task_with_log (`Processing Registry Data`, async () => {
        const registries: {[k: string]: {entries: {[k: string]: unknown}}} = await readJSONFile (`${dirPath}/generated/reports/registries.json`)
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
      })
    }

    // registries.ts
    await Deno.writeTextFile (`${dirPath}/registries.ts`, (() => {
      return [
        "import registries from './generated/reports/registries.json' assert { type: 'json' }",
        "",
        "type OmitMinecraft <T> = T extends 'minecraft:' ? ':' : T extends `minecraft:${infer U}` ? U : T",
        "const omit_minecraft = (location: string) => location === 'minecraft:' ? ':' : location.startsWith ('minecraft:') ? location.slice (10) : location",
        "",
        "type ProcessedRegistries = {",
        "  [k in OmitMinecraft <keyof typeof registries>]: OmitMinecraft <keyof typeof registries[`minecraft:${k}`]['entries']>[]",
        "}",
        "",
        "const processed: {[k in string]: string[]} = {}",
        "for (const [key, value] of Object.entries (registries))",
        "{",
        "  processed[omit_minecraft (key)] = Object.keys (value.entries).map (omit_minecraft).sort ()",
        "}",
        "",
        "export default processed as ProcessedRegistries",
        "",
      ].join ('\n')
    }) ())

  })
}

await Promise.all (tasks.map ((task) => task ()))
