import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

if (!webhookUrl) {
    console.warn("⚠️ DISCORD_WEBHOOK_URL is not defined in your environment variables.");
}

export async function sendDiscordNotification(content: string): Promise<void> {
    if (!webhookUrl) return;

    try {
        await axios.post(webhookUrl, {
            content
        });
        console.log("✅ Discord notification sent.");
    } catch (error) {
        console.error("❌ Failed to send Discord notification:", error);
    }
}
