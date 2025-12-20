# UTM Link Generator - Quick Start Guide

## 30-Second Setup

### 1. Install Dependencies
```bash
cd apps/web-dashboard
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

### 3. Open in Browser
Visit: `http://localhost:3000/tools/utm-builder`

---

## Using the UTM Builder

### Step 1: Enter Base URL
```
Input: https://yoursite.com/page
```

### Step 2: Select UTM Source
```
Dropdown options: LinkedIn, Facebook, Google Ads, Email, etc.
Type to search: "lin" → shows LinkedIn
```

### Step 3: Select UTM Medium
```
Dropdown options: Social, Email, CPC, Organic, etc.
Type to search: "soc" → shows Social Media
```

### Step 4: Enter Campaign Name
```
Dropdown options: Spring Sale, Product Launch, etc.
Or type custom: "black_friday_2024"
```

### Step 5: (Optional) Add Keyword & Content
```
Term: "marketing automation" (for paid search)
Content: "banner_top" (for ad variant tracking)
```

### Step 6: Copy or Share
```
Click "Copy URL" to clipboard
Or click "Generate QR Code" to create scannable QR
```

---

## Generated URL Example

**Input**:
- Base URL: `https://example.com`
- Source: `linkedin`
- Medium: `social`
- Campaign: `spring_sale`
- Term: `marketing`
- Content: `banner_top`

**Output**:
```
https://example.com?utm_source=linkedin&utm_medium=social&utm_campaign=spring_sale&utm_term=marketing&utm_content=banner_top
```

---

## Features at a Glance

### Main Features
- **Real-time URL Generation**: See your link update as you type
- **Copy to Clipboard**: One-click copy with visual feedback
- **QR Code Generator**: Create downloadable QR codes
- **History Tracking**: Auto-saves last 20 URLs to browser
- **Export to CSV**: Download your URL history

### Advanced Features
- **Platform Integration**: Select which platform/business line
- **Parameter Validation**: Ensures correct UTM format
- **URL Length Check**: Warns if link exceeds 2000 characters
- **Test Link Button**: Open generated link in new tab
- **Error Messages**: Helpful validation feedback

---

## File Structure

```
app/tools/utm-builder/
└── page.tsx                    # Main page (server component)

components/utm/
├── UtmBuilder.tsx              # Form component
├── UtmPreview.tsx              # URL preview
├── UtmHistory.tsx              # History sidebar
└── QrCodeGenerator.tsx         # QR code generation

lib/validations/
└── utm.ts                      # Zod validation & options

app/api/utm/
├── generate/route.ts           # Generate UTM API
└── track/route.ts              # Track visits API
```

---

## Common Use Cases

### Case 1: LinkedIn Social Campaign
```
Source: linkedin
Medium: social
Campaign: spring_sale
Term: (leave empty)
Content: company_page_post
```

### Case 2: Google Ads Campaign
```
Source: google
Medium: cpc
Campaign: product_launch
Term: marketing automation (your search term)
Content: ad_copy_v1
```

### Case 3: Email Newsletter
```
Source: email
Medium: email
Campaign: monthly_newsletter
Term: (leave empty)
Content: footer_link
```

### Case 4: Facebook Ad
```
Source: facebook
Medium: social
Campaign: summer_promotion
Term: (leave empty)
Content: carousel_ad_slide_3
```

---

## Database Integration

### Automatic Saving
- When users visit your UTM links, the parameters are captured
- Data saved to `LandingVisit` table in Prisma
- Includes: timestamp, utm_source, utm_medium, utm_campaign, etc.

### Viewing Saved Data
```
API Endpoint: GET /api/utm/track
Query: /api/utm/track?campaign=spring_sale&source=linkedin
Returns: All visits matching the filter
```

---

## Keyboard Shortcuts

- **Tab**: Move between fields
- **Enter**: Submit or select from dropdown
- **Escape**: Close dropdown
- **Ctrl+C / Cmd+C**: Copy (after clicking Copy button)

---

## Troubleshooting

### "URL must be valid"
- Check: URL starts with `https://` or `http://`
- Fix: Enter complete URL like `https://example.com`

### "QR Code not generating"
- Solution: Refresh page
- If persists: Check browser console for errors

### "History not saving"
- Check: localStorage enabled in browser
- Check: Browser not in private/incognito mode
- Fix: Clear browser cache and try again

### "API returns 400 error"
- Verify: All required fields filled
- Verify: URL format is correct
- Check: Browser console for validation errors

---

## Best Practices

### DO
- Use lowercase with underscores: `spring_sale` ✓
- Keep campaign names meaningful: `product_launch_2024` ✓
- Use consistent naming across campaigns ✓
- Test the link before sharing ✓
- Document your UTM scheme for team ✓

### DON'T
- Use spaces in parameters: `spring sale` ✗
- Use special characters: `spring@sale` ✗
- Make names too long: `super_long_campaign_name_2024_version_1_test` ✗
- Use inconsistent naming: sometimes `linkedin`, sometimes `linkedIn` ✗
- Include sensitive data: `utm_content=secret_password` ✗

---

## API Usage Examples

### Generate UTM Link (Programmatic)
```bash
curl -X POST http://localhost:3000/api/utm/generate \
  -H "Content-Type: application/json" \
  -d '{
    "baseUrl": "https://example.com",
    "source": "linkedin",
    "medium": "social",
    "campaign": "spring_sale",
    "term": "marketing",
    "content": "banner_top"
  }'
```

### Track UTM Visit
```bash
curl -X POST http://localhost:3000/api/utm/track \
  -H "Content-Type: application/json" \
  -d '{
    "pageUrl": "https://example.com",
    "utmSource": "linkedin",
    "utmMedium": "social",
    "utmCampaign": "spring_sale",
    "platformId": "platform_123"
  }'
```

### Get UTM Analytics
```bash
curl http://localhost:3000/api/utm/track?campaign=spring_sale&limit=100
```

---

## Next Steps

1. **Customize Options**: Edit `lib/validations/utm.ts` to add your own sources/campaigns
2. **Brand It**: Update colors/logos in components
3. **Team Training**: Share this guide with your marketing team
4. **Analytics**: Set up Google Analytics to track your UTM campaigns
5. **Automation**: Create workflows to generate bulk UTM links

---

## Resources

- [Google Analytics UTM Help](https://support.google.com/analytics/answer/1033173)
- [UTM Parameter Guide](https://en.wikipedia.org/wiki/UTM_parameters)
- [QR Code Best Practices](https://www.qr-code-generator.com/)

---

## Support

For detailed documentation, see:
- **Complete Guide**: `UTM_BUILDER_README.md`
- **Implementation Details**: `UTM_BUILDER_SUMMARY.md`

Need help? Check the troubleshooting section above!
