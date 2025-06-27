import {GetSecretValueCommand, SecretsManagerClient } from "@aws-sdk/client-secrets-manager";
import dotenv from "dotenv";

dotenv.config();


const REGION = process.env.MY_REGION;
const SECRET_NAME = process.env.AZURE_SECRET_NAME;

if(!REGION || !SECRET_NAME){
    console.error(`Check your REGION and SECRET_NAME in .env file to be valid`);
    process.exit(1);
}

const secretsClient = new SecretsManagerClient({region: REGION});


export const getAzureApiToken = async(): Promise <Record<string, string>> =>{
    try{
        const command = new GetSecretValueCommand({
            SecretId: SECRET_NAME,
        });
        const reponse = await secretsClient.send(command);

        if(reponse.SecretString){
            return JSON.parse(reponse.SecretString);
        } else{
            throw new Error("SecretString is empty or missing.");
        }
    } catch(error){
        throw new Error("Failed to retrieve Azure API token.");
    }
};

