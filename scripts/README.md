# X bot debug helpers

This file prints your bot account info and its latest mentions so you can verify the app is connected correctly.

## Usage
1. Copy `.env.example` to `.env` and fill in all required X credentials.
2. Install TypeScript tooling if needed:
   ```bash
   npm install
   ```
3. Run the script:
   ```bash
   npx ts-node scripts/get-user-info.ts
   ```

This will print:
- numeric user ID (`TWITTER_USER_ID`)
- username
- latest 5 mentions

Use the returned user ID in your `.env` as `TWITTER_USER_ID`.
