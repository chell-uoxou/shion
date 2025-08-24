import { defineConfig } from "orval";

import * as dotenv from "dotenv";
dotenv.config();
const envApiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!envApiBaseUrl) {
  console.warn(
    "NEXT_PUBLIC_API_BASE_URL is not set in .env file. Defaulting to http://localhost:8080"
  );
}

const apiBaseUrl = envApiBaseUrl || "http://localhost:8080";

const config = defineConfig({
  api: {
    input: "../backend/openapi.yaml",
    output: {
      mode: "tags-split",
      clean: true,
      target: "./src/generated/api/",
      schemas: "./src/generated/api/model",
      client: "react-query",
      mock: false,
      prettier: true,
      tsconfig: "./tsconfig.json",
      baseUrl: apiBaseUrl,
      override: {
        mutator: {
          path: "./src/lib/custom-instance.ts",
          name: "customInstance",
        },
      },
    },
  },
});

export default config;
