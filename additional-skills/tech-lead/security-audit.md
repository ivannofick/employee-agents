# Skill: Security & Vulnerability Audit

## Metadata
- **Owner**: Garry (Tech Lead)
- **Slug**: security-audit
- **Purpose**: Defense-in-depth vulnerability auditing, OWASP Top 10 mitigation, and input sanitization guards.

## Operational Rules & Guidelines
1. **Never Trust User Input**: Validate and sanitize all incoming payloads with schema validators (Zod, Joi, Validator).
2. **SQL Injection Defense**: Strictly mandate parameterized queries and prepared statements. Never concatenate user strings into SQL.
3. **Secret Leak Prevention**: Enforce zero hardcoded secrets. Use environment variables with runtime presence verification on boot.
4. **CORS & CSRF**: Enforce restrictive CORS origins (no wildcard `*` with credentials) and SameSite cookie policies.

## Procedures
- Step 1: Scan authentication endpoints, API routes, and database access layers.
- Step 2: Audit dependencies for known vulnerabilities (`npm audit`, `cargo audit`, etc.).
- Step 3: Implement defense-in-depth middleware and sanitizers.
- Step 4: Document security sign-off report for Bos.
