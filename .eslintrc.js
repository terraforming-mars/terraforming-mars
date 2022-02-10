module.exports = {
  'env': {
    'browser': true,
    'es6': true,
  },
  'extends': [
    'google',
    'plugin:vue/essential',
  ],
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
    'camelcase': 'off',
    'eqeqeq': ['error', 'always'],
    'max-len': 'off',
    'no-throw-literal': 'off',
    'no-unused-vars': 'off',
    'no-var': 'error',
    'prefer-const': 'error',
    'indent': ['error', 2],
    'require-jsdoc': 'off',
    'no-throw-literal': 'error',
    'no-extra-semi': 'error',
    // Should turn this back on, but for now, turn it off.
    // https://eslint.vuejs.org/rules/multi-word-component-names.html
    'vue/multi-word-component-names': 'warn',
  },
};
