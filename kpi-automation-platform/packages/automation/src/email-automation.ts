/**
 * Email Campaign Automation Service
 */

export interface EmailTemplate {
  id: string
  name: string
  subject: string
  body: string
  variables: string[] // e.g., ['name', 'company', 'custom_field']
}

export interface EmailCampaign {
  id: string
  name: string
  templateId: string
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'paused'
  recipients: EmailRecipient[]
  schedule?: Date
  fromEmail: string
  fromName: string
  replyTo?: string
  trackOpens: boolean
  trackClicks: boolean
  createdAt: Date
  sentAt?: Date
  stats?: CampaignStats
}

export interface EmailRecipient {
  email: string
  name?: string
  variables?: Record<string, string>
  status: 'pending' | 'sent' | 'opened' | 'clicked' | 'bounced' | 'failed'
  sentAt?: Date
  openedAt?: Date
  clickedAt?: Date
}

export interface CampaignStats {
  totalSent: number
  totalOpened: number
  totalClicked: number
  totalBounced: number
  totalFailed: number
  openRate: number
  clickRate: number
  bounceRate: number
}

export class EmailAutomation {
  private templates: Map<string, EmailTemplate> = new Map()
  private campaigns: Map<string, EmailCampaign> = new Map()

  /**
   * Register an email template
   */
  registerTemplate(template: EmailTemplate): void {
    this.templates.set(template.id, template)
    console.log(`✅ Email template registered: ${template.name}`)
  }

  /**
   * Create a new email campaign
   */
  createCampaign(
    name: string,
    templateId: string,
    recipients: Omit<EmailRecipient, 'status'>[],
    options: {
      fromEmail: string
      fromName: string
      replyTo?: string
      schedule?: Date
      trackOpens?: boolean
      trackClicks?: boolean
    }
  ): EmailCampaign {
    const template = this.templates.get(templateId)
    if (!template) {
      throw new Error(`Template not found: ${templateId}`)
    }

    const campaign: EmailCampaign = {
      id: `campaign_${Date.now()}`,
      name,
      templateId,
      status: options.schedule ? 'scheduled' : 'draft',
      recipients: recipients.map(r => ({ ...r, status: 'pending' })),
      schedule: options.schedule,
      fromEmail: options.fromEmail,
      fromName: options.fromName,
      replyTo: options.replyTo,
      trackOpens: options.trackOpens ?? true,
      trackClicks: options.trackClicks ?? true,
      createdAt: new Date()
    }

    this.campaigns.set(campaign.id, campaign)
    console.log(`✅ Campaign created: ${name} (${campaign.id})`)

    return campaign
  }

  /**
   * Send a campaign immediately or schedule it
   */
  async sendCampaign(campaignId: string): Promise<void> {
    const campaign = this.campaigns.get(campaignId)
    if (!campaign) {
      throw new Error(`Campaign not found: ${campaignId}`)
    }

    const template = this.templates.get(campaign.templateId)
    if (!template) {
      throw new Error(`Template not found: ${campaign.templateId}`)
    }

    campaign.status = 'sending'

    for (const recipient of campaign.recipients) {
      try {
        const emailContent = this.renderTemplate(template, recipient.variables || {})

        // Mock email sending (replace with actual email service: SendGrid, AWS SES, etc.)
        await this.sendEmail({
          to: recipient.email,
          from: `${campaign.fromName} <${campaign.fromEmail}>`,
          replyTo: campaign.replyTo,
          subject: emailContent.subject,
          html: emailContent.body,
          trackOpens: campaign.trackOpens,
          trackClicks: campaign.trackClicks
        })

        recipient.status = 'sent'
        recipient.sentAt = new Date()

        console.log(`📧 Email sent to ${recipient.email}`)
      } catch (error) {
        recipient.status = 'failed'
        console.error(`❌ Failed to send email to ${recipient.email}:`, error)
      }

      // Small delay to avoid rate limiting
      await this.delay(100)
    }

    campaign.status = 'sent'
    campaign.sentAt = new Date()
    campaign.stats = this.calculateStats(campaign)

    console.log(`✅ Campaign sent: ${campaign.name}`)
    console.log(`📊 Stats:`, campaign.stats)
  }

  /**
   * Track email open
   */
  trackOpen(campaignId: string, recipientEmail: string): void {
    const campaign = this.campaigns.get(campaignId)
    if (!campaign) return

    const recipient = campaign.recipients.find(r => r.email === recipientEmail)
    if (recipient && recipient.status === 'sent') {
      recipient.status = 'opened'
      recipient.openedAt = new Date()
      campaign.stats = this.calculateStats(campaign)
      console.log(`👁 Email opened: ${recipientEmail}`)
    }
  }

  /**
   * Track email click
   */
  trackClick(campaignId: string, recipientEmail: string): void {
    const campaign = this.campaigns.get(campaignId)
    if (!campaign) return

    const recipient = campaign.recipients.find(r => r.email === recipientEmail)
    if (recipient) {
      if (recipient.status === 'sent' || recipient.status === 'opened') {
        recipient.status = 'clicked'
        recipient.clickedAt = new Date()
        campaign.stats = this.calculateStats(campaign)
        console.log(`🖱 Email clicked: ${recipientEmail}`)
      }
    }
  }

  /**
   * Get campaign by ID
   */
  getCampaign(campaignId: string): EmailCampaign | undefined {
    return this.campaigns.get(campaignId)
  }

  /**
   * Get all campaigns
   */
  getAllCampaigns(): EmailCampaign[] {
    return Array.from(this.campaigns.values())
  }

  /**
   * Get template by ID
   */
  getTemplate(templateId: string): EmailTemplate | undefined {
    return this.templates.get(templateId)
  }

  /**
   * Get all templates
   */
  getAllTemplates(): EmailTemplate[] {
    return Array.from(this.templates.values())
  }

  /**
   * Render template with variables
   */
  private renderTemplate(template: EmailTemplate, variables: Record<string, string>): { subject: string; body: string } {
    let subject = template.subject
    let body = template.body

    // Replace {{variable}} with actual values
    for (const [key, value] of Object.entries(variables)) {
      const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g')
      subject = subject.replace(regex, value)
      body = body.replace(regex, value)
    }

    return { subject, body }
  }

  /**
   * Mock email sending (replace with actual service)
   */
  private async sendEmail(email: {
    to: string
    from: string
    replyTo?: string
    subject: string
    html: string
    trackOpens?: boolean
    trackClicks?: boolean
  }): Promise<void> {
    // In production, integrate with:
    // - SendGrid: await sgMail.send(email)
    // - AWS SES: await ses.sendEmail(...)
    // - Mailgun: await mailgun.messages.create(...)

    console.log(`📨 Sending email:`, {
      to: email.to,
      subject: email.subject,
      from: email.from
    })
  }

  /**
   * Calculate campaign statistics
   */
  private calculateStats(campaign: EmailCampaign): CampaignStats {
    const totalSent = campaign.recipients.filter(r =>
      ['sent', 'opened', 'clicked'].includes(r.status)
    ).length

    const totalOpened = campaign.recipients.filter(r =>
      ['opened', 'clicked'].includes(r.status)
    ).length

    const totalClicked = campaign.recipients.filter(r => r.status === 'clicked').length
    const totalBounced = campaign.recipients.filter(r => r.status === 'bounced').length
    const totalFailed = campaign.recipients.filter(r => r.status === 'failed').length

    return {
      totalSent,
      totalOpened,
      totalClicked,
      totalBounced,
      totalFailed,
      openRate: totalSent > 0 ? (totalOpened / totalSent) * 100 : 0,
      clickRate: totalSent > 0 ? (totalClicked / totalSent) * 100 : 0,
      bounceRate: totalSent > 0 ? (totalBounced / totalSent) * 100 : 0
    }
  }

  /**
   * Delay helper
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

export const emailAutomation = new EmailAutomation()

/**
 * Register default email templates
 */
export function registerDefaultEmailTemplates(): void {
  emailAutomation.registerTemplate({
    id: 'welcome',
    name: '환영 이메일',
    subject: '환영합니다, {{name}}님! KPI Platform에 오신 것을 환영합니다',
    body: `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #2563eb;">안녕하세요, {{name}}님!</h1>

            <p>KPI Automation Platform에 가입해주셔서 진심으로 감사합니다.</p>

            <p>우리 플랫폼을 통해 다음과 같은 혜택을 누리실 수 있습니다:</p>

            <ul>
              <li>SNS 멀티 플랫폼 자동 포스팅</li>
              <li>이메일 마케팅 자동화</li>
              <li>CRM 및 리드 관리</li>
              <li>실시간 분석 & 리포팅</li>
            </ul>

            <p>궁금한 점이 있으시면 언제든 문의해주세요.</p>

            <p style="margin-top: 30px;">
              <a href="https://platform.example.com/dashboard"
                 style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                대시보드 시작하기
              </a>
            </p>

            <p style="margin-top: 40px; color: #666; font-size: 12px;">
              KPI Automation Platform<br>
              {{company}}
            </p>
          </div>
        </body>
      </html>
    `,
    variables: ['name', 'company']
  })

  emailAutomation.registerTemplate({
    id: 'reengagement',
    name: '재참여 캠페인',
    subject: '{{name}}님, 혹시 저희를 잊으셨나요? 특별 혜택을 드립니다',
    body: `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #2563eb;">{{name}}님, 오랜만입니다!</h1>

            <p>최근에 저희 플랫폼을 사용하지 않으신 것 같아 연락드립니다.</p>

            <p>혹시 불편한 점이 있으셨나요? 아니면 바쁘신 일정 때문이신가요?</p>

            <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h2 style="color: #1f2937; margin-top: 0;">🎁 특별 혜택</h2>
              <p>돌아오신 고객님을 위한 특별 할인:</p>
              <ul>
                <li>프리미엄 플랜 30% 할인</li>
                <li>무료 1:1 컨설팅</li>
                <li>추가 사용자 계정 무료</li>
              </ul>
              <p style="color: #dc2626; font-weight: bold;">기간 한정: 7일</p>
            </div>

            <p style="margin-top: 30px;">
              <a href="https://platform.example.com/special-offer"
                 style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                특별 혜택 받기
              </a>
            </p>

            <p style="margin-top: 40px; color: #666; font-size: 12px;">
              더 이상 이메일을 받고 싶지 않으시면 <a href="#">구독 취소</a>를 클릭하세요.
            </p>
          </div>
        </body>
      </html>
    `,
    variables: ['name']
  })

  emailAutomation.registerTemplate({
    id: 'deal_won_congratulations',
    name: '거래 성사 축하',
    subject: '🎉 축하합니다, {{name}}님! 거래가 성사되었습니다',
    body: `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #10b981; font-size: 36px;">🎊 축하합니다! 🎊</h1>
            </div>

            <p>{{name}}님,</p>

            <p>거래가 성공적으로 성사되었습니다! 함께 일하게 되어 정말 기쁩니다.</p>

            <div style="background-color: #ecfdf5; padding: 20px; border-left: 4px solid #10b981; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #065f46;">다음 단계</h3>
              <ol>
                <li>온보딩 미팅 일정 잡기</li>
                <li>계정 설정 및 구성</li>
                <li>팀 교육 세션</li>
                <li>프로젝트 킥오프</li>
              </ol>
            </div>

            <p>우리 고객 성공 팀이 곧 연락드릴 예정입니다.</p>

            <p>궁금한 점이 있으시면 언제든 문의해주세요.</p>

            <p style="margin-top: 30px;">
              <a href="https://platform.example.com/onboarding"
                 style="background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                온보딩 시작하기
              </a>
            </p>

            <p style="margin-top: 40px;">
              감사합니다,<br>
              KPI Platform 팀
            </p>
          </div>
        </body>
      </html>
    `,
    variables: ['name']
  })

  console.log('✅ Default email templates registered')
}
