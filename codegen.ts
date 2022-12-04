import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "http://localhost:9876/graphql",
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
      },
      plugins: [],
    },
  },
};
export default config;
