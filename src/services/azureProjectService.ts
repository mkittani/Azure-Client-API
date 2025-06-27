import axios from 'axios';
import { z } from 'zod';
import { getAzureApiToken } from './awsService';
import { AzureProjectCreateSchema } from '../schemas/azureProjectSchemas';
import dotenv from 'dotenv';

dotenv.config();

const AZURE_ORG_URL = process.env.AZURE_ORG_URL!;
const AZURE_API_VERSION = process.env.AZURE_API_VERSION!;

export type CreateAzureProject = z.infer<typeof AzureProjectCreateSchema>;

export const createAzureProject = async (projectData: CreateAzureProject) => {
  const validated = AzureProjectCreateSchema.safeParse(projectData);
  if (!validated.success) {
    throw new Error(`Validation error: ${JSON.stringify(validated.error.format())}`);
  }

  const tokens = await getAzureApiToken();
  const requestBody = {
    name: validated.data.name,
    description: validated.data.description || "",
    capabilities: {
      versioncontrol: { sourceControlType: "Git" },
      processTemplate: { templateTypeId: "adcc42ab-9882-485e-a3ed-7678f01f66bc" }
    },
    visibility: validated.data.visibility || "private"
  };

  const response = await axios.post(
    `${AZURE_ORG_URL}/_apis/projects?api-version=${AZURE_API_VERSION}`,
    requestBody,
    {
      headers: {
        "Authorization": `Basic ${Buffer.from(`:${tokens["Azure-API-token"]}`).toString('base64')}`,
        "Content-Type": "application/json",
      }
    }
  );

  return response.data;
};

export const listAzureProjects = async () => {
  const tokens = await getAzureApiToken();
  const response = await axios.get(
    `${AZURE_ORG_URL}/_apis/projects?api-version=${AZURE_API_VERSION}`,
    {
      headers: {
        "Authorization": `Basic ${Buffer.from(`:${tokens["Azure-API-token"]}`).toString('base64')}`,
        "Content-Type": "application/json",
      }
    }
  );
  return response.data.value;
};

export const getAzureProjectDetails = async (projectIdOrName: string) => {
  const tokens = await getAzureApiToken();
  try {
    const response = await axios.get(
      `${AZURE_ORG_URL}/_apis/projects/${projectIdOrName}?api-version=${AZURE_API_VERSION}`,
      {
        headers: {
          "Authorization": `Basic ${Buffer.from(`:${tokens["Azure-API-token"]}`).toString('base64')}`,
          "Content-Type": "application/json",
        }
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      throw new Error(`Project with ID or name "${projectIdOrName}" not found.`);
    }
    throw new Error(`Error fetching project details: ${error.message}`);
  }
};

export const deleteAzureProject = async (projectId: string) => {
  const tokens = await getAzureApiToken();
  const response = await axios.delete(
    `${AZURE_ORG_URL}/_apis/projects/${projectId}?api-version=${AZURE_API_VERSION}`,
    {
      headers: {
        "Authorization": `Basic ${Buffer.from(`:${tokens["Azure-API-token"]}`).toString('base64')}`,
        "Content-Type": "application/json",
      }
    }
  );
  return response.data;
};
