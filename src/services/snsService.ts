import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";
import dotenv from "dotenv";

dotenv.config();

const snsClient = new SNSClient({ region: process.env.MY_REGION });

export const publishSNSMessage = async (SNS_TOPIC_ARN: string, message: object) => {
  if (!SNS_TOPIC_ARN) {
    console.error('SNS_TOPIC_ARN is not defined in the environment variables.');
    return;
  }
  
  const params = {
    TopicArn: SNS_TOPIC_ARN,
    Message: JSON.stringify(message),
  };

  try {
    const command = new PublishCommand(params);
    const result = await snsClient.send(command);
    console.log("SNS Message Published:", result.MessageId);
    return result;
  } catch (error) {
    console.error("Error publishing SNS message:", error);
    throw error;
  }
};
