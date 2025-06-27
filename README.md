# Azure Client API 🚀

**A Serverless, TypeScript-powered CLI & API for managing Azure DevOps Projects and Work Items, with AWS, Discord, and modern cloud-native best practices.**

---

## ✨ Project Overview

Welcome to the **Azure Client API**! This project is a cloud-native, serverless CLI and API toolkit for managing Azure DevOps Projects and Work Items. It leverages the power of AWS Lambda, SNS, SQS, and Discord for notifications, and is built with TypeScript, Node.js, and the Serverless Framework. 

**Why?**
- Automate Azure DevOps project and work item management
- Integrate with AWS for secrets, messaging, and dead-letter queues
- Get real-time Discord notifications for every operation
- Built for extensibility, reliability, and developer happiness

---

## 🏗️ Features & Architecture

- **Azure DevOps Integration**: Create, list, get, update, and delete projects and work items via REST API (using `axios`).
- **AWS Integration**: Securely fetch Azure API tokens from AWS Secrets Manager; use SNS/SQS for event-driven messaging and DLQ for error handling.
- **Serverless**: Deploy as AWS Lambda functions using the Serverless Framework.
- **Discord Webhook**: Get instant notifications for every CLI/API operation.
- **Validation**: All requests and responses are validated with `zod` schemas.
- **Behavioral Design Patterns**: Clean, modular, and extensible codebase.
- **Testing & Linting**: Jest for unit tests, ESLint + Prettier for code quality.

---

## 📂 Project Structure

```
src/
  handlers/         # Lambda entry points for Azure Project & Work Item operations
  services/         # Business logic for Azure, AWS, SNS, etc.
  schemas/          # Zod schemas for validation
  utils/            # Utility functions (e.g., Discord notifier)
  events/           # Example event payloads for testing
  index.ts          # (Reserved for CLI entry point)
```

---

## 🛠️ Usage

### CLI/API Operations

- **Projects**: `create`, `list`, `get`, `delete`
- **Work Items**: `create`, `list`, `get`, `update`, `delete`

All operations are triggered via AWS Lambda handlers (see `src/handlers/`). Each handler:
- Validates input with zod schemas
- Calls the appropriate Azure DevOps REST API
- Publishes a message to AWS SNS
- Sends a Discord notification

#### Example Event Payloads
See `src/events/` for ready-to-use JSON payloads for each operation.

---

## 🚀 Getting Started

### 1. Clone & Install
```bash
git clone https://github.com/your-username/Azure-Client-API.git
cd Azure-Client-API
npm install
```

### 2. Environment Setup
Create a `.env` file with the following variables:
```
MY_REGION=your-aws-region
AZURE_SECRET_NAME=your-aws-secretsmanager-name
AZURE_ORG_URL=https://dev.azure.com/your-org
AZURE_PROJECT=your-azure-project
AZURE_API_VERSION=7.2-preview.1
SNS_TOPIC_ARN=your-sns-topic-arn
DISCORD_WEBHOOK_URL=your-discord-webhook-url
```

### 3. Deploy to AWS Lambda
```bash
npm run deploy
```

### 4. Test Locally
You can invoke handlers locally using the Serverless Offline plugin or by sending events to the deployed Lambda functions.

---

## 🧩 Key Components

### Handlers (`src/handlers/`)
- **azureProjectHandler.ts**: Handles all Azure Project operations (create, list, get, delete)
- **azureWorkItemHandler.ts**: Handles all Work Item operations (create, list, get, update, delete)

### Services (`src/services/`)
- **azureProjectService.ts**: Business logic for Azure Project REST API
- **azureWorkItemService.ts**: Business logic for Work Item REST API
- **awsService.ts**: Fetches Azure API tokens from AWS Secrets Manager
- **snsService.ts**: Publishes messages to AWS SNS

### Schemas (`src/schemas/`)
- **azureProjectSchemas.ts**: Zod schema for project creation
- **azureWorkItemSchemas.ts**: Zod schemas for work item creation and retrieval

### Utils (`src/utils/`)
- **discordNotifier.ts**: Sends notifications to Discord via webhook

---

## 🧪 Testing & Quality
- **Unit Testing**: Run `npm test` (Jest)
- **Linting**: Run `npx eslint .`
- **Formatting**: Run `npx prettier --check .`

---

## 🛡️ Security & Best Practices
- **Secrets**: Azure API tokens are never hardcoded; always fetched securely from AWS Secrets Manager.
- **Validation**: All inputs/outputs are validated with zod.
- **DLQ**: Failed SNS/SQS messages are routed to a Dead Letter Queue for later analysis.

---

## 🤖 Behavioral Design Patterns
This project demonstrates behavioral design patterns such as Command, Observer (SNS/Discord notifications), and Strategy (service abstraction).

---

## 📦 Deployment & Serverless
- **serverless.yml** configures AWS Lambda, SNS, SQS (DLQ), and environment variables.
- **serverless-esbuild** for fast TypeScript builds.
- **serverless-dotenv-plugin** for environment management.

---

## 📚 Further Reading & Resources
- [Azure DevOps REST API](https://learn.microsoft.com/en-us/rest/api/azure/devops/?view=azure-devops-rest-7.2)
- [Serverless Framework Docs](https://www.serverless.com/framework/docs)
- [AWS SDK v3 for JavaScript](https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/welcome.html)
- [Zod Validation](https://zod.dev/)
- [Discord Webhooks](https://discord.com/developers/docs/resources/webhook)

---

## 🧙‍♂️ Contributing & License
Pull requests are welcome! For major changes, please open an issue first. <br/>
Licensed under the ISC License.
