import {z} from 'zod';

const formatErrorObject = (error: z.ZodError) => {
   return error.issues.reduce((acc: Record<string, string>, issue: z.core.$ZodIssueBase) => {
     const field = String(issue.path[0]);
     acc[field] = issue.message;
     return acc;
   }, {});
};

export { formatErrorObject };