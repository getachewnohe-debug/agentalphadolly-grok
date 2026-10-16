import "dotenv/config";

export const config = {
  xaiApiKey: process.env.XAI_API_KEY || "",
  githubToken: process.env.GITHUB_TOKEN || "",
  githubOwner: process.env.GITHUB_OWNER || "getachewnohe-debug",
  githubRepo: process.env.GITHUB_REPO || "Agent-alpha-dolly",
  model: process.env.XAI_MODEL || "grok-3",
  // xAI OpenAI-compatible endpoint
  baseURL: "https://api.x.ai/v1",
};

if (!config.xaiApiKey) {
  console.warn("⚠️  XAI_API_KEY is not set");
}
if (!config.githubToken) {
  console.warn("⚠️  GITHUB_TOKEN is not set");
}
