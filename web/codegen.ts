import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "schema.graphql",
  documents: [
    "app/**/*.{ts,tsx}",
    "!app/gql/**/*",
    "graphql/**/*.{ts,tsx}",
    "!graphql/gql/**/*",
    "components/**/*.{ts,tsx}",
    "!components/gql/**/*",
  ],
  generates: {
    "./__generated__/": {
      preset: "client",
      presetConfig: {
        extension: ".generated.tsx",
        baseTypesPath: "types.ts",
        fragmentMasking: { unmaskFunctionName: "getFragmentData" },
      },
      plugins: [],
    },
  },
};
export default config;
