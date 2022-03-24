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
    // Old modules prior to the linting rule being enabled
    // Avoid adding tags to this list
    // Help remove tags from this list
    // https://eslint.vuejs.org/rules/multi-word-component-names.html
    'vue/multi-word-component-names': ['error', {
      'ignores': [
        "Award",
        "Awards",
        "agenda",
        "board",
        "bonus",
        "colony",
        "Milestone",
        "party",
        "Party",
        "sidebar",
        "Tag",
        "turmoil",
        "Card",
        "Button",
        "Help"
      ]
    }],
  },
};
