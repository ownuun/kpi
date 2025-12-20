import { z } from 'zod';

export const CompanySchema = z.object({
  name: z.string().min(1).max(255),
  domainUrl: z.string().url().optional().or(z.literal('')),
  employees: z.number().int().positive().optional(),
  linkedinUrl: z.string().url().optional().or(z.literal('')),
  twitterUrl: z.string().url().optional().or(z.literal('')),
  city: z.string().optional(),
  industry: z.string().optional(),
  annualRevenue: z.number().positive().optional(),
  isIdealCustomer: z.boolean().default(false),
  position: z.number().int().default(0),
});

export const CompanyUpdateSchema = CompanySchema.partial();

export const CompanyQuerySchema = z.object({
  search: z.string().optional(),
  industry: z.string().optional(),
  isIdealCustomer: z.boolean().optional(),
  minEmployees: z.number().int().positive().optional(),
  maxEmployees: z.number().int().positive().optional(),
  limit: z.number().int().positive().max(100).default(20),
  offset: z.number().int().nonnegative().default(0),
});

export type CompanyInput = z.infer<typeof CompanySchema>;
export type CompanyUpdateInput = z.infer<typeof CompanyUpdateSchema>;
export type CompanyQuery = z.infer<typeof CompanyQuerySchema>;
