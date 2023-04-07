import registries from './registries.json' assert { type: 'json' }

type OmitMinecraft <T> = T extends 'minecraft:' ? ':' : T extends `minecraft:${infer U}` ? U : T
const omit_minecraft = (location: string) => location === 'minecraft:' ? ':' : location.startsWith ('minecraft:') ? location.slice (10) : location

type ProcessedRegistries = {
  [k in OmitMinecraft <keyof typeof registries>]: OmitMinecraft <keyof typeof registries[`minecraft:${k}`]['entries']>[]
}

const processed: {[k in string]: string[]} = {}
for (const [key, value] of Object.entries (registries))
{
  processed[omit_minecraft (key)] = Object.keys (value.entries).map (omit_minecraft).sort ()
}

export default processed as ProcessedRegistries

