const mysql = require('mysql2/promise');
require('dotenv').config();

const USE_CASES = [
  { slug: 'build-app', title: 'Build an App', description: 'Code assistants, app builders and full stacks to ship software', icon: 'pi-code', sort_order: 1 },
  { slug: 'write', title: 'Write & Communicate', description: 'Drafts, emails, rewriting and clear communication', icon: 'pi-pencil', sort_order: 2 },
  { slug: 'design', title: 'Create Images & Design', description: 'Generate images, design assets, logos and UI', icon: 'pi-palette', sort_order: 3 },
  { slug: 'video', title: 'Edit & Create Video', description: 'Generate, edit and caption videos', icon: 'pi-video', sort_order: 4 },
  { slug: 'study', title: 'Study & Learn', description: 'Summarize, research and learn anything faster', icon: 'pi-book', sort_order: 5 },
  { slug: 'business', title: 'Run a Business', description: 'Research, sales, documents and productivity', icon: 'pi-briefcase', sort_order: 6 }
];

const TOOLS = [
  {
    name: 'OpenCode', description: 'Open-source AI coding agent that runs in your terminal. Reads your whole repo, edits files and runs commands — free and local.', url: 'https://opencode.ai',
    image_url: '', category: 'Code Assistant', pricing: 'Free', rating: 4.8, best_for: 'Free AI coding agent for building software in the terminal', beginner_friendly: 1,
    use_cases: ['build-app']
  },
  {
    name: 'Cursor', description: 'AI-first code editor. Tab-tab-tab autocomplete plus agent chat over your whole codebase.', url: 'https://cursor.com',
    image_url: '', category: 'Code Assistant', pricing: 'Paid', rating: 4.8, best_for: 'AI code editor that feels like magic for daily coding', beginner_friendly: 1,
    use_cases: ['build-app']
  },
  {
    name: 'GitHub Copilot', description: 'AI pair programmer embedded in VS Code, JetBrains and GitHub. Great for autocomplete and pull requests.', url: 'https://github.com/features/copilot',
    image_url: '', category: 'Code Assistant', pricing: 'Paid', rating: 4.4, best_for: 'AI autocomplete and PR help inside GitHub', beginner_friendly: 0,
    use_cases: ['build-app']
  },
  {
    name: 'Bolt.new', description: 'Describe an app and get a running web app instantly, no setup. Then keep editing it in the browser.', url: 'https://bolt.new',
    image_url: '', category: 'App Builder', pricing: 'Freemium', rating: 4.5, best_for: 'Prototyping a full web app from a single prompt', beginner_friendly: 1,
    use_cases: ['build-app']
  },
  {
    name: 'v0', description: 'Vercel\'s AI UI generator. Describe a UI and get production-ready React + Tailwind code.', url: 'https://v0.dev',
    image_url: '', category: 'App Builder', pricing: 'Freemium', rating: 4.6, best_for: 'Generating polished frontend UI components', beginner_friendly: 1,
    use_cases: ['build-app']
  },
  {
    name: 'Supabase', description: 'Open-source Firebase alternative. Postgres database, auth and storage with an AI toolkit.', url: 'https://supabase.com',
    image_url: '', category: 'Backend', pricing: 'Freemium', rating: 4.7, best_for: 'Database and backend for AI apps you build yourself', beginner_friendly: 0,
    use_cases: ['build-app']
  },
  {
    name: 'Ollama', description: 'Run open-source LLMs like Llama and Qwen on your own machine, free and offline.', url: 'https://ollama.com',
    image_url: '', category: 'Local AI', pricing: 'Free', rating: 4.7, best_for: 'Running local AI models privately on your laptop', beginner_friendly: 1,
    use_cases: ['build-app', 'study']
  },
  {
    name: 'ChatGPT', description: 'The default AI assistant. Chat, write, code, analyze files and search the web in one place.', url: 'https://chatgpt.com',
    image_url: '', category: 'Chatbot', pricing: 'Freemium', rating: 4.5, best_for: 'Everyday questions, writing and quick help', beginner_friendly: 1,
    use_cases: ['write', 'study', 'business']
  },
  {
    name: 'Claude', description: 'Anthropic\'s AI assistant, especially strong at writing, long documents and coding.', url: 'https://claude.ai',
    image_url: '', category: 'Chatbot', pricing: 'Freemium', rating: 4.7, best_for: 'Long-form writing and careful reasoning', beginner_friendly: 1,
    use_cases: ['write', 'build-app', 'study', 'business']
  },
  {
    name: 'Grammarly', description: 'Real-time grammar, tone and clarity fixes across your writing and email.', url: 'https://grammarly.com',
    image_url: '', category: 'Writing', pricing: 'Freemium', rating: 4.3, best_for: 'Polishing emails and documents as you type', beginner_friendly: 1,
    use_cases: ['write', 'business']
  },
  {
    name: 'Notion AI', description: 'AI inside your notes and wiki — summarise pages, generate drafts, answer questions over your docs.', url: 'https://notion.so/product/ai',
    image_url: '', category: 'Productivity', pricing: 'Freemium', rating: 4.4, best_for: 'Second brain users who live in Notion', beginner_friendly: 1,
    use_cases: ['write', 'study', 'business']
  },
  {
    name: 'Midjourney', description: 'The reference for AI image generation. Stunning artistic output from a text prompt.', url: 'https://midjourney.com',
    image_url: '', category: 'Image Generation', pricing: 'Paid', rating: 4.7, best_for: 'Beautiful, artistic images for creatives', beginner_friendly: 0,
    use_cases: ['design']
  },
  {
    name: 'Stable Diffusion', description: 'Open-source image generation you can run locally for free with total control.', url: 'https://stability.ai',
    image_url: '', category: 'Image Generation', pricing: 'Free', rating: 4.5, best_for: 'Free, private and customizable image generation', beginner_friendly: 0,
    use_cases: ['design']
  },
  {
    name: 'Canva Magic Studio', description: 'Design anything — posts, logos, posters — with AI assist built into an easy editor.', url: 'https://canva.com/magic-studio',
    image_url: '', category: 'Design', pricing: 'Freemium', rating: 4.5, best_for: 'Non-designers who need graphics fast', beginner_friendly: 1,
    use_cases: ['design', 'business']
  },
  {
    name: 'Runway', description: 'AI video generation and editing in the browser. Text-to-video and motion tools.', url: 'https://runwayml.com',
    image_url: '', category: 'Video', pricing: 'Freemium', rating: 4.4, best_for: 'Generating short video clips from a prompt', beginner_friendly: 0,
    use_cases: ['video']
  },
  {
    name: 'CapCut', description: 'Free, fast video editor with AI captions, effects and templates. Huge for short-form content.', url: 'https://capcut.com',
    image_url: '', category: 'Video', pricing: 'Freemium', rating: 4.5, best_for: 'Editing TikTok/Shorts/Reels fast', beginner_friendly: 1,
    use_cases: ['video', 'business']
  },
  {
    name: 'Whisper', description: 'OpenAI\'s open-source speech-to-text. Transcribe audio to text with near-human accuracy, free.', url: 'https://github.com/openai/whisper',
    image_url: '', category: 'Audio', pricing: 'Free', rating: 4.7, best_for: 'Free transcription and subtitles', beginner_friendly: 0,
    use_cases: ['video', 'study', 'business']
  },
  {
    name: 'ElevenLabs', description: 'The most realistic AI voices and voice cloning. Narrate videos and podcasts.', url: 'https://elevenlabs.io',
    image_url: '', category: 'Audio', pricing: 'Freemium', rating: 4.5, best_for: 'Realistic AI voiceovers', beginner_friendly: 0,
    use_cases: ['video', 'business']
  },
  {
    name: 'NotebookLM', description: 'Upload your sources — PDFs, links, notes — and get answers grounded only in them. Free.', url: 'https://notebooklm.google.com',
    image_url: '', category: 'Study', pricing: 'Free', rating: 4.7, best_for: 'Learning from your own documents', beginner_friendly: 1,
    use_cases: ['study']
  },
  {
    name: 'Perplexity', description: 'AI search engine with cited answers. The fastest way to research a topic.', url: 'https://perplexity.ai',
    image_url: '', category: 'Research', pricing: 'Freemium', rating: 4.6, best_for: 'Fact-finding with real sources', beginner_friendly: 1,
    use_cases: ['study', 'business']
  },
  {
    name: 'Hugging Face', description: 'The hub for open-source AI models, datasets and demos. Where models are shared and tried.', url: 'https://huggingface.co',
    image_url: '', category: 'Model Hub', pricing: 'Freemium', rating: 4.8, best_for: 'Finding and trying open AI models', beginner_friendly: 0,
    use_cases: ['build-app', 'study']
  },
  {
    name: 'Gradio', description: 'Build a shareable demo UI for any model in a few lines of Python. Free and open.', url: 'https://gradio.app',
    image_url: '', category: 'Framework', pricing: 'Free', rating: 4.6, best_for: 'Turning a model into a web demo in minutes', beginner_friendly: 1,
    use_cases: ['build-app']
  },
  {
    name: 'LangChain', description: 'The most popular framework for building LLM applications in Python and JS.', url: 'https://langchain.com',
    image_url: '', category: 'Framework', pricing: 'Free', rating: 4.4, best_for: 'Building serious AI pipelines and agents', beginner_friendly: 0,
    use_cases: ['build-app']
  },
  {
    name: 'Suno', description: 'Generate complete songs with vocals from a text prompt. Wildly popular.', url: 'https://suno.com',
    image_url: '', category: 'Audio', pricing: 'Freemium', rating: 4.4, best_for: 'Making AI music for fun or content', beginner_friendly: 1,
    use_cases: ['video']
  },
  {
    name: 'Gemini', description: 'Google\'s AI assistant — strong at reasoning and search, free, and works across your Google apps. Great at handling images and video too.', url: 'https://gemini.google.com',
    image_url: '', category: 'Chatbot', pricing: 'Freemium', rating: 4.6, best_for: 'Free AI assistant tied to Google apps and Gmail', beginner_friendly: 1,
    use_cases: ['write', 'study', 'business']
  },
  {
    name: 'Flux', description: 'Black Forest Labs\' open image model. Top-tier quality from text prompts — free weights, pay only for the fastest API.', url: 'https://huggingface.co/black-forest-labs/FLUX.1-dev',
    image_url: '', category: 'Image Generation', pricing: 'Freemium', rating: 4.7, best_for: 'Open image model rivaling Midjourney', beginner_friendly: 0,
    use_cases: ['design']
  },
  {
    name: 'LM Studio', description: 'A desktop app that makes running open models locally easy — download, click, chat. No command line required.', url: 'https://lmstudio.ai',
    image_url: '', category: 'Local AI', pricing: 'Free', rating: 4.6, best_for: 'Friendly app to run local models without the command line', beginner_friendly: 1,
    use_cases: ['build-app', 'study']
  },
  {
    name: 'Descript', description: 'Edit video like a doc — delete words in the transcript and the footage follows. Great for podcasts and tutorials.', url: 'https://descript.com',
    image_url: '', category: 'Video', pricing: 'Freemium', rating: 4.4, best_for: 'Editing videos and podcasts by editing the transcript', beginner_friendly: 0,
    use_cases: ['video', 'business']
  },
  {
    name: 'Figma', description: 'The industry-standard design tool for UI and collaboration. AI features help turn designs into editable layouts.', url: 'https://figma.com',
    image_url: '', category: 'Design', pricing: 'Freemium', rating: 4.5, best_for: 'Team design and UI prototyping, with AI assist', beginner_friendly: 0,
    use_cases: ['design', 'build-app']
  },
  {
    name: 'LlamaIndex', description: 'The most popular framework for connecting LLMs to your own data — documents, databases, APIs. Pairs with LangChain.', url: 'https://llamaindex.ai',
    image_url: '', category: 'Framework', pricing: 'Free', rating: 4.5, best_for: 'The framework for RAG and document apps', beginner_friendly: 0,
    use_cases: ['build-app']
  },
  {
    name: 'Udio', description: 'Generate full songs with vocals, then remix with detailed controls. The serious alternative to Suno.', url: 'https://udio.com',
    image_url: '', category: 'Audio', pricing: 'Freemium', rating: 4.3, best_for: 'AI songs with fine control over style and lyrics', beginner_friendly: 1,
    use_cases: ['video']
  },
  {
    name: 'LanguageTool', description: 'Open-source grammar and style checker with deep multilingual support. A free alternative to Grammarly.', url: 'https://languagetool.org',
    image_url: '', category: 'Writing', pricing: 'Freemium', rating: 4.3, best_for: 'Free grammar checking that supports 30+ languages', beginner_friendly: 1,
    use_cases: ['write', 'business', 'study']
  },
  {
    name: 'Photoroom', description: 'Remove backgrounds and create studio-quality product photos from your phone in seconds. Built for sellers.', url: 'https://photoroom.com',
    image_url: '', category: 'Design', pricing: 'Freemium', rating: 4.5, best_for: 'Instant background removal and product photos', beginner_friendly: 1,
    use_cases: ['design', 'business']
  }
];

async function main() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'ai_compass'
  });

  try {
    console.log('> Adding columns to tools...');
    const [cols] = await pool.query('SHOW COLUMNS FROM tools');
    const colNames = cols.map(c => c.Field);
    if (!colNames.includes('best_for')) {
      await pool.query("ALTER TABLE tools ADD COLUMN best_for VARCHAR(255) DEFAULT NULL");
    }
    if (!colNames.includes('beginner_friendly')) {
      await pool.query("ALTER TABLE tools ADD COLUMN beginner_friendly TINYINT(1) DEFAULT 0");
    }

    console.log('> Creating use_cases table...');
    await pool.query(`CREATE TABLE IF NOT EXISTS use_cases (
      id INT AUTO_INCREMENT PRIMARY KEY,
      slug VARCHAR(60) NOT NULL UNIQUE,
      title VARCHAR(100) NOT NULL,
      description VARCHAR(300) DEFAULT NULL,
      icon VARCHAR(50) DEFAULT NULL,
      sort_order INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);

    console.log('> Creating tool_use_cases table...');
    await pool.query(`CREATE TABLE IF NOT EXISTS tool_use_cases (
      tool_id INT NOT NULL,
      use_case_id INT NOT NULL,
      PRIMARY KEY (tool_id, use_case_id),
      FOREIGN KEY (tool_id) REFERENCES tools(id) ON DELETE CASCADE,
      FOREIGN KEY (use_case_id) REFERENCES use_cases(id) ON DELETE CASCADE
    )`);

    console.log('> Creating saves table...');
    await pool.query(`CREATE TABLE IF NOT EXISTS saves (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      tool_id INT NOT NULL,
      note VARCHAR(500) DEFAULT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE KEY unique_save (user_id, tool_id),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (tool_id) REFERENCES tools(id) ON DELETE CASCADE
    )`);

    console.log('> Seeding use cases...');
    for (const uc of USE_CASES) {
      await pool.query(
        'INSERT INTO use_cases (slug, title, description, icon, sort_order) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE title = VALUES(title), description = VALUES(description), icon = VALUES(icon), sort_order = VALUES(sort_order)',
        [uc.slug, uc.title, uc.description, uc.icon, uc.sort_order]
      );
    }

    console.log('> Seeding tools...');
    for (const t of TOOLS) {
      const [existing] = await pool.query('SELECT id FROM tools WHERE name = ?', [t.name]);
      let toolId;
      if (existing.length > 0) {
        toolId = existing[0].id;
        await pool.query(
          'UPDATE tools SET description = ?, url = ?, image_url = ?, category = ?, pricing = ?, rating = ?, best_for = ?, beginner_friendly = ? WHERE id = ?',
          [t.description, t.url, t.image_url, t.category, t.pricing, t.rating, t.best_for, t.beginner_friendly, toolId]
        );
      } else {
        const [result] = await pool.query(
          'INSERT INTO tools (name, description, url, image_url, category, pricing, rating, best_for, beginner_friendly) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [t.name, t.description, t.url, t.image_url, t.category, t.pricing, t.rating, t.best_for, t.beginner_friendly]
        );
        toolId = result.insertId;
      }

      const [ucRows] = await pool.query('SELECT id, slug FROM use_cases');
      const slugToId = {};
      ucRows.forEach(u => slugToId[u.slug] = u.id);

      await pool.query('DELETE FROM tool_use_cases WHERE tool_id = ?', [toolId]);
      for (const slug of t.use_cases) {
        if (slugToId[slug]) {
          await pool.query('INSERT IGNORE INTO tool_use_cases (tool_id, use_case_id) VALUES (?, ?)', [toolId, slugToId[slug]]);
        }
      }
    }

    console.log('Done.');
  } catch (err) {
    console.error('Migration failed:', err.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

main();
