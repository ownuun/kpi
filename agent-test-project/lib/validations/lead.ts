// Lead validation schema based on Twenty CRM's Person entity
// Reference: Twenty CRM uses class-validator, we use Zod

import { z } from 'zod'

export const leadFormSchema = z.object({
  // Required fields
  firstName: z.string().min(1, 'First name is required').max(100),
  lastName: z.string().min(1, 'Last name is required').max(100),
  email: z.string().email('Invalid email address'),

  // Optional contact info
  phone: z.string().optional(),
  countryCode: z.string().optional(),

  // Professional info
  jobTitle: z.string().max(200).optional(),
  company: z.string().max(200).optional(),
  city: z.string().max(100).optional(),

  // Social links
  linkedinUrl: z.string().url('Invalid LinkedIn URL').optional().or(z.literal('')),
  twitterUrl: z.string().url('Invalid Twitter URL').optional().or(z.literal('')),

  // Additional info
  intro: z.string().max(1000).optional(),
  source: z.string().max(100).optional(),
})

export type LeadFormData = z.infer<typeof leadFormSchema>
