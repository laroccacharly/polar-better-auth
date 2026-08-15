import { defineConfig } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypeScript from "eslint-config-next/typescript";

const eslintConfig = defineConfig([...nextVitals, ...nextTypeScript]);

export default eslintConfig;
