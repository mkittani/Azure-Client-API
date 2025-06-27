import { createAzureWorkItem, getAzureWorkItem, updateAzureWorkItem, deleteAzureWorkItem, listAzureWorkItems } from '../services/azureWorkItemService';
import { publishSNSMessage } from '../services/snsService';
import { sendDiscordNotification } from '../utils/discordNotifier'; 

export const handler = async (event: any) => {
    const action = event.action;
    const payload = event.payload;

    try {
        let result;

        switch (action) {
            case "create":
                result = await createAzureWorkItem(payload);
                break;
            case "get":
                const id = Number(payload.id);
                if (isNaN(id)) throw new Error("Invalid ID provided for get action.");
                result = await getAzureWorkItem(id);
                break;
            case "update":
                const updateId = Number(payload.id);
                if (isNaN(updateId)) throw new Error("Invalid ID provided for update action.");
                result = await updateAzureWorkItem(updateId, payload.updates);
                break;
            case "delete":
                const deleteId = Number(payload.id);
                if (isNaN(deleteId)) throw new Error("Invalid ID provided for delete action.");
                result = await deleteAzureWorkItem(deleteId);
                break;
            case "list":
                let ids: number[] = [];
                if (typeof payload.ids === 'string') {
                    ids = payload.ids.split(',').map((id: string) => Number(id.trim()));
                } else if (Array.isArray(payload.ids)) {
                    ids = payload.ids.map((id: any) => Number(id));
                } else {
                    throw new Error("Invalid format for ids. Must be a comma-separated string or array of numbers.");
                }
                result = await listAzureWorkItems(ids);
                break;
            default:
                throw new Error(`Unsupported action: ${action}`);
        }


        await sendDiscordNotification(`**Action:** ${action} work item completed successfully.`);

        return {
            statusCode: 200,
            body: JSON.stringify({ message: `${action} completed`, result })
        };
    } catch (error: any) {
        await publishSNSMessage(process.env.SNS_TOPIC_ARN!, { status: "Error", action, error: error.message });

        await sendDiscordNotification(`**Action:** ${action} failed. Error: ${error.message}`);

        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};
