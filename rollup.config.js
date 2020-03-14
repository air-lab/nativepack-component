import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import { terser } from 'rollup-plugin-terser'

import pkg from './package.json'

export default {
  input: './index.mjs',
  plugins: [
    resolve(), // so Rollup can find `ms`
    commonjs(), // so Rollup can convert `ms` to an ES module
    terser({ sourcemap: true })
  ],
  output: [
    {
      sourcemap: 'inline',
      name: 'Component',
      file: pkg.browser,
      format: 'umd',
      exports: 'named'
    },
    { file: pkg.common, format: 'cjs', sourcemap: true, exports: 'named' },
    { file: pkg.module, format: 'es', sourcemap: true }
  ]
}
