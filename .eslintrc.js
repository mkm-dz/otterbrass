// Generated using recommended approach
// https://code.visualstudio.com/api/advanced-topics/tslint-eslint-migration
module.exports = {
  "env": {
      "browser": true,
      "es6": true,
  },
  "extends": [
      "plugin:@typescript-eslint/recommended",
      "plugin:@typescript-eslint/recommended-requiring-type-checking"
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
      "project": "tsconfig.json",
      "sourceType": "module",
      "ecmaFeatures": {
          jsx: true,  // Allows for the parsing of JSX
      },
  },
  "plugins": [
      "eslint-plugin-jsdoc",
      "eslint-plugin-prefer-arrow",
      "@typescript-eslint",
      "import",
  ],
  /**
   * ESLint rules
   *
   * All available rules: http://eslint.org/docs/rules/
   *
   * Rules take the following form:
   *   'rule-name', [severity, { opts }]
   * Severity: 2 == error, 1 == warning, 0 == off.
   */
    rules:  {
      "quotes": [2, "single", {"avoidEscape": true, "allowTemplateLiterals": false}],
      "no-extra-semi": 2,
      "comma-style": [2, "last"],
      "wrap-iife": [2, "inside"],
      "spaced-comment": [2, "always", {"markers": ["*"]}],
      "eqeqeq": [2],
      "accessor-pairs": [2, {"getWithoutSet": false, "setWithoutGet": false}],
      "curly": 2,
      "new-parens": 2,
      "func-call-spacing": 2,
      "arrow-parens": [2, "as-needed"],
      "eol-last": 2,
      "no-caller": 2,
      "no-case-declarations": 2,
      "no-cond-assign": 2,
      "no-debugger": 2,
      "no-dupe-keys": 2,
      "no-duplicate-case": 2,
      "no-else-return": [2, {"allowElseIf": false}],
      "no-empty-character-class": 2,
      "no-global-assign": 2,
      "no-implied-eval": 2,
      "no-labels": 2,
      "no-multi-str": 2,
      "no-new-object": 2,
      "no-octal-escape": 2,
      "no-self-compare": 2,
      "no-shadow-restricted-names": 2,
      "no-unreachable": 2,
      "no-unsafe-negation": 2,
      "no-unused-vars": [2, {"args": "none", "vars": "local"}],
      "no-var": 2,
      "no-with": 2,
      "prefer-const": 2,
      "radix": 2,
      "valid-typeof": 2,
      "no-return-assign": [2, "always"],
      "require-yield": 2,
      "template-curly-spacing": [2, "never"],
      "space-infix-ops": 2,
      "space-in-parens": [2, "never"],
      "space-before-function-paren": [2, {"anonymous": "never", "named": "never", "asyncArrow": "always"}],
      "no-whitespace-before-property": 2,
      "keyword-spacing": [
        2, {
          "overrides": {
            "if": {"after": true},
            "else": {"after": true},
            "for": {"after": true},
            "while": {"after": true},
            "do": {"after": true},
            "switch": {"after": true},
            "return": {"after": true}
          }
        }
      ],
      "arrow-spacing": [2, {"after": true, "before": true}],
      "no-multiple-empty-lines": [2, {"max": 2}],
      "no-mixed-spaces-and-tabs": 2,
      "no-trailing-spaces": 2,
      
      "indent": [0, 2, {"SwitchCase": 1, "CallExpression": {"arguments": 2}, "MemberExpression": 2}],
      "brace-style": [0, "allman", {"allowSingleLine": true}],
      "key-spacing": [0, {"beforeColon": false, "afterColon": true, "align": "value"}],
      "quote-props": [0, "as-needed"],
      "no-implicit-globals": [0],
      "@typescript-eslint/explicit-member-accessibility": [0],
      "@typescript-eslint/ban-ts-comment": [0],

      // -- DISABLED BUT SHOULD BE ON

      // "linebreak-style": [2, "unix"],
      // "no-console": [2, {"allow": ["assert", "context", "error", "timeStamp", "time", "timeEnd", "warn"]}],

      "@typescript-eslint/no-unsafe-member-access": [0],
      "@typescript-eslint/no-unsafe-call": [0],
      "@typescript-eslint/no-unsafe-assignment": [0]

  },
  'settings': {
      'react': {
          'version': 'detect',  // Tells eslint-plugin-react to automatically detect the version of React to use
      },
  },
  'overrides': [{
      'files': ['*.ts'],
      'rules': {
          '@typescript-eslint/explicit-member-accessibility': [2, { 'accessibility': 'no-public' }],
          'comma-dangle': [2, 'always-multiline'],
          // run just the TypeScript unused-vars rule, else we get duplicate errors
          'no-unused-vars': 0,
          '@typescript-eslint/no-unused-vars': [2, { 'argsIgnorePattern': '^_' }],
      }
  }]
};