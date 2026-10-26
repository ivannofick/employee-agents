# Skill: Docker Containerization

## Metadata
- **Owner**: Tn. Crab (Developer)
- **Slug**: docker-containerization
- **Purpose**: Clean, multi-stage Dockerfile and docker-compose setup without image bloat or memory waste.

## Operational Rules & Guidelines
1. **Multi-Stage Builds**: Always use multi-stage builds. Production images must only contain the compiled binary / runtime artifacts, never build tools or dev dependencies.
2. **Minimal Base Images**: Prefer alpine or distroless images (e.g. `node:22-alpine`, `golang:1.23-alpine`, `python:3.12-slim`).
3. **Non-Root Execution**: Never run application processes as `root`. Always create and switch to a dedicated user (e.g. `USER node` or `USER appuser`).
4. **Defensive `.dockerignore`**: Mandatory `.dockerignore` excluding `.git`, `node_modules`, `.env`, build artifacts, and test logs.
5. **No Slop**: Avoid excessive layers. Combine related `RUN` commands where appropriate.

## Procedures
- Step 1: Analyze project manifest (`package.json`, `go.mod`, `requirements.txt`).
- Step 2: Generate optimized, production-ready `Dockerfile`.
- Step 3: Create `docker-compose.yml` for local service orchestration with pinned port bindings and volume mounts.
- Step 4: Validate build size and report total image footprint to Bos.
