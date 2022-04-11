import {RCONClient} from './rconClient.ts'

const hostname = Deno.env.get ('RCON_HOSTNAME') ?? 'localhost'
const port = parseInt (Deno.env.get ('RCON_PORT') ?? '25575', 10)
const password = Deno.env.get ('RCON_PASSWORD') ?? 'password'

const rcon = await RCONClient.connect (hostname, port, password)
const command = Deno.args.length === 0 ? 'help' : Deno.args.join (' ')
await rcon.sendCommand (command).then ((response) => console.log (response))
