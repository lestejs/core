import esbuild from 'esbuild'
import {resolve} from "path";

const args = process.argv.slice(2)
// const mode = args.includes('-d') ? 'development' : 'production'

export function base(config = {}) {
  return esbuild.build({
    entryPoints: [resolve(`packages/${args[0]}/index.js`)],
    format: 'esm',
    bundle: true,
    minify: true,
    sourcemap: true,
    target: ['esnext'],
    ...config
  })
}