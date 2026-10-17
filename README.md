# AgentAlphaDolly X mention-reply bot

This branch adds a minimal TypeScript bot that polls X (Twitter) mentions and replies using an LLM backend.

Features
- Polls mentions for the configured bot user
- Uses an LLM (OpenAI by default) to generate concise replies
- Environment-driven configuration and safety limits

Setup (local)
1. Copy `.env.example` to `.env` and fill in your Twitter and LLM credentials.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run in dev mode:
   ```bash
   npm run dev
   ```

Notes
- Do NOT commit secrets. Use repository secrets for CI or deployment.
- Test with a non-production bot account first.
- For production, deploy to a process manager or serverless platform and store secrets securely.

Next steps
- Add webhook-based streaming instead of polling for lower latency.
- Add moderation/blacklist filtering and logging to a monitoring sink.
- Integrate GitHub webhooks to post release/PR notifications to X.
