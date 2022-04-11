// 参考: https://developer.valvesoftware.com/wiki/Source_RCON_Protocol

export const PacketType = {
  SERVERDATA_AUTH: 3,
  SERVERDATA_AUTH_RESPONSE: 2,
  SERVERDATA_EXECCOMMAND: 2,
  SERVERDATA_RESPONSE_VALUE: 0,
} as const
export type PacketType = keyof typeof PacketType

export class Packet {
  constructor (
    public id: number,
    public type: keyof typeof PacketType,
    public body: string,
  ) {}

  intoUint8Array () {
    const body_buf = new TextEncoder ().encode (this.body)
    const buf = new ArrayBuffer (body_buf.byteLength + 13)
    const view = new DataView (buf)
    view.setInt32 (0, body_buf.byteLength + 9, true)
    view.setInt32 (4, this.id, true)
    view.setInt32 (8, PacketType[this.type], true)
    view.setInt8 (body_buf.byteLength + 12, 0)

    const res = new Uint8Array (buf)
    res.set (body_buf, 12)
    return res
  }
}

export class RCONClient {
  constructor (
    private conn: Deno.Conn
  )
  {}

  public static async connect (hostname: string, port: number, password: string) {
    const conn = await Deno.connect ({hostname, port})
    const rcon = new RCONClient (conn)
    await rcon.send (new Packet (1, 'SERVERDATA_AUTH', password))
    return rcon
  }

  public async send (packet: Packet) {
    await this.conn.write (packet.intoUint8Array ())
    return await this.recv (packet.id)
  }

  private async recv (original_id: number) {
    let buf = new Uint8Array (12)
    await this.conn.read (buf)
    const view = new DataView (buf.buffer)
    const length = view.getInt32 (0, true)
    const id = view.getInt32 (4, true)
    const type = view.getInt32 (8, true)

    buf = new Uint8Array (length - 9)
    await this.conn.read (buf)
    const str = new TextDecoder ().decode (buf)

    // discard
    await this.conn.read (new Uint8Array (1))

    if (id !== original_id && type === PacketType['SERVERDATA_AUTH_RESPONSE'])
    {
      this.conn.close ()
      throw 'Authenication Failed'
    }

    return str
  }

  public sendCommand (command: string) {
    return this.send (new Packet (2, 'SERVERDATA_EXECCOMMAND', command))
  }
}
