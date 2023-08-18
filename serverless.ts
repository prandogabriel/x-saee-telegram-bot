import type { AWS } from "@serverless/typescript";

const configuration: AWS = {
  service: "x-saee-telegram-bot",
  frameworkVersion: ">=3.26.0",
  functions: {
    webHook: {
      // src/main/create-user/handler.main
      // src/functions/webhook-handler.ts
      handler: "src/functions/webhook-handler.handler",
      events: [
        {
          httpApi: {
            method: "POST",
            path: "/webhook"
          }
        },
        {
          httpApi: {
            method: "GET",
            path: "/webhook"
          }
        }
      ]
    }
  },
  resources: {},
  provider: {
    name: "aws",
    stackName: "${self:service}-${self:custom.stage}-stack",
    runtime: "nodejs18.x",
    stage: "${self:custom.stage}",
    region: "us-east-1",
    versionFunctions: false,

    timeout: 15,
    memorySize: 256,
    environment: {
      BOT_TELEGRAM_TOKEN: "${env:BOT_TELEGRAM_TOKEN}",
      TELEGRAM_API_URL: ""
    },
    iam: {}
  },
  custom: {
    stage: "${opt:stage,'dev'}",

    prune: {
      automatic: true,
      includeLayers: true,
      number: 3
    },

    esbuild: {
      bundle: true,
      minify: true,
      sourcemap: true,
      // exclude: ["aws-sdk"],
      target: "node18",
      define: { "require.resolve": undefined },
      platform: "node",
      concurrency: 10
    },
    useDotenv: true,
    package: {
      individually: true,
      excludeDevDependencies: true
    }
  },
  plugins: [
    "serverless-esbuild",
    "serverless-offline",
    "serverless-prune-plugin"
  ]
};

export = configuration;
