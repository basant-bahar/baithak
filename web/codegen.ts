import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: process.env.GRAPHQL_SCHEMA_URL || process.env.NEXT_PUBLIC_API_URL,
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
