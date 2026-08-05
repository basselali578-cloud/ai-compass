const mysql = require('mysql2/promise');
require('dotenv').config();

const REVIEWS = {
  'OpenCode': { last_reviewed: '2026-07-30', confidence: 5, note: 'The default free coding agent — better than most paid options for terminal users.' },
  'Cursor': { last_reviewed: '2026-07-28', confidence: 5, note: 'Still the smoothest AI editor experience for daily coding.' },
  'GitHub Copilot': { last_reviewed: '2026-07-20', confidence: 3, note: 'Solid autocomplete, but agents and editors caught up; worth it mainly inside GitHub.' },
  'Bolt.new': { last_reviewed: '2026-07-25', confidence: 4, note: 'Fastest route from prompt to a working web app; hits limits on serious projects.' },
  'v0': { last_reviewed: '2026-07-25', confidence: 4, note: 'Best-in-class UI generation; pair it with a real editor for production.' },
  'Supabase': { last_reviewed: '2026-07-22', confidence: 5, note: 'Our default backend for AI apps — open, portable, generous free tier.' },
  'Ollama': { last_reviewed: '2026-07-18', confidence: 5, note: 'The easiest way to run models locally; essential for private AI.' },
  'ChatGPT': { last_reviewed: '2026-07-27', confidence: 4, note: 'The most complete all-rounder; the free tier alone covers most people.' },
  'Claude': { last_reviewed: '2026-07-24', confidence: 5, note: 'Our pick for long-form writing and careful reasoning over documents.' },
  'Grammarly': { last_reviewed: '2026-06-30', confidence: 3, note: 'Solid for polish, but the premium tier is pricey and free alternatives are close.' },
  'Notion AI': { last_reviewed: '2026-07-10', confidence: 3, note: 'Useful only if you already live in Notion; not a reason to switch to it.' },
  'Midjourney': { last_reviewed: '2026-07-15', confidence: 4, note: 'Still the aesthetic benchmark for AI images; the Discord workflow is dated.' },
  'Stable Diffusion': { last_reviewed: '2026-07-12', confidence: 4, note: 'Free, local, fully controlled — if you can handle the setup.' },
  'Canva Magic Studio': { last_reviewed: '2026-07-21', confidence: 4, note: 'The beginner-friendly design default: fast, familiar, great templates.' },
  'Runway': { last_reviewed: '2026-07-16', confidence: 4, note: 'Best text-to-video for short clips; credits run out quickly.' },
  'CapCut': { last_reviewed: '2026-07-23', confidence: 5, note: 'The default editor for short-form; auto-captions are unbeatable value.' },
  'Whisper': { last_reviewed: '2026-07-19', confidence: 5, note: 'Free, accurate transcription that is hard to beat; command line required.' },
  'ElevenLabs': { last_reviewed: '2026-07-17', confidence: 4, note: 'The most realistic voices; the free tier is just a taste.' },
  'NotebookLM': { last_reviewed: '2026-07-26', confidence: 5, note: 'The study tool we recommend to every student — free and grounded in your sources.' },
  'Perplexity': { last_reviewed: '2026-07-26', confidence: 5, note: 'Our default research answer; citations are what make it trustworthy.' },
  'Hugging Face': { last_reviewed: '2026-07-08', confidence: 4, note: 'The hub for open models; overwhelming for beginners but essential.' },
  'Gradio': { last_reviewed: '2026-07-09', confidence: 4, note: 'Fastest way to demo a model; not for production apps.' },
  'LangChain': { last_reviewed: '2026-07-05', confidence: 3, note: 'Powerful but churn-heavy; reach for it when simple orchestration is not enough.' },
  'Suno': { last_reviewed: '2026-07-14', confidence: 4, note: 'Fun and surprisingly good songs; quality varies by genre.' },
  'Gemini': { last_reviewed: '2026-07-29', confidence: 4, note: 'The best free assistant if you live in Google apps; great with images and video.' },
  'Flux': { last_reviewed: '2026-07-29', confidence: 5, note: 'Open image model that finally rivals Midjourney — free weights, huge quality jump.' },
  'LM Studio': { last_reviewed: '2026-07-28', confidence: 5, note: 'The friendliest way for non-devs to run local models. No terminal needed.' },
  'Descript': { last_reviewed: '2026-07-27', confidence: 4, note: 'Editing video by editing the transcript is a superpower for podcasts.' },
  'Figma': { last_reviewed: '2026-07-26', confidence: 4, note: 'Still the industry standard for UI work; AI assist is getting genuinely useful.' },
  'LlamaIndex': { last_reviewed: '2026-07-24', confidence: 4, note: 'The go-to framework for connecting models to your own documents.' },
  'Udio': { last_reviewed: '2026-07-23', confidence: 4, note: 'Suno\'s serious rival for songs with vocals — more control, slightly less polish.' },
  'LanguageTool': { last_reviewed: '2026-07-22', confidence: 4, note: 'A genuinely good free Grammarly alternative that supports dozens of languages.' },
  'Photoroom': { last_reviewed: '2026-07-21', confidence: 4, note: 'The fastest background removal and product-photo tool for sellers.' }
};

const REVIEWER = 'Bassel';

async function main() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'ai_compass'
  });

  try {
    console.log('> Adding review columns to tools...');
    const [cols] = await pool.query('SHOW COLUMNS FROM tools');
    const colNames = cols.map(c => c.Field);
    const adds = [
      ['last_reviewed', 'DATE DEFAULT NULL'],
      ['reviewer', 'VARCHAR(60) DEFAULT NULL'],
      ['confidence', 'TINYINT DEFAULT NULL'],
      ['review_note', 'VARCHAR(300) DEFAULT NULL']
    ];
    for (const [col, ddl] of adds) {
      if (!colNames.includes(col)) {
        await pool.query(`ALTER TABLE tools ADD COLUMN ${col} ${ddl}`);
      }
    }

    console.log('> Seeding reviews...');
    let count = 0;
    for (const [name, r] of Object.entries(REVIEWS)) {
      const [result] = await pool.query(
        'UPDATE tools SET last_reviewed = ?, reviewer = ?, confidence = ?, review_note = ? WHERE name = ?',
        [r.last_reviewed, REVIEWER, r.confidence, r.note, name]
      );
      if (result.affectedRows > 0) count++;
      else console.log(`  ! no tool named "${name}"`);
    }

    console.log(`Done. Reviewed ${count} of ${Object.keys(REVIEWS).length} tools. Reviewer: ${REVIEWER}`);
  } catch (err) {
    console.error('Reviews seed failed:', err.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

main();
