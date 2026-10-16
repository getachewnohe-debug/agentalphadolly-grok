import { Octokit } from "@octokit/rest";
import { config } from "../config.js";

const octokit = new Octokit({ auth: config.githubToken });

export const githubTools = {
  async listIssues(state: "open" | "closed" | "all" = "open") {
    const { data } = await octokit.issues.listForRepo({
      owner: config.githubOwner,
      repo: config.githubRepo,
      state,
      per_page: 20,
    });
    return data.map((i) => ({
      number: i.number,
      title: i.title,
      state: i.state,
      labels: i.labels.map((l) => (typeof l === "string" ? l : l.name)),
      user: i.user?.login,
    }));
  },

  async createIssue(title: string, body: string, labels?: string[]) {
    const { data } = await octokit.issues.create({
      owner: config.githubOwner,
      repo: config.githubRepo,
      title,
      body,
      labels,
    });
    return { number: data.number, url: data.html_url };
  },

  async commentOnIssue(issueNumber: number, body: string) {
    const { data } = await octokit.issues.createComment({
      owner: config.githubOwner,
      repo: config.githubRepo,
      issue_number: issueNumber,
      body,
    });
    return { id: data.id, url: data.html_url };
  },

  async listPullRequests(state: "open" | "closed" | "all" = "open") {
    const { data } = await octokit.pulls.list({
      owner: config.githubOwner,
      repo: config.githubRepo,
      state,
      per_page: 10,
    });
    return data.map((pr) => ({
      number: pr.number,
      title: pr.title,
      state: pr.state,
      user: pr.user?.login,
      draft: pr.draft,
    }));
  },

  async getPullRequestDiff(prNumber: number) {
    const { data } = await octokit.pulls.get({
      owner: config.githubOwner,
      repo: config.githubRepo,
      pull_number: prNumber,
      mediaType: { format: "diff" },
    });
    return data as unknown as string;
  },

  async createPRComment(prNumber: number, body: string) {
    const { data } = await octokit.issues.createComment({
      owner: config.githubOwner,
      repo: config.githubRepo,
      issue_number: prNumber,
      body,
    });
    return { id: data.id, url: data.html_url };
  },
};
