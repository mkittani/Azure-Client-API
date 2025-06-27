import axios from 'axios';
import { z } from 'zod';
import { getAzureApiToken } from './awsService';
import { AzureWorkItemGetSchema, AzureWorkItemCreateSchema } from '../schemas/azureWorkItemSchemas';
import { publishSNSMessage } from './snsService';
import dotenv from 'dotenv';

dotenv.config();

const AZURE_ORG_URL = process.env.AZURE_ORG_URL!;
const AZURE_PROJECT = process.env.AZURE_PROJECT!;
const AZURE_API_VERSION = process.env.AZURE_API_VERSION!;

export type GetAzureWorkItem = z.infer<typeof AzureWorkItemGetSchema>;
export type CreateAzureWorkItem = z.infer<typeof AzureWorkItemCreateSchema>;


export const getAzureWorkItem = async (id: number): Promise<GetAzureWorkItem> => {
    try {
        const tokens = await getAzureApiToken();
        const endpoint = `${AZURE_ORG_URL}/_apis/wit/workitems/${id}?api-version=${AZURE_API_VERSION}`;

        console.log("Fetching Work Item from:", endpoint);

        const response = await axios.get(endpoint, {
            headers: {
                "Authorization": `Basic ${Buffer.from(`:${tokens["Azure-API-token"]}`).toString('base64')}`,
                "Content-Type": "application/json"
            },
        });

        const parsed = AzureWorkItemGetSchema.safeParse(response.data);
        if (!parsed.success) {
            console.error("Validation error:", parsed.error.format());
            throw new Error("Invalid response from Azure API.");
        }


        return parsed.data;

    } catch (error: any) {
        throw new Error(`Failed to fetch work item: ${error}`);
    }
};

export const createAzureWorkItem = async ({
    title,
    description,
    workItemType,
}: z.infer<typeof AzureWorkItemCreateSchema>): Promise<CreateAzureWorkItem> => {
    const validated = AzureWorkItemCreateSchema.safeParse({ title, description, workItemType });

    if (!validated.success) {
        console.error("Validation error:", validated.error.format());
        throw new Error("Invalid request data.");
    }

    try {
        const tokens = await getAzureApiToken();
        const endpoint = `${AZURE_ORG_URL}/${AZURE_PROJECT}/_apis/wit/workitems/$${workItemType}?api-version=${AZURE_API_VERSION}`;

        const requestBody = [
            { op: "add",
             path: "/fields/System.Title",
              value: title 
            },
            { op: "add",
             path: "/fields/System.Description",
              value: description || "No description provided" 
            },
        ];

        const response = await axios.post(endpoint, requestBody, {
            headers: {
                "Authorization": `Basic ${Buffer.from(`:${tokens["Azure-API-token"]}`).toString('base64')}`,
                "Content-Type": "application/json-patch+json",
            },
        });


        return response.data;
    } catch (error: any) {
        throw new Error(`Failed to create work item in Azure: ${error}`);
    }
};

export const updateAzureWorkItem = async (id: number, updates: { title?: string; description?: string }) => {
    const tokens = await getAzureApiToken();
    const endpoint = `${AZURE_ORG_URL}/${AZURE_PROJECT}/_apis/wit/workitems/${id}?api-version=${AZURE_API_VERSION}`;
    const requestBody: { op: string; path: string; value: string }[] = [];

    if (updates.title) {
        requestBody.push({ op: "add", path: "/fields/System.Title", value: updates.title });
    }
    if (updates.description) {
        requestBody.push({ op: "add", path: "/fields/System.Description", value: updates.description });
    }
    if (requestBody.length === 0) {
        throw new Error("No valid update fields provided.");
    }

    try {
        const response = await axios.patch(endpoint, requestBody, {
            headers: {
                "Authorization": `Basic ${Buffer.from(`:${tokens["Azure-API-token"]}`).toString('base64')}`,
                "Content-Type": "application/json-patch+json",
            },
        });


        return response.data;
    } catch (error: any) {
        throw new Error(`Failed to update work item: ${error}`);
    }
};

export const listAzureWorkItems = async (ids: number[]) => {
    if (!Array.isArray(ids) || ids.length === 0) {
        throw new Error("You must provide an array of work item IDs.");
    }

    const tokens = await getAzureApiToken();
    const endpoint = `${AZURE_ORG_URL}/${AZURE_PROJECT}/_apis/wit/workitems?ids=${ids.join(",")}&api-version=${AZURE_API_VERSION}`;

    try {
        const response = await axios.get(endpoint, {
            headers: {
                "Authorization": `Basic ${Buffer.from(`:${tokens["Azure-API-token"]}`).toString('base64')}`,
                "Content-Type": "application/json",
            },
        });


        return response.data.value;
    } catch (error: any) {
        throw new Error(`Failed to list work items: ${error}`);
    }
};

export const deleteAzureWorkItem = async (id: number) => {
    const tokens = await getAzureApiToken();
    const endpoint = `${AZURE_ORG_URL}/${AZURE_PROJECT}/_apis/wit/workitems/${id}?api-version=${AZURE_API_VERSION}`;

    console.log("Deleting Work Item at:", endpoint);

    try {
        const response = await axios.delete(endpoint, {
            headers: {
                "Authorization": `Basic ${Buffer.from(`:${tokens["Azure-API-token"]}`).toString('base64')}`,
                "Content-Type": "application/json",
            },
        });


        console.log(`Successfully deleted Work Item ${id}`);
        return response.data;
    } catch (error: any) {

        console.error("Error deleting Azure Work Item:", error.response?.data || error.message);
        throw new Error(`Failed to delete Work Item ${id}: ${error}`);
    }
};