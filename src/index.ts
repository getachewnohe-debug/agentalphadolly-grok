import dotenv from 'dotenv';
dotenv.config();

import { makeTwitterClient, fetchMentions, replyToTweet } from './twitter';
import { generateReply } from './llm';

const client = makeTwitterClient();
let sinceId: string | undefined = undefined;
const interval = (Number(process.env.POLL_INTERVAL_SECONDS) || 30) * 1000;
const prefix = process.env.BOT_REPLY_PREFIX || '';
const maxReplies = Number(process.env.MAX_REPLIES_PER_CYCLE || 5);

async function processMentions() {
  try {
    const mentions = await fetchMentions(client, sinceId);
    const tweets = mentions.data ?? [];
    if (tweets.length === 0) return;

    // Twitter API returns newest-first; process oldest-first to preserve order
    tweets.reverse();

    let replied = 0;
    for (const t of tweets) {
      if (replied >= maxReplies) break;
      // Skip if authored by the bot itself
      if (t.author_id === process.env.TWITTER_USER_ID) continue;

      const prompt = `You are a helpful assistant. A user mentioned the bot with this text:\n\n"${t.text}"\n\nWrite a short (1-2 sentence) friendly reply and optionally ask one clarifying question. Keep the reply safe and professional.`;
      const llmReply = await generateReply(prompt);
      const replyText = `${prefix} ${llmReply}`.trim();

      await replyToTweet(client, replyText, t.id);
      console.log('Replied to', t.id);
      sinceId = t.id;
      replied++;
    }
  } catch (err) {
    console.error('Error processing mentions', err);
  }
}

async function main() {
  console.log('Starting X mention-reply bot — polling every', interval / 1000, 'seconds');
  await processMentions();
  setInterval(processMentions, interval);
}

main().catch((e) => console.error(e));
