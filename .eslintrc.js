module.exports = {
    parser: "@typescript-eslint/parser",
    parserOptions: {
        project: "tsconfig.json",
        sourceType: "module"
    },
    plugins: ["@typescript-eslint/eslint-plugin"],
    extends: [
        "plugin:@typescript-eslint/recommended",
        "prettier/@typescript-eslint",
        "plugin:prettier/recommended",
        "prettier"
    ],
    root: true,
    env: {
        node: true,
        jest: true
    },
    ignorePatterns: [".eslintrc.js"],
    rules: {
        "@typescript-eslint/interface-name-prefix": "off",
        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/explicit-module-boundary-types": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "no-console": "warn",
        "default-case": "warn",
        "require-await": "warn",
        "space-in-parens": ["warn", "never"],
        "comma-spacing": ["warn", {"before": false, "after": true}],
        "comma-style": ["warn", "last"],
        "eslint-disable-line": "off",
        "eslint-disable-next-line": "off"
    }
};
