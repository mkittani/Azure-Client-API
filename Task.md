
## **Azure Client API** (Node.js & TypeScript)  


### **Create a Serverless Azure Client API CLI using `axios` for GET/POST REST API operations.**  

### **Resources:**  
- [Azure DevOps REST API](https://learn.microsoft.com/en-us/rest/api/azure/devops/?view=azure-devops-rest-7.2)  
- [Azure Projects API](https://learn.microsoft.com/en-us/rest/api/azure/devops/core/projects?view=azure-devops-rest-7.2)  
- [Azure Work Items API](https://learn.microsoft.com/en-us/rest/api/azure/devops/wit/work-items?view=azure-devops-rest-7.2)  
- [Azure WIQL API](https://learn.microsoft.com/en-us/rest/api/azure/devops/wit/wiql?view=azure-devops-rest-7.2)  
- [Axios](https://axios-http.com/)  
- [AWS SDK v3](https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/welcome.html)  
- [Serverless Framework](https://www.serverless.com/framework/docs)  

---

## **Phase 1: TypeScript CLI API**  

### **Authorization:**  
- Retrieve the Azure API token from AWS SSM Parameter Store or Secrets Manager.  
- Use the stored keys for authorization when making requests.  
- Use `zod` for request and response validation.  

### **CLI Commands (Using Async Axios Calls):**  
1. **Azure Projects:**  
   - **Create** a new Azure project (requires project name).  
   - **List** all Azure projects for the authenticated user.  
   - **Get** detailed info about a project.  
   - **Delete** an Azure project.  

2. **Work Items:**  
   - **Create** work items (Task, Bug, etc.) for a project.  
   - **List** all work items in a project.  
   - **Update** a work item.  
   - **Delete** a work item.  
   - **Get** a work item.  
   - API Reference: [Work Item Types](https://learn.microsoft.com/en-us/rest/api/azure/devops/processes/work-item-types/list?view=azure-devops-rest-6.0&tabs=HTTP).  

3. **AWS SNS/SQS Integration:**  
   - Each CLI command should send structured messages to SNS or SQS.  

4. **Lambda Processing:**  
   - Operations like Create/Update/Delete/Copy/Move/Replace should be processed via AWS Lambda.
   - Get/List operations should return real-time responses.  

5. **Optional Operations:**  
   - Copy, move, or replace a work item.  

---

## **Phase 2: Dead Letter Queue (DLQ)**  
- Implement a Dead Letter Queue (DLQ) to store failed SNS/SQS messages for later analysis.  

---

## **Phase 3: Discord Webhook**  
- Send a notification to a Discord channel for every operation executed via the CLI.  


