module.exports = {
  root: true,
  extends: [
    'prettier'
  ],
  parserOptions: {
    ecmaVersion: 8,
    ecmaFeatures: {
      impliedStrict: true
    }
  },
  env: {
    browser: true,
    node: true
  },
  rules: {
    'no-debugger': 0,
    'no-alert': 0,
    'no-console': 0,
    'no-underscore-dangle': 0,
    'consistent-return': 1,
    'no-undef': 'off',
    'array-callback-return': 1,
    radix: 0,
    'max-len': 0,
    indent: ['error', 2],
    'linebreak-style': ['error', 'unix'],
    quotes: [
      2,
      'single',
      {
        avoidEscape: true,
        allowTemplateLiterals: true
      }
    ],
    semi: [
      1,
      'always'
    ],
    'no-unused-vars': [
      1,
      {
        argsIgnorePattern: 'res|next|^err'
      }
    ],
    'promise/no-nesting': 1,
    'promise/always-return': 1,
    'promise/catch-or-return': 1,
    'prettier/prettier': [
      2,
      {
        trailingComma: 'es5',
        singleQuote: true
      }
    ]
  },
  plugins: [
    'prettier',
    'promise'
  ]
};
