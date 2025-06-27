import { z } from 'zod';

export const AzureWorkItemCreateSchema = z.object({
    title: z.string(),
    description: z.string().optional(),
    workItemType: z.string().min(1, "Type should not be empty"),
});


export const AzureWorkItemGetSchema = z.object({
  id: z.number(),
  rev: z.number(),
  fields: z.object({
    'System.AreaPath': z.string(),
    'System.TeamProject': z.string(),
    'System.IterationPath': z.string(),
    'System.WorkItemType': z.string(),
    'System.State': z.string(),
    'System.Reason': z.string(),
    'System.CreatedDate': z.string().datetime(),
    'System.CreatedBy': z.object({
      displayName: z.string(),
      uniqueName: z.string().email(),
    }),
    'System.ChangedDate': z.string().datetime(),
    'System.ChangedBy': z.object({
      displayName: z.string(),
      uniqueName: z.string().email(),
    }),
    'System.Title': z.string(),
    'Microsoft.VSTS.Common.ClosedDate': z.string().datetime().optional(),
    'Microsoft.VSTS.Common.ClosedBy': z.object({
    displayName: z.string(),
    uniqueName: z.string().email(),
    }).optional(),
    'Microsoft.VSTS.Common.Priority': z.number(),
    'System.Description': z.string().optional(),  
  }),
  _links: z.object({
    html: z.object({
      href: z.string().url(),
    }),
  }),
  url: z.string().url(),
});
