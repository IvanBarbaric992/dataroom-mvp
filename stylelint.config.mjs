/** @type {import('stylelint').Config} */
export default {
  extends: ['stylelint-config-standard'],

  rules: {
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: [
          'tailwind',
          'apply',
          'variants',
          'responsive',
          'screen',

          'theme',
          'utility',
          'variant',
          'custom-variant',
          'source',
          'config',
          'plugin',
          'reference',

          'layer',
        ],
      },
    ],

    'custom-property-pattern': null,
    'custom-property-no-missing-var-function': null,
    'custom-property-empty-line-before': null,

    'number-max-precision': null,

    'import-notation': null,

    'block-no-empty': true,

    'no-empty-source': true,

    'no-duplicate-selectors': true,

    'color-no-invalid-hex': true,

    'no-unknown-animations': true,

    'declaration-block-no-shorthand-property-overrides': true,

    'at-rule-no-deprecated': true,

    'max-nesting-depth': [
      3,
      {
        ignore: ['pseudo-classes'],
        ignoreAtRules: ['media', 'supports', 'container'],
      },
    ],

    'selector-max-specificity': [
      '0,4,0',
      {
        ignoreSelectors: [':where()', ':is()'],
      },
    ],

    'selector-max-id': 0,

    'keyframe-block-no-duplicate-selectors': true,

    'font-family-no-missing-generic-family-keyword': true,

    'declaration-block-no-duplicate-properties': [
      true,
      { ignore: ['consecutive-duplicates-with-different-values'] },
    ],

    'property-no-vendor-prefix': true,
    'value-no-vendor-prefix': true,

    'function-no-unknown': [
      true,
      {
        ignoreFunctions: [
          'theme',
          'oklch',
          'color-mix',
          'clamp',
          'min',
          'max',
          'round',
          'mod',
          'rem',
        ],
      },
    ],

    'property-no-unknown': [
      true,
      {
        ignoreProperties: [
          'field-sizing',
          'anchor-name',
          'position-anchor',
          'tab-size',
          'text-wrap',
          'color-scheme',
          'inert',
        ],
      },
    ],

    'color-hex-length': 'short',
    'alpha-value-notation': 'number',
    'length-zero-no-unit': true,

    'no-descending-specificity': null,
    'selector-class-pattern': null,
  },

  ignoreFiles: [
    '**/*.js',
    '**/*.jsx',
    '**/*.ts',
    '**/*.tsx',
    '**/*.vue',
    '**/*.svelte',
    '**/node_modules/**',
    '**/dist/**',
    '**/build/**',
  ],
};
