
module.exports = {

    env: {
      browser: true,
      node: true,
      es6: true
    },
  
    rules: {
  
      // *** athenahealth Platform2 specific rules ***
  
      // Newlines
      //'linebreak-style': [ 2, 'unix' ],
      'eol-last': 2,
      // Spaces / NO TABS for Indentation
      'no-tabs': 2,
      indent: [ 2, 2, {
        SwitchCase: 1 ,
        MemberExpression: 1 ,
        outerIIFEBody: 1 ,
        FunctionDeclaration: {parameters: 'first'},
        FunctionExpression: {parameters: 'first'},
        CallExpression: {arguments: 'first'},
        ArrayExpression: 'first',
        ObjectExpression: 'first'
      } ],
      // No trailing whitespace
      'no-trailing-spaces': 2,
      // Use Semicolons
      semi: [ 2, 'always' ],
      'no-extra-semi': 2,
      // 120 characters per line
      'max-len': [ 1, 120, 2, {
        ignoreUrls: true,
        ignoreComments: false,
        ignoreRegExpLiterals: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
        ignoreTrailingComments: true
      } ],
      // Use single quotes
      quotes: [ 2, 'single', {
        avoidEscape: true,
        allowTemplateLiterals: true
      } ],
      // All Blocks Require Braces but allows single-line if, else without curly...
      curly: [2, "multi-line"],
      // Opening Braces Go on the Same Line
      'brace-style': [ 2, 'stroustrup' ],
      // Declare One Variable per let/const Statement
      'one-var': [ 2, 'never' ],
      // Use lowerCamelCase for Variables, Properties, and Function Names
      'camelcase': 1,
      // Use UpperCamelCase for Class Names
      'new-cap': [1, { "capIsNew": false }],
      // Object / Array creation
      'quote-props': [ 2, 'as-needed', {
        keywords: true,
        numbers: true
      } ],
      'comma-dangle': [ 2, {
        arrays: 'always-multiline',
        objects: 'always-multiline',
        imports: 'never',
        exports: 'never',
        functions: 'never'
      } ],
      // Use of var/let/const
      'no-var': 2,
      'no-const-assign': 2,
      // Disallow String Concatenation When Using Global Path Variables
      'no-path-concat': 2,
      // Use the === Operator
      eqeqeq: [ 2, 'smart' ],
  
      // Method Chaining
      'newline-per-chained-call': 1,
      'dot-location': [ 1, 'property' ],
      // Object.freeze, Object.preventExtensions, Object.seal, with, eval
      'no-with': 2,
      'no-eval': 2,
      'no-implied-eval': 2,
      'no-prototype-builtins': 2,
      // Do Not Use console
      'no-console': 2,
      // Requires At Top
      'global-require': 1,
      'no-new-require': 2,
      'no-mixed-requires': 1,
      // Getters and Setters
      'accessor-pairs': 2,
      // Do Not Extend Built-in Prototypes
      'no-extend-native': 2,
      //enforces or disallows newlines between operands of a ternary expression. Turning Off P2AP-247
      'multiline-ternary': 0,
  
      // Not in Platform2 JavaScript Style Guide
      // but part of eslint-config-platform2 eslint rules.
      //strict: 2,
      'space-unary-ops': [2, { words: true }],
      'object-curly-spacing': [ 2, 'always' ],
      'arrow-spacing': [2, { before: true, after: true }],
      'block-spacing': [2, 'always'],
      'comma-spacing': [2, { before: false, after: true }],
      'comma-style': [2, 'last'],
      'key-spacing': [2, { beforeColon: false, afterColon: true }],
      'keyword-spacing': [2, { before: true, after: true }],
      'array-bracket-spacing': [ 2, 'always' ],
      'block-scoped-var': 2,
      'no-unused-vars': 1,
      'no-use-before-define': [ 2, {
        functions: false,
        classes: true
      } ]
    }
  };
  