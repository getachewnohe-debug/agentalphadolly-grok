import dotenv from 'dotenv';
dotenv.config();

import { TwitterApi } from 'twitter-api-v2';

async function main() {
  const client = new TwitterApi({
    appKey: process.env.TWITTER_API_KEY!,
    appSecret: process.env.TWITTER_API_SECRET!,
    accessToken: process.env.TWITTER_ACCESS_TOKEN!,
    accessSecret: process.env.TWITTER_ACCESS_SECRET!,
  });

  const me = await client.readWrite.v2.me();
  console.log('User ID:', me.data.id);
  console.log('Username:', me.data.username);
  console.log('Name:', me.data.name);

  const mentions = await client.readWrite.v2.mentions(me.data.id, {
    max_results: 5,
    'tweet.fields': ['created_at', 'author_id', 'public_metrics'],
  });

  console.log('\nLatest mentions:');
  for (const tweet of mentions.data || []) {
    console.log(`- ${tweet.id} by ${tweet.author_id}: ${tweet.text}`);
  }
}

main().catch((err) => {
  console.error('Failed to fetch X user info or mentions.', err);
  process.exit(1);
});
