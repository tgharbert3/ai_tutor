import antfu from "@antfu/eslint-config";

export default antfu({
    type: "app",
    typescript: true,
    formatters: true,
    stylistic: {
        indent: 4,
        semi: true,
        quotes: "double",
    },
    ignores: ["./src/db/migrations"],
    gitignore: true,
}, {
    rules: {
        "ts/no-redeclare": "off",
        "ts/consistent-type-definitions": ["error", "type"],
        "no-console": ["warn"],
        "antfu/no-top-level-await": ["off"],
        "node/prefer-global/process": ["off"],
        "node/no-process-env": ["error"],
        "perfectionist/sort-imports": ["error", {
            tsconfigRootDir: ".",
        }],
        "test/prefer-lowercase-title": false,
    },
});
