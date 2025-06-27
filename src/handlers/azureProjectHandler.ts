import { createAzureProject, deleteAzureProject, listAzureProjects, getAzureProjectDetails } from '../services/azureProjectService';
import { publishSNSMessage } from '../services/snsService';
import { sendDiscordNotification } from '../utils/discordNotifier';
import dotenv from 'dotenv';

dotenv.config();

const SNS_TOPIC_ARN = process.env.SNS_TOPIC_ARN!;

export type ProjectAction = "create" | "list" | "get" | "delete";

export interface ProjectPayload {
  action: ProjectAction;
  payload?: {
    projectId?: string;
    name?: string;
    description?: string;
    visibility?: "private" | "public";
  };
}

export interface ProjectEvent {
  body?: string | ProjectPayload;
}


export const handler = async (event: ProjectEvent) => {
  let body: ProjectPayload;

  try {
    body = typeof event.body === "string" ? JSON.parse(event.body) : event.body!;
  } catch (error) {
    console.error("Invalid JSON input:", error);
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid JSON" }),
    };
  }

  const action = body.action;
  const payload = body.payload;

  if (!action) {
    console.error("Action is undefined!");
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Action is required." }),
    };
  }

  try {
    let result;
    switch (action) {
      case "create":
        if (!payload?.name || !payload?.visibility) {
          return {
            statusCode: 400,
            body: JSON.stringify({ error: "'name' and 'visibility' are required for project creation." }),
          };
        }
        result = await createAzureProject({
          name: payload.name,
          visibility: payload.visibility,
          description: payload.description,
        });
      case "list":
        result = await listAzureProjects();
        break;
      case "get":
        result = await getAzureProjectDetails(payload!.projectId!);
        break;
      case "delete":
        result = await deleteAzureProject(payload!.projectId!);
        break;
      default:
        throw new Error(`Unsupported action: ${action}`);
    }

    await sendDiscordNotification(`✅ **Action:** \`${action}\` project completed successfully.`);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: `${action} operation completed.`,
        result,
      }),
    };
  } catch (error: any) {
    await sendDiscordNotification(`❌ **Action:** \`${action}\` project failed. Error: ${error.message}`);

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.message || error,
      }),
    };
  }
};
