import { z } from 'zod'

export const utmFormSchema = z.object({
  baseUrl: z.string().url('Invalid base URL'),
  source: z.string().min(1, 'UTM source is required'),
  medium: z.string().min(1, 'UTM medium is required'),
  campaign: z.string().min(1, 'Campaign name is required'),
  term: z.string().optional(),
  content: z.string().optional(),
  businessLine: z.string().optional(),
})

export type UtmFormData = z.infer<typeof utmFormSchema>

// Predefined options for dropdowns
export const UTM_SOURCES = [
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'twitter', label: 'Twitter/X' },
  { value: 'google', label: 'Google Ads' },
  { value: 'email', label: 'Email' },
  { value: 'website', label: 'Website' },
  { value: 'referral', label: 'Referral' },
  { value: 'direct', label: 'Direct' },
  { value: 'organic', label: 'Organic Search' },
  { value: 'paid_search', label: 'Paid Search' },
  { value: 'display', label: 'Display Ads' },
  { value: 'affiliate', label: 'Affiliate' },
  { value: 'partner', label: 'Partner' },
  { value: 'event', label: 'Event' },
  { value: 'newsletter', label: 'Newsletter' },
]

export const UTM_MEDIUMS = [
  { value: 'social', label: 'Social Media' },
  { value: 'email', label: 'Email' },
  { value: 'cpc', label: 'Cost Per Click (CPC)' },
  { value: 'organic', label: 'Organic' },
  { value: 'paid', label: 'Paid' },
  { value: 'referral', label: 'Referral' },
  { value: 'display', label: 'Display' },
  { value: 'video', label: 'Video' },
  { value: 'affiliate', label: 'Affiliate' },
  { value: 'native', label: 'Native Ads' },
  { value: 'podcast', label: 'Podcast' },
  { value: 'webinar', label: 'Webinar' },
  { value: 'event', label: 'Event' },
]

export const CAMPAIGN_TYPES = [
  { value: 'spring_sale', label: 'Spring Sale' },
  { value: 'summer_promotion', label: 'Summer Promotion' },
  { value: 'product_launch', label: 'Product Launch' },
  { value: 'holiday_campaign', label: 'Holiday Campaign' },
  { value: 'webinar', label: 'Webinar' },
  { value: 'event', label: 'Event' },
  { value: 'awareness', label: 'Brand Awareness' },
  { value: 'lead_generation', label: 'Lead Generation' },
  { value: 'retargeting', label: 'Retargeting' },
  { value: 'app_install', label: 'App Install' },
]
