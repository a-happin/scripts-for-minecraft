
//const sleep = (msec: number) => new Promise ((resolve) => setTimeout (resolve, msec))

const writeAllSync = (w: Deno.WriterSync, arr: Uint8Array) =>
{
  let nwritten = 0;
  while (nwritten < arr.length)
  {
    nwritten += w.writeSync (arr.subarray (nwritten))
  }
}

export const logs: {str: string}[] = []

const encoder = new TextEncoder ()
const stdoutWrite = (str: string) => {
  writeAllSync (Deno.stdout, encoder.encode (str))
}

const write = (msg: string) => {
  stdoutWrite (`\r${msg}`)
}

// -1: uninitialized
let lastRows = -1
const resetScreen = () => {
  if (lastRows >= 0)
  {
    stdoutWrite (`\x1b[${lastRows}A\r\x1b[?OJ`)
  }
}

export const breakLine = () => {
  stdoutWrite ('\n')
}

export const render = () => {
  const msg = logs.map ((x) => `${x.str}\n`).join ('')
  resetScreen ()
  write (msg)
  lastRows = logs.length
}

export const console = (str: string) => {
  resetScreen ()
  write (str)
  breakLine ()
  render ()
}

export const add = (str: string) => {
  const log = {
    str,
    update (str: string)
    {
      this.str = str
      render ()
    }
  }
  logs.push (log)
  return log
}

