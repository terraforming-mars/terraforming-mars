import js from '@eslint/js';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import vuePlugin from 'eslint-plugin-vue';
import vueParser from 'vue-eslint-parser';
import globals from 'globals';

// Rules carried over from eslint-config-google (quality + style rules)
const googleRules = {
  'guard-for-in': 'error',
  'no-caller': 'error',
  'no-extend-native': 'error',
  'no-extra-bind': 'error',
  'no-invalid-this': 'error',
  'no-multi-str': 'error',
  'no-new-wrappers': 'error',
  'prefer-promise-reject-errors': 'error',
  'prefer-rest-params': 'error',
  'prefer-spread': 'error',
  'new-cap': 'error',
  'arrow-parens': ['error', 'always'],
  'quotes': ['error', 'single', {avoidEscape: true, allowTemplateLiterals: true}],
  'semi': 'error',
  'comma-dangle': ['error', 'always-multiline'],
  'no-trailing-spaces': 'error',
  'eol-last': 'error',
  'no-multiple-empty-lines': ['error', {max: 2}],
  'padded-blocks': ['error', 'never'],
  'spaced-comment': ['error', 'always'],
  'space-before-blocks': 'error',
  'keyword-spacing': 'error',
  'comma-spacing': 'error',
  'key-spacing': 'error',
  'semi-spacing': 'error',
  'no-tabs': 'error',
  'no-array-constructor': 'error',
  'no-new-object': 'error',
  'one-var': ['error', 'never'],
  'operator-linebreak': ['error', 'after'],
  'quote-props': ['error', 'consistent'],
  'space-before-function-paren': ['error', {
    asyncArrow: 'always',
    anonymous: 'never',
    named: 'never',
  }],
};

// Rules from root .eslintrc.js overrides
const projectRules = {
  'camelcase': 'off',
  'eqeqeq': ['error', 'always'],
  'max-len': 'off',
  'no-unused-vars': 'off',
  'no-var': 'error',
  'prefer-const': 'error',
  'indent': ['error', 2],
  'require-jsdoc': 'off',
  'no-throw-literal': 'error',
  'no-extra-semi': 'error',

  // Disabled entries from eslint:recommended
  'no-inner-declarations': 'off',
  'no-case-declarations': 'off',
  'no-redeclare': 'off',
  'no-prototype-builtins': 'off',
  'valid-jsdoc': 'off',
};

// TypeScript and Vue rules
const pluginRules = {
  '@typescript-eslint/prefer-for-of': 'error',
  '@typescript-eslint/no-non-null-assertion': 'error',
  'vue/multi-word-component-names': ['error', {
    ignores: [
      'Award',
      'Awards',
      'agenda',
      'board',
      'bonus',
      'colony',
      'Milestone',
      'Milestones',
      'party',
      'Party',
      'sidebar',
      'Tag',
      'turmoil',
      'Card',
      'Button',
      'Help',
    ],
  }],
  'vue/no-reserved-component-names': 'warn',
};

export default [
  // Global defaults for all .ts and .vue files in src/ and tests/
  {
    files: ['src/**/*.ts', 'src/**/*.vue', 'tests/**/*.ts'],
    languageOptions: {
      ecmaVersion: 2018,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parser: vueParser,
      parserOptions: {
        parser: tsParser,
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      'vue': vuePlugin,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...googleRules,
      ...projectRules,
      ...pluginRules,
    },
  },

  // src/ override
  {
    files: ['src/**/*.ts', 'src/**/*.vue'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: {
      'require-await': 'error',
    },
  },

  // tests/ override
  {
    files: ['tests/**/*.ts'],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.mocha,
      },
    },
    rules: {
      '@typescript-eslint/no-non-null-assertion': 'off',
    },
  },
];
