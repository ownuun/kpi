---
name: open-source-research
description: Open source repository discovery, evaluation, and selection expertise.
---

# Open Source Research Skill

Expert knowledge in finding, evaluating, and selecting the best open source solutions for any feature request.

## Core Competencies

### 1. Search Strategies

#### GitHub Search
```bash
# By stars and recency
gh search repos "kpi dashboard" --sort stars --order desc --limit 20

# By language
gh search repos "analytics" --language typescript --stars ">1000"

# By topic tags
gh search repos --topic dashboard --topic analytics

# By license
gh search repos "crm" --license mit --license apache-2.0

# By activity
gh search repos "automation" --pushed ">2024-01-01"

# Advanced query
gh search repos "linkedin api client" \
  --language typescript \
  --stars ">500" \
  --license mit \
  --sort updated
```

#### npm/Package Registry Search
```bash
# Search npm
npm search linkedin --searchlimit 20 --json

# Check package quality
npm view linkedin-api

# Check downloads
npm view linkedin-api dist-tags downloads

# Alternative: use npms.io API
curl "https://api.npms.io/v2/search?q=linkedin+api"
```

#### Awesome Lists & Curated Collections
```bash
# Clone awesome lists
git clone https://github.com/sindresorhus/awesome awesome-main

# Search within
grep -r "dashboard" awesome-main/

# Specific awesome lists
curl https://raw.githubusercontent.com/awesome-selfhosted/awesome-selfhosted/master/README.md \
  | grep -i "analytics"
```

### 2. Quick Evaluation Criteria

```yaml
Minimum Requirements:
  stars: ">500" (or >100 for niche)
  license: [MIT, Apache-2.0, BSD]
  last_commit: "<12 months"
  has_readme: true
  is_archived: false

Quality Indicators:
  has_tests: true
  test_coverage: ">50%"
  has_ci: true
  has_docs: true
  active_maintainers: ">1"
  issue_response_time: "<7 days"
  typescript: preferred

Red Flags:
  license: [GPL, AGPL, Proprietary]
  last_commit: ">18 months"
  open_issues: ">500 unresolved"
  many_forks_few_stars: "possible abandoned"
  security_alerts: ">0 critical"
```

### 3. Comparison Matrix

```markdown
| Feature | Project A | Project B | Project C |
|---------|-----------|-----------|-----------|
| Stars | 15k ⭐⭐⭐ | 8k ⭐⭐ | 2k ⭐ |
| License | MIT ✅ | Apache ✅ | GPL ❌ |
| Updated | 2 days ✅ | 1 week ✅ | 6 months ❌ |
| TypeScript | Yes ✅ | Yes ✅ | No ❌ |
| Tests | 85% ✅ | 60% ⚠️ | None ❌ |
| Docs | Excellent ✅ | Good ⚠️ | Poor ❌ |
| Size | 500KB ⚠️ | 200KB ✅ | 1MB ❌ |
| Dependencies | 10 ✅ | 25 ⚠️ | 50 ❌ |

Recommendation: Project B (balanced, actively maintained, good quality)
```

### 4. License Understanding

```yaml
Permissive (✅ Safe to use):
  MIT:
    - ✅ Commercial use
    - ✅ Modification
    - ✅ Distribution
    - ⚠️ Include license notice

  Apache-2.0:
    - ✅ Same as MIT
    - ✅ Patent protection
    - ⚠️ State changes

  BSD (2-clause, 3-clause):
    - ✅ Similar to MIT
    - ⚠️ Include copyright notice

Copyleft (⚠️ Use with caution):
  MPL-2.0:
    - ⚠️ File-level copyleft
    - ✅ Can combine with proprietary
    - ⚠️ Modified files must be MPL

  LGPL:
    - ⚠️ Library copyleft
    - ✅ Can link dynamically
    - ❌ Avoid static linking

Strong Copyleft (❌ Avoid):
  GPL (v2, v3):
    - ❌ Entire project must be GPL
    - ❌ Cannot use in proprietary software

  AGPL:
    - ❌ Same as GPL
    - ❌ Network usage = distribution
    - ❌ SaaS must release source

No License:
  - ❌ All rights reserved
  - ❌ Cannot use legally
```

### 5. Integration Decision Tree

```
Feature Request Received
    │
    ├─→ Search for Open Source
    │       │
    │       ├─→ None found → Build from scratch
    │       │
    │       └─→ Found options
    │           │
    │           ├─→ Well-packaged library (Tremor, Recharts)
    │           │   └─→ DECISION: npm install (Full Integration)
    │           │
    │           ├─→ Large system with API (Twenty, n8n, Metabase)
    │           │   └─→ DECISION: Docker + API integration
    │           │
    │           ├─→ Good code, MIT, specific feature needed
    │           │   └─→ DECISION: Code extraction
    │           │
    │           └─→ GPL or poor quality
    │               └─→ DECISION: Skip, find alternative or build
```

## Research Process

### Phase 1: Discovery (15 minutes)

```bash
# Step 1: Broad search
gh search repos "[feature keywords]" --sort stars --limit 50

# Step 2: Filter by criteria
gh search repos "[keywords]" \
  --language typescript \
  --license mit \
  --license apache-2.0 \
  --stars ">1000" \
  --limit 20

# Step 3: Check npm/PyPI
npm search [keywords] --searchlimit 20

# Step 4: Awesome lists
curl https://raw.githubusercontent.com/topics/awesome/[topic]

# Result: 5-10 candidates
```

### Phase 2: Quick Eval (5 min per candidate)

```bash
# For each candidate:

# 1. Check basic stats
gh repo view [owner/repo] --json \
  stargazerCount,license,pushedAt,isArchived

# 2. Check recent activity
gh repo view [owner/repo] --json \
  issues,pullRequests,releases

# 3. Scan README
gh repo view [owner/repo] --web

# 4. Check dependencies (if npm)
npm view [package] dependencies peerDependencies

# Result: Top 3 candidates
```

### Phase 3: Deep Analysis (15 min per top candidate)

```bash
# Clone for inspection
mkdir -p clones/[topic]-research
git clone --depth 1 https://github.com/[owner/repo] \
  clones/[topic]-research/[repo]

cd clones/[topic]-research/[repo]

# Analyze structure
tree -L 3 -I 'node_modules|.git|dist'

# Check code quality
find src -name "*.ts" | xargs wc -l  # Size
grep -r "test" package.json           # Has tests?
cat .github/workflows/*.yml           # Has CI?

# Check dependencies
cat package.json | jq '.dependencies | length'

# Find relevant code
grep -r "[feature]" src --include="*.ts" -l

# Result: Detailed analysis of top 3
```

### Phase 4: Recommendation (10 minutes)

```markdown
# Recommendation Report

## Research Summary
- Keywords: "[keywords]"
- Repositories found: 50
- Evaluated: 10
- Deep analysis: 3
- Recommendation: 1

## Winner: [Project Name]

**Why:**
- ✅ Most stars (15k vs 8k, 2k)
- ✅ Best code quality (TypeScript, 85% test coverage)
- ✅ Active maintenance (last commit 2 days ago)
- ✅ Perfect license (MIT)
- ✅ Good documentation
- ✅ Minimal dependencies (10 vs 25, 50)

**Integration Strategy:**
- Approach: Code extraction
- Effort: 2-3 hours
- Value: High (would take 2 days to build)

**Next Steps:**
1. Open Source Scout: Clone and analyze structure
2. Code Miner: Extract [specific modules]
3. Integration Lead: Wrap in our API layer
```

## Common Scenarios

### Scenario 1: "Dashboard analytics"

```bash
# Search
gh search repos "react dashboard analytics" \
  --language typescript --stars ">1000"

# Top Results:
- Tremor (15k ⭐, MIT) - Dashboard components
- Recharts (23k ⭐, MIT) - Charting library
- Apache Superset (60k ⭐, Apache) - Full BI platform

# Decision:
- Tremor for dashboard components (npm install)
- Recharts for custom charts (npm install)
- Skip Superset (too heavy, Python-based)
```

### Scenario 2: "LinkedIn posting"

```bash
# Search
gh search repos "linkedin api posting" --stars ">500"

# Top Results:
- Postiz (8.5k ⭐, MIT) - Multi-platform posting
- linkedin-api-client (1k ⭐, MIT) - LinkedIn only
- Social Pilot (GPL) - Skip due to license

# Decision:
- Extract from Postiz (better quality, multi-platform bonus)
```

### Scenario 3: "Email campaigns"

```bash
# Search
gh search repos "email marketing automation" --stars ">1000"

# Top Results:
- Mautic (7k ⭐, GPL) - Full marketing automation
- Listmonk (14k ⭐, AGPL) - Newsletter
- Postal (14k ⭐, MIT) - Email delivery

# Decision:
- API integration with Mautic (run as separate service)
- GPL is okay because we use API, not code
```

## Tools & Commands Reference

```bash
# GitHub CLI (gh)
gh search repos <query> [flags]
gh repo view <owner/repo> [flags]
gh repo clone <owner/repo> [destination]

# npm
npm search <query>
npm view <package> [field]
npm info <package>

# Analysis
tree -L <depth> -I <ignore-patterns>
wc -l <files>              # Count lines
tokei                      # Code statistics
cloc .                     # Count lines of code

# License detection
licen-se .                 # Detect licenses
license-checker            # Check npm dependencies

# Security
npm audit
snyk test
```

## Best Practices

1. **Always check license first** - Save time by filtering early
2. **Stars aren't everything** - 5k active > 50k abandoned
3. **Read recent issues** - Understand pain points
4. **Check dependencies** - Avoid dependency hell
5. **Test extraction feasibility** - Clone before committing
6. **Document decisions** - Record why you chose X over Y
7. **Keep clones organized** - Tag with purpose and date
8. **Set up alerts** - Watch for breaking changes

## Anti-Patterns to Avoid

❌ **Don't:**
- Use GPL in commercial product without legal review
- Clone entire monorepos (use sparse-checkout)
- Ignore security alerts
- Pick based on stars alone
- Extract code without understanding it
- Forget to attribute (license violation)
- Use unmaintained projects (>2 years)

✅ **Do:**
- Prefer permissive licenses (MIT, Apache)
- Use shallow clones (--depth 1)
- Check for active forks if original abandoned
- Read the code before extracting
- Always include license attribution
- Consider long-term maintenance
- Contribute improvements back (good karma)

---

This skill turns you into an open source archaeologist - finding buried treasures! 🏛️
