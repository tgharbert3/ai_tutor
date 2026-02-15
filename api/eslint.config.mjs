import antfu from "@antfu/eslint-config";
import importX from "eslint-plugin-import-x";

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
    plugins: {
        "import-x": importX,
    },
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
        "style/eol-last": ["error", "never"],
        "import-x/no-cycle": ["error"],
    },
});