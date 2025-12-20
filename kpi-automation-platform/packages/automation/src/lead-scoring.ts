/**
 * CRM Lead Scoring Automation
 */

export interface Lead {
  id: string
  email: string
  firstName?: string
  lastName?: string
  company?: string
  jobTitle?: string
  industry?: string
  companySize?: string
  score: number
  grade: 'A' | 'B' | 'C' | 'D' | 'F'
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost'
  source?: string
  lastEngaged?: Date
  createdAt: Date
  updatedAt: Date
  scoringHistory: ScoringEvent[]
}

export interface ScoringEvent {
  timestamp: Date
  action: string
  points: number
  previousScore: number
  newScore: number
  reason: string
}

export interface ScoringRule {
  id: string
  name: string
  description: string
  condition: (lead: Lead, context?: any) => boolean
  points: number
  enabled: boolean
}

/**
 * Lead Scoring Engine
 */
export class LeadScoringEngine {
  private rules: Map<string, ScoringRule> = new Map()

  /**
   * Register a scoring rule
   */
  registerRule(rule: ScoringRule): void {
    this.rules.set(rule.id, rule)
    console.log(`✅ Scoring rule registered: ${rule.name} (${rule.points > 0 ? '+' : ''}${rule.points} points)`)
  }

  /**
   * Calculate lead score based on all rules
   */
  calculateScore(lead: Lead, context?: any): number {
    const previousScore = lead.score

    for (const rule of this.rules.values()) {
      if (rule.enabled && rule.condition(lead, context)) {
        const event: ScoringEvent = {
          timestamp: new Date(),
          action: rule.id,
          points: rule.points,
          previousScore: lead.score,
          newScore: lead.score + rule.points,
          reason: rule.description
        }

        lead.score += rule.points
        lead.scoringHistory.push(event)

        console.log(`📊 Score updated for ${lead.email}: ${event.previousScore} → ${event.newScore} (${rule.name})`)
      }
    }

    // Ensure score stays within 0-100 range
    lead.score = Math.max(0, Math.min(100, lead.score))

    // Update grade
    lead.grade = this.calculateGrade(lead.score)

    // Update timestamp
    lead.updatedAt = new Date()

    return lead.score
  }

  /**
   * Apply a specific rule
   */
  applyRule(lead: Lead, ruleId: string, context?: any): boolean {
    const rule = this.rules.get(ruleId)
    if (!rule || !rule.enabled) {
      return false
    }

    if (rule.condition(lead, context)) {
      const event: ScoringEvent = {
        timestamp: new Date(),
        action: ruleId,
        points: rule.points,
        previousScore: lead.score,
        newScore: lead.score + rule.points,
        reason: rule.description
      }

      lead.score += rule.points
      lead.score = Math.max(0, Math.min(100, lead.score))
      lead.grade = this.calculateGrade(lead.score)
      lead.scoringHistory.push(event)
      lead.updatedAt = new Date()

      console.log(`📊 Score updated for ${lead.email}: ${event.previousScore} → ${event.newScore} (${rule.name})`)
      return true
    }

    return false
  }

  /**
   * Calculate grade based on score
   */
  private calculateGrade(score: number): 'A' | 'B' | 'C' | 'D' | 'F' {
    if (score >= 80) return 'A'
    if (score >= 60) return 'B'
    if (score >= 40) return 'C'
    if (score >= 20) return 'D'
    return 'F'
  }

  /**
   * Get hot leads (A grade)
   */
  getHotLeads(leads: Lead[]): Lead[] {
    return leads.filter(lead => lead.grade === 'A')
  }

  /**
   * Get warm leads (B or C grade)
   */
  getWarmLeads(leads: Lead[]): Lead[] {
    return leads.filter(lead => lead.grade === 'B' || lead.grade === 'C')
  }

  /**
   * Get cold leads (D or F grade)
   */
  getColdLeads(leads: Lead[]): Lead[] {
    return leads.filter(lead => lead.grade === 'D' || lead.grade === 'F')
  }

  /**
   * Get all rules
   */
  getRules(): ScoringRule[] {
    return Array.from(this.rules.values())
  }
}

export const leadScoringEngine = new LeadScoringEngine()

/**
 * Register default scoring rules
 */
export function registerDefaultScoringRules(): void {
  // Demographic scoring rules
  leadScoringEngine.registerRule({
    id: 'company_size_enterprise',
    name: '대기업',
    description: '직원 1000명 이상 기업',
    condition: (lead) => {
      const size = lead.companySize?.toLowerCase()
      return size === 'enterprise' || size === '1000+' || size === 'large'
    },
    points: 15,
    enabled: true
  })

  leadScoringEngine.registerRule({
    id: 'company_size_medium',
    name: '중견기업',
    description: '직원 100-999명 기업',
    condition: (lead) => {
      const size = lead.companySize?.toLowerCase()
      return size === 'medium' || size === '100-999'
    },
    points: 10,
    enabled: true
  })

  leadScoringEngine.registerRule({
    id: 'decision_maker',
    name: '의사결정자',
    description: 'CEO, CTO, VP 등 임원급',
    condition: (lead) => {
      const title = lead.jobTitle?.toLowerCase() || ''
      return title.includes('ceo') || title.includes('cto') || title.includes('cfo') ||
             title.includes('vp') || title.includes('director') || title.includes('대표') ||
             title.includes('임원') || title.includes('이사')
    },
    points: 20,
    enabled: true
  })

  leadScoringEngine.registerRule({
    id: 'manager_level',
    name: '관리자급',
    description: 'Manager, Lead 등',
    condition: (lead) => {
      const title = lead.jobTitle?.toLowerCase() || ''
      return title.includes('manager') || title.includes('lead') || title.includes('팀장')
    },
    points: 10,
    enabled: true
  })

  // Behavioral scoring rules
  leadScoringEngine.registerRule({
    id: 'email_opened',
    name: '이메일 열람',
    description: '마케팅 이메일을 열람함',
    condition: (lead, context) => {
      return context?.action === 'email_opened'
    },
    points: 5,
    enabled: true
  })

  leadScoringEngine.registerRule({
    id: 'email_clicked',
    name: '이메일 클릭',
    description: '이메일 내 링크를 클릭함',
    condition: (lead, context) => {
      return context?.action === 'email_clicked'
    },
    points: 10,
    enabled: true
  })

  leadScoringEngine.registerRule({
    id: 'form_submitted',
    name: '폼 제출',
    description: '문의 또는 데모 요청 폼 제출',
    condition: (lead, context) => {
      return context?.action === 'form_submitted'
    },
    points: 15,
    enabled: true
  })

  leadScoringEngine.registerRule({
    id: 'pricing_page_visited',
    name: '가격 페이지 방문',
    description: '가격 정보 페이지를 방문함',
    condition: (lead, context) => {
      return context?.action === 'page_visited' && context?.page?.includes('pricing')
    },
    points: 15,
    enabled: true
  })

  leadScoringEngine.registerRule({
    id: 'demo_requested',
    name: '데모 요청',
    description: '제품 데모를 요청함',
    condition: (lead, context) => {
      return context?.action === 'demo_requested'
    },
    points: 25,
    enabled: true
  })

  leadScoringEngine.registerRule({
    id: 'meeting_scheduled',
    name: '미팅 예약',
    description: '영업 미팅을 예약함',
    condition: (lead, context) => {
      return context?.action === 'meeting_scheduled'
    },
    points: 30,
    enabled: true
  })

  // Engagement frequency
  leadScoringEngine.registerRule({
    id: 'recent_engagement',
    name: '최근 활동',
    description: '최근 7일 이내 활동',
    condition: (lead) => {
      if (!lead.lastEngaged) return false
      const daysSinceEngagement = (Date.now() - lead.lastEngaged.getTime()) / (1000 * 60 * 60 * 24)
      return daysSinceEngagement <= 7
    },
    points: 10,
    enabled: true
  })

  // Negative scoring rules
  leadScoringEngine.registerRule({
    id: 'unsubscribed',
    name: '구독 취소',
    description: '이메일 구독을 취소함',
    condition: (lead, context) => {
      return context?.action === 'unsubscribed'
    },
    points: -20,
    enabled: true
  })

  leadScoringEngine.registerRule({
    id: 'spam_complaint',
    name: '스팸 신고',
    description: '이메일을 스팸으로 신고함',
    condition: (lead, context) => {
      return context?.action === 'spam_complaint'
    },
    points: -50,
    enabled: true
  })

  leadScoringEngine.registerRule({
    id: 'long_inactive',
    name: '장기 미활동',
    description: '90일 이상 활동 없음',
    condition: (lead) => {
      if (!lead.lastEngaged) return true
      const daysSinceEngagement = (Date.now() - lead.lastEngaged.getTime()) / (1000 * 60 * 60 * 24)
      return daysSinceEngagement > 90
    },
    points: -15,
    enabled: true
  })

  console.log('✅ Default lead scoring rules registered')
}

/**
 * Create a new lead with initial scoring
 */
export function createLead(data: {
  email: string
  firstName?: string
  lastName?: string
  company?: string
  jobTitle?: string
  industry?: string
  companySize?: string
  source?: string
}): Lead {
  const lead: Lead = {
    id: `lead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    ...data,
    score: 50, // Start with base score
    grade: 'C',
    status: 'new',
    createdAt: new Date(),
    updatedAt: new Date(),
    scoringHistory: []
  }

  // Apply initial demographic scoring
  leadScoringEngine.calculateScore(lead)

  return lead
}
