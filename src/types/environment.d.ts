import { LambdaRuntimeEnvironmentVariables } from "./lambda-runtime-environment-variables";

declare global {
  namespace NodeJS {
    interface ProcessEnv extends LambdaRuntimeEnvironmentVariables {}
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
