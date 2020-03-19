import progress from 'rollup-plugin-progress';
import filesize from 'rollup-plugin-filesize';

import banner from 'rollup-plugin-banner';
import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';
import { eslint } from 'rollup-plugin-eslint';
import { uglify } from 'rollup-plugin-uglify';

export default [
  {
    input: './src/esdb.js',
    output: {
      file: 'esdb.min.js',
      name: 'esdb',
      format: 'umd',
      exports: 'named',
      compact: true
    },
    onwarn: (warning, next) => {
      if (warning.code === 'CIRCULAR_DEPENDENCY') {
        return;
      }
      next(warning);
    },
    plugins: [
      progress(),
      eslint(),
      babel({
        exclude: 'node_modules/**',
        presets: [
          [
            '@babel/preset-env',
            {
              modules: false,
              targets: {
                browsers: '> 1%, IE 11, not op_mini all, not dead',
                node: 10
              }
            }
          ]
        ],
        runtimeHelpers: true
      }),
      resolve(),
      commonjs(),
      uglify(),
      json(),
      filesize(),
      banner('esdb v<%= pkg.version %>')
    ],
    external: []
  }
];
