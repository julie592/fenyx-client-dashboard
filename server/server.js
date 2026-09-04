require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const cron = require('node-cron');
const { google } = require('googleapis');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const auth = new google.auth.GoogleAuth({
  keyFile: path.join(__dirname, 'credentials.json'),
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});
const sheets = google.sheets({ version: 'v4', auth });

// Platform Dataset Generator with 10 Channels
function generatePlatformRows(platform) {
  const headers = ['Date', 'Platform', 'Campaign / Ad Name', 'Spend ($)', 'Clicks', 'Purchases', 'CPA ($)'];
  const today = new Date().toISOString().split('T')[0];

  switch (platform) {
    case 'meta':
      return [
        headers,
        [today, 'Meta Ads', 'ATF_Meta_AdvantagePlus_US', 14200.00, 42100, 1050, 13.52],
        [today, 'Meta Ads', 'Ad_Creative_Video_UGC_01.mp4', 6800.00, 21000, 510, 13.33],
        [today, 'Meta Ads', 'Ad_Static_Carousels_Offer.jpg', 7400.00, 21100, 540, 13.70]
      ];
    case 'google':
      return [
        headers,
        [today, 'Google Ads', 'ATF_Google_Search_Brand_US', 12100.00, 38900, 980, 12.35],
        [today, 'Google Ads', 'Search_RSA_ExactMatch_Brand', 12100.00, 38900, 980, 12.35]
      ];
    case 'tiktok':
      return [
        headers,
        [today, 'TikTok Ads', 'ATF_TikTok_Spark_GenZ', 8900.00, 28400, 540, 16.48],
        [today, 'TikTok Ads', 'TikTok_Spark_InfluencerHook_A', 8900.00, 28400, 540, 16.48]
      ];
    case 'taboola':
      return [
        headers,
        [today, 'Taboola Native', 'ATF_Taboola_ContentFeed_US', 3400.00, 12200, 180, 18.88],
        [today, 'Taboola Native', 'Taboola_ArticleWidget_TopPerformers', 2100.00, 7800, 95, 22.10]
      ];
    case 'taboola_video':
      return [
        headers,
        [today, 'Taboola Video', 'ATF_Taboola_HighImpactVideo_US', 2800.00, 8900, 110, 25.45]
      ];
    case 'reddit':
      return [
        headers,
        [today, 'Reddit Ads', 'ATF_Reddit_TechSubreddits', 5400.00, 14200, 320, 16.88]
      ];
    case 'microsoft':
      return [
        headers,
        [today, 'Microsoft Ads', 'ATF_MSFT_BingSearch_Intent', 4600.00, 11200, 310, 14.84]
      ];
    case 'twitter':
      return [
        headers,
        [today, 'Twitter/X Ads', 'ATF_X_PromotedTweets_Trend', 2900.00, 9400, 140, 20.71]
      ];
    case 'propeller':
      return [
        headers,
        [today, 'PropellerAds', 'ATF_Propeller_Push_Global', 3050.00, 8000, 220, 13.86]
      ];
    default:
      // Unified / Master Rollup
      return [
        headers,
        [today, 'Meta Ads', 'ATF_Meta_AdvantagePlus_US', 14200.00, 42100, 1050, 13.52],
        [today, 'Google Ads', 'ATF_Google_Search_Brand_US', 12100.00, 38900, 980, 12.35],
        [today, 'TikTok Ads', 'ATF_TikTok_Spark_GenZ', 8900.00, 28400, 540, 16.48],
        [today, 'Reddit Ads', 'ATF_Reddit_TechSubreddits', 5400.00, 14200, 320, 16.88],
        [today, 'Microsoft Ads', 'ATF_MSFT_BingSearch_Intent', 4600.00, 11200, 310, 14.84],
        [today, 'Taboola Native', 'ATF_Taboola_ContentFeed_US', 3400.00, 12200, 180, 18.88],
        [today, 'PropellerAds', 'ATF_Propeller_Push_Global', 3050.00, 8000, 220, 13.86],
        [today, 'Twitter/X Ads', 'ATF_X_PromotedTweets_Trend', 2900.00, 9400, 140, 20.71],
        [today, 'Taboola Video', 'ATF_Taboola_HighImpactVideo_US', 2800.00, 8900, 110, 25.45]
      ];
  }
}

async function runScheduledSync() {
  console.log('\n[Fenyx Engine] Executing 10-channel multi-tab sync...');
  try {
    const { rows: sources } = await pool.query("SELECT * FROM data_sources WHERE status = 'ACTIVE'");

    for (const source of sources) {
      if (!source.sheet_id) continue;

      const platformsToSync = [
        { name: 'Unified', key: 'unified' },
        { name: 'Meta', key: 'meta' },
        { name: 'Google', key: 'google' },
        { name: 'TikTok', key: 'tiktok' },
        { name: 'Taboola', key: 'taboola' },
        { name: 'Taboola Video', key: 'taboola_video' },
        { name: 'Reddit', key: 'reddit' },
        { name: 'Microsoft', key: 'microsoft' },
        { name: 'Twitter', key: 'twitter' },
        { name: 'Propeller', key: 'propeller' }
      ];

      for (const target of platformsToSync) {
        const rows = generatePlatformRows(target.key);

        await sheets.spreadsheets.values.update({
          spreadsheetId: source.sheet_id,
          range: `${target.name}!A1`,
          valueInputOption: 'USER_ENTERED',
          requestBody: { values: rows }
        });

        console.log(`✅ [Synced] Updated '${target.name}' tab with ${rows.length - 1} rows.`);
      }
    }
  } catch (err) {
    console.error('❌ [Sync Error]', err.message);
  }
}

cron.schedule('0 */6 * * *', runScheduledSync);

app.post('/api/sync/now', async (req, res) => {
  await runScheduledSync();
  res.json({ status: 'Expanded 10-channel sync completed' });
});

app.listen(process.env.PORT || 5000, async () => {
  console.log('Fenyx 10-channel sync worker running on port 5000');
  await runScheduledSync();
});
