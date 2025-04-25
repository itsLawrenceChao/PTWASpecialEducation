import js from "@eslint/js";
import vue from "eslint-plugin-vue";
import prettier from "eslint-config-prettier";

export default [
  js.configs.recommended,
  ...vue.configs["flat/recommended"],
  {
    files: ["**/*.vue", "**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        node: true,
      },
      parser: vue.parser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    plugins: {
      vue,
    },
    rules: {
      "vue/prop-name-casing": "off",
      "vue/require-v-for-key": "off",
      "vue/multi-word-component-names": "off",
      "vue/no-duplicate-attributes": "off",
      "vue/html-indent": "off",
      "vue/attribute-hyphenation": "off",
      "vue/max-attributes-per-line": "off",
      "vue/html-self-closing": "off",
      "vue/singleline-html-element-content-newline": "off",
      "vue/custom-event-name-casing": [
        "error",
        "camelCase",
        {
          ignores: ["/next-question/", "/play-effect/", "/add-record/"],
        },
      ],
      "vue/v-on-event-hyphenation": "off",
    },
  },
  {
    files: ["**/FractionText.vue"],
    rules: {
      "vue/no-v-html": "off",
    },
  },
  prettier,
];
