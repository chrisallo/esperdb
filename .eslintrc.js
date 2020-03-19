module.exports = {
  'env': {
    'browser': true,
    'commonjs': true,
    'es6': true
  },
  'extends': 'eslint:recommended',
  'globals': {
    'esdb': true,
    'Atomics': 'readonly',
    'SharedArrayBuffer': 'readonly'
  },
  'parserOptions': {
    'ecmaVersion': 2018,
    'sourceType': 'module'
  },
  'rules': {
    'semi': 1,
    'no-redeclare': 0,
    'no-prototype-builtins': 0,
    'no-inner-declarations': 0,
    'no-global-assign': 0,
    'no-console': 1,
    'no-unused-vars': 1,
    'no-undef': 1,
    'no-debugger': 1
  }
};
