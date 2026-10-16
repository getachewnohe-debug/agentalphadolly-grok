# Agent Alpha Dolly — Grok Agent

**Grok-powered agent** with native GitHub integration for the Agent Alpha Dolly brand.

Built on [xAI Grok](https://x.ai) + GitHub API.

## Features

- 🤖 **Grok chat agent** — conversational interface powered by Grok
- 💻 **GitHub tools** — list issues, create issues, comment on PRs, review code, search repos
- 🔄 **Workflow automation** — triage issues, suggest labels, draft PR descriptions
- 🔒 **Secure** — uses environment variables for xAI + GitHub tokens

## Quick Start

### 1. Install

```bash
npm install
# or
pip install -r requirements.txt
```

### 2. Environment

Copy `.env.example` → `.env` and fill in:

```env
XAI_API_KEY=your_xai_api_key
GITHUB_TOKEN=your_github_pat_or_app_token
GITHUB_OWNER=getachewnohe-debug
GITHUB_REPO=Agent-alpha-dolly   # default target repo
```

### 3. Run the agent

```bash
npm run agent
# or
python agent.py
```

## Project Structure

```
agentalphadolly-grok/
├── src/
│   ├── agent.ts          # Main Grok agent loop
│   ├── tools/
│   │   ├── github.ts      # GitHub tool implementations
│   │   └── index.ts
│   └── config.ts
├── .env.example
├── package.json
└── README.md
```

## Related Repos

| Repo | Purpose |
|------|---------|
| [Agent-alpha-dolly](https://github.com/getachewnohe-debug/Agent-alpha-dolly) | Brand / core |
| [agentalphadolly-github-action](https://github.com/getachewnohe-debug/agentalphadolly-github-action) | Grok GitHub Action |
| [agentalphadollyslack-agent](https://github.com/getachewnohe-debug/agentalphadollyslack-agent) | Slack agent (private) |

## License

MIT
