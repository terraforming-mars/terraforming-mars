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
  'no-extra-semi': 'error',
  'curly': 'error',
  'brace-style': 'error',

  // Disabled entries from eslint:recommended
  'no-case-declarations': 'off',
  'no-redeclare': 'off',
  'no-prototype-builtins': 'off',
  'no-useless-assignment': 'off',
  'preserve-caught-error': 'off',
};

// eslint-plugin-vue's flat/essential preset, flattened into a single rules object.
const vueEssentialRules = vuePlugin.configs['flat/essential'].reduce(
  (acc, entry) => ({...acc, ...(entry.rules ?? {})}),
  {},
);

// TypeScript and Vue rules
const pluginRules = {
  'no-throw-literal': 'error',
  '@typescript-eslint/prefer-for-of': 'error',
  '@typescript-eslint/no-non-null-assertion': 'error',
  ...vueEssentialRules,
  // Buggy under eslint-plugin-vue 10.8 + ESLint 10 — emits spurious "clear" errors.
  // Project doesn't use template-scoped eslint-disable comments.
  'vue/comment-directive': 'off',
  'vue/multi-word-component-names': ['error', {
    ignores: [
      'Award',
      'Awards',
      'Board',
      'Bonus',
      'Card',
      'Colony',
      'Help',
      'Milestone',
      'Milestones',
      'Party',
      'Sidebar',
      'Tag',
      'Turmoil',
    ],
  }],
  'vue/no-reserved-component-names': 'warn',
  // B15 — directive shorthand consistency.
  'vue/v-on-style': ['error', 'shorthand'],
  'vue/v-bind-style': ['error', 'shorthand'],
  'vue/v-slot-style': ['error', 'shorthand'],
  // B6 — components with no content should self-close. HTML elements left alone.
  'vue/html-self-closing': ['error', {
    html: {void: 'never', normal: 'never', component: 'always'},
    svg: 'always',
    math: 'always',
  }],
  // B8 — PascalCase for `name:` in component definitions.
  'vue/component-definition-name-casing': ['error', 'PascalCase'],
  // B7 — PascalCase for component tags in SFC templates.
  'vue/component-name-in-template-casing': ['error', 'PascalCase', {
    registeredComponentsOnly: false,
  }],
};

const sharedLanguageOptions = {
  ecmaVersion: 2018,
  sourceType: 'module',
  globals: {
    ...globals.browser,
    ...globals.node,
  },
};

const sharedConfig = {
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
};

export default [
  // TypeScript files
  {
    files: ['src/**/*.ts', 'tests/**/*.ts'],
    languageOptions: {
      ...sharedLanguageOptions,
      parser: tsParser,
    },
    ...sharedConfig,
  },

  // Vue files
  {
    files: ['src/**/*.vue'],
    languageOptions: {
      ...sharedLanguageOptions,
      parser: vueParser,
      parserOptions: {
        parser: tsParser,
      },
    },
    ...sharedConfig,
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

  // Card implementation rules
  {
    files: ['src/server/cards/**/*.ts'],
    rules: {
      'no-restricted-syntax': ['error', {
        selector: 'MethodDefinition[key.name="bespokePlay"] CallExpression[callee.property.name="getCardCost"]',
        message: 'Do not call getCardCost() inside bespokePlay() — card payment is already deducted before bespokePlay runs. Pass cost: 0 to space-availability helpers instead.',
      }],
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
