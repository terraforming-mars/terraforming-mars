module.exports = {
  'env': {
    'browser': true,
    'es6': true,
  },
  'extends': [
    'plugin:vue/essential',
    'google',
  ],
  'globals': {
    'Atomics': 'readonly',
    'SharedArrayBuffer': 'readonly',
  },
  'parserOptions': {
    'ecmaVersion': 2018,
    'parser': '@typescript-eslint/parser',
    'sourceType': 'module',
  },
  'plugins': [
    'vue',
    '@typescript-eslint',
  ],
  'rules': {
    'comma-dangle': ['error', 'never'],
    'indent': ['error', 4],
    'no-unused-vars': ['off'],
    '@typescript-eslint/no-unused-vars': ['error', {
        "vars": "all",
        "args": "after-used",
        "ignoreRestSiblings": false
    }],
    'require-jsdoc': ['error', {
        'require': {
            'FunctionDeclaration': false
        }
    }]
  },
};
