/**
 * Agent Alpha Dolly — Grok Agent with GitHub tools
 *
 * Uses xAI's OpenAI-compatible API (Grok) + Octokit for GitHub.
 */
import OpenAI from "openai";
import { config } from "./config.js";
import { githubTools } from "./tools/github.js";
import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

const client = new OpenAI({
  apiKey: config.xaiApiKey,
  baseURL: config.baseURL,
});

const SYSTEM_PROMPT = `You are Agent Alpha Dolly, a helpful Grok-powered assistant integrated with GitHub.
You can manage issues, review pull requests, and help with repository workflows for the Agent Alpha Dolly project.

Available tools:
- list_issues: List open/closed issues
- create_issue: Create a new issue
- comment_on_issue: Comment on an issue
- list_pull_requests: List PRs
- review_pr: Fetch a PR diff and give a code review (you will receive the diff)
- comment_on_pr: Post a comment on a PR

Be concise, professional, and action-oriented. When reviewing code, focus on bugs, security, and clarity.`;

const tools: OpenAI.Chat.Completions.ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "list_issues",
      description: "List issues in the configured GitHub repository",
      parameters: {
        type: "object",
        properties: {
          state: { type: "string", enum: ["open", "closed", "all"] },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "create_issue",
      description: "Create a new GitHub issue",
      parameters: {
        type: "object",
        properties: {
          title: { type: "string" },
          body: { type: "string" },
          labels: { type: "array", items: { type: "string" } },
        },
        required: ["title", "body"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "comment_on_issue",
      description: "Add a comment to an existing issue",
      parameters: {
        type: "object",
        properties: {
          issue_number: { type: "number" },
          body: { type: "string" },
        },
        required: ["issue_number", "body"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "list_pull_requests",
      description: "List pull requests",
      parameters: {
        type: "object",
        properties: {
          state: { type: "string", enum: ["open", "closed", "all"] },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "review_pr",
      description: "Fetch the diff of a pull request so you can review it",
      parameters: {
        type: "object",
        properties: {
          pr_number: { type: "number" },
        },
        required: ["pr_number"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "comment_on_pr",
      description: "Post a review comment on a pull request",
      parameters: {
        type: "object",
        properties: {
          pr_number: { type: "number" },
          body: { type: "string" },
        },
        required: ["pr_number", "body"],
      },
    },
  },
];

async function executeTool(name: string, args: Record<string, unknown>) {
  switch (name) {
    case "list_issues":
      return githubTools.listIssues((args.state as any) || "open");
    case "create_issue":
      return githubTools.createIssue(
        args.title as string,
        args.body as string,
        args.labels as string[] | undefined
      );
    case "comment_on_issue":
      return githubTools.commentOnIssue(
        args.issue_number as number,
        args.body as string
      );
    case "list_pull_requests":
      return githubTools.listPullRequests((args.state as any) || "open");
    case "review_pr":
      return { diff: await githubTools.getPullRequestDiff(args.pr_number as number) };
    case "comment_on_pr":
      return githubTools.createPRComment(
        args.pr_number as number,
        args.body as string
      );
    default:
      return { error: `Unknown tool: ${name}` };
  }
}

async function chat(messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[]) {
  const response = await client.chat.completions.create({
    model: config.model,
    messages,
    tools,
    tool_choice: "auto",
  });

  const msg = response.choices[0].message;

  if (msg.tool_calls && msg.tool_calls.length > 0) {
    messages.push(msg);
    for (const tc of msg.tool_calls) {
      const args = JSON.parse(tc.function.arguments || "{}");
      console.log(`🔧 Calling tool: ${tc.function.name}`, args);
      const result = await executeTool(tc.function.name, args);
      messages.push({
        role: "tool",
        tool_call_id: tc.id,
        content: JSON.stringify(result, null, 2),
      });
    }
    return chat(messages); // continue until no more tool calls
  }

  return msg.content || "";
}

async function main() {
  console.log("🤖 Agent Alpha Dolly (Grok) ready.");
  console.log(`   Repo: ${config.githubOwner}/${config.githubRepo}`);
  console.log("   Type your message (or 'exit' to quit)\n");

  const rl = readline.createInterface({ input, output });
  const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
    { role: "system", content: SYSTEM_PROMPT },
  ];

  while (true) {
    const userInput = await rl.question("You: ");
    if (userInput.trim().toLowerCase() === "exit") break;

    messages.push({ role: "user", content: userInput });
    const reply = await chat(messages);
    console.log(`\nDolly: ${reply}\n`);
    messages.push({ role: "assistant", content: reply });
  }

  rl.close();
}

main().catch(console.error);
