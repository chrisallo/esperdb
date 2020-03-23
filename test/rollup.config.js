import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default [
  {
    input: './test/index.js',
    output: {
      file: 'esdb.test.js',
      name: 'esdb',
      format: 'umd',
      exports: 'named',
      compact: false
    },
    onwarn: (warning, next) => {
      if (warning.code === 'CIRCULAR_DEPENDENCY') {
        return;
      }
      next(warning);
    },
    plugins: [
      babel({
        exclude: 'node_modules/**',
        presets: [
          [
            '@babel/preset-env',
            {
              modules: false,
              targets: {
                browsers: '> 1%, IE 10, not op_mini all, not dead',
                node: 10
              }
            }
          ]
        ],
        plugins: [
          '@babel/plugin-transform-runtime'
        ],
        runtimeHelpers: true
      }),
      resolve(),
      commonjs()
    ],
    external: []
  }
];
