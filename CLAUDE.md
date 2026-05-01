# Claude Code Instructions — ai-resume-tailor

## Git Workflow (ALWAYS follow this)

- **Never push directly to `main`**
- For every change — bug fix, feature, config update — always:
  1. Create a feature branch: `git checkout -b fix/<name>` or `feat/<name>`
  2. Commit the changes on that branch
  3. Push the branch: `git push -u origin <branch>`
  4. Raise a PR via `gh pr create` before merging
- Only merge after the PR is raised and confirmed by the user

## GitHub Actions

- The project uses GitHub Actions (`deploy.yaml`) for CI/CD to a kind Kubernetes cluster
- After raising a PR, always check if the GHA run passes before reporting done
- If GHA fails, investigate logs with `gh run view --log-failed` and fix before merging

## Project Stack

- **Backend**: FastAPI + Claude Opus 4.7 (Python, port 8000)
- **Frontend**: Next.js 14 + Tailwind CSS (port 3000, NodePort 30081 in K8s)
- **Deploy**: Kubernetes via Helm (`charts/ai-resume/`), local images with `imagePullPolicy: Never`
- **Secret**: `anthropic-secret` created outside Helm via `kubectl` — never put secrets in Helm templates

## Code Style

- No comments unless the WHY is non-obvious
- No unnecessary abstractions — keep it simple
- Backend image tag: `ai-resume-backend:local`
- Frontend image tag: `ai-resume-frontend:local`
