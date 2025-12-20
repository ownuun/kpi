---
name: code-analyzer-skill
description: Code pattern detection and analysis patterns. Use for finding code patterns and generating documentation.
---

# Code Analyzer Skill

Expert patterns for code analysis and documentation.

## Search Patterns

### Find All API Routes
```bash
find app/api -name "route.ts"
```

### Find All Components
```bash
find components -name "*.tsx"
```

### Find Prisma Queries
```bash
grep -r "prisma\." --include="*.ts" --include="*.tsx"
```

## Analysis Pattern

1. **Search**: Find relevant files
2. **Read**: Examine representative examples
3. **Analyze**: Identify patterns
4. **Report**: Document findings with evidence

## Documentation Template

```markdown
## Pattern: [Name]

**Location**: [Where found]

**Structure**:
[Code template]

**Examples**:
- [File:line] - [Usage]

**Best Practices**:
- [Practice 1]
```
