import { TwitterApi, TweetV2TimelineResult, TweetV2SingleStreamResult } from 'twitter-api-v2';

export function makeTwitterClient() {
  const client = new TwitterApi({
    appKey: process.env.TWITTER_API_KEY!,
    appSecret: process.env.TWITTER_API_SECRET!,
    accessToken: process.env.TWITTER_ACCESS_TOKEN!,
    accessSecret: process.env.TWITTER_ACCESS_SECRET!,
  });
  return client.readWrite;
}

export async function fetchMentions(client: ReturnType<typeof makeTwitterClient>, sinceId?: string) {
  const userId = process.env.TWITTER_USER_ID!;
  // v2 mentions endpoint
  const params: any = {
    max_results: 50,
    "tweet.fields": ['public_metrics', 'created_at', 'author_id'],
  };
  if (sinceId) params.since_id = sinceId;

  const res = await client.v2.mentions(userId, params as any);
  return res as any; // keep shape flexible for caller
}

export async function replyToTweet(client: ReturnType<typeof makeTwitterClient>, text: string, inReplyToId: string) {
  return client.v2.reply(text, inReplyToId);
}
