const mysql = require('mysql2/promise');
require('dotenv').config();

const WORKFLOWS = [
  {
    slug: 'youtube-thumbnails',
    title: 'Make YouTube thumbnails',
    goal: 'Eye-catching thumbnails in about 15 minutes',
    summary: 'The exact workflow for thumbnails that read well at small sizes: generate, enhance, design, export.',
    icon: 'pi-youtube',
    color: '#ef4444',
    difficulty: 'Beginner',
    cost: 'Free to start',
    time_label: '~15 minutes',
    estimated_minutes: 15,
    is_featured: 1,
    sort_order: 1,
    why: [
      'Ideogram renders text inside the image better than anything else — no manual typography needed.',
      'Magnific upscales the art so it stays crisp at YouTube\u2019s small preview size.',
      'Canva is free and instantly familiar, so you can add the title and arrows without design skills.'
    ],
    alternative_stacks: ['Free stack', 'Designer stack'],
    steps: [
      { tool: 'Ideogram', title: 'Ideogram', note: 'Generate a bold thumbnail image from a prompt. Best-in-class at text inside images.', why: 'It writes clean, readable text inside the image, which most generators mangle.', alternative: 'DALL\u00b7E', avoid_if: 'You need a whole video, not a single image.' },
      { tool: 'Magnific', title: 'Magnific', note: 'Upscale and enhance to crisp 1280x720 so it survives YouTube\u2019s small preview.', why: 'Upscaling keeps edges sharp at the small preview size where thumbnails live or die.', alternative: 'Upscayl', avoid_if: 'Your source image is already 4K.' },
      { tool: 'Canva Magic Studio', title: 'Canva', note: 'Overlay your title, arrows and branding using a thumbnail template.', why: 'Free, familiar, and ships ready-made thumbnail templates for every format.', alternative: 'Figma', avoid_if: 'You need pixel-perfect print-quality design.' },
      { tool: 'CapCut', title: 'CapCut', note: 'If you are cutting the video too, export the thumbnail at the right size in the same session.', why: 'You are already in it for the video, so the export settings are right there.', alternative: 'DaVinci Resolve', avoid_if: 'You only need the thumbnail — skip this step.' },
      { tool: null, title: 'Upload to YouTube', note: 'Set it as the custom thumbnail and double-check it reads well at 160px wide.' }
    ]
  },
  {
    slug: 'build-a-saas',
    title: 'Build a SaaS from scratch',
    goal: 'From idea to deployed product',
    summary: 'The modern AI-native stack for shipping a SaaS solo: AI writes the code, you keep the data and the deploy.',
    icon: 'pi-server',
    color: '#6366f1',
    difficulty: 'Intermediate',
    cost: 'Free until launch',
    time_label: '~3 hours',
    estimated_minutes: 120,
    is_featured: 1,
    sort_order: 2,
    why: [
      'Everything on this stack has a generous free tier — you can build and launch without spending a cent.',
      'OpenCode writes the code for free and locally, so there is no monthly agent bill.',
      'Supabase keeps your data and auth portable — no lock-in on the backend.',
      'Each piece is a category standard, so tutorials and docs are everywhere when you get stuck.'
    ],
    alternative_stacks: ['Budget stack', 'Local stack', 'Enterprise stack'],
    steps: [
      { tool: 'OpenCode', title: 'OpenCode', note: 'Let the agent scaffold the app, tests and CI in your terminal. Free and local.', why: 'Free, local, and it can use any major LLM as its brain — no subscription to start.', alternative: 'Cursor', avoid_if: 'You want a GUI editor with autocomplete out of the box.' },
      { tool: 'Supabase', title: 'Supabase', note: 'Postgres, auth and storage in one. Your data stays yours.', why: 'Postgres, auth and storage in one open-source package with a strong free tier.', alternative: 'Neon', avoid_if: 'Your backend is already on AWS — do not migrate for fun.' },
      { tool: 'Vercel', title: 'Vercel', note: 'Deploy the frontend and serverless functions with a git push.', why: 'One git push deploys your frontend and serverless functions with zero config.', alternative: 'Netlify', avoid_if: 'You need long-running server processes.' },
      { tool: 'Resend', title: 'Resend', note: 'Transactional email for signups and invoices, with a simple API.', why: 'Simple API and excellent deliverability without a complex email setup.', alternative: 'Postmark', avoid_if: 'You send a handful of emails a month — use your app\u2019s SMTP.' },
      { tool: 'PostHog', title: 'PostHog', note: 'Product analytics, session replay and feature flags from day one.', why: 'Analytics, session replay and flags in one tool with a free tier — growth and debugging in one place.', alternative: 'Amplitude', avoid_if: 'You already have analytics wired and do not need session replay.' },
      { tool: 'Stripe', title: 'Stripe', note: 'Take payments. The docs are good enough that an AI agent can wire them for you.', why: 'The default payments API, with docs good enough that an AI agent wires it for you.', alternative: 'Paddle', avoid_if: 'You sell physical goods — a simpler processor may fit.' }
    ]
  },
  {
    slug: 'youtube-creator',
    title: 'Start a YouTube channel',
    goal: 'Script, voice, edit and ship a video a week',
    summary: 'The content stack for solo creators: plan with AI, generate the voice, edit fast, then optimize.',
    icon: 'pi-video',
    color: '#a855f7',
    difficulty: 'Intermediate',
    cost: 'Freemium',
    time_label: '~1 hour per video',
    estimated_minutes: 45,
    is_featured: 1,
    sort_order: 3,
    why: [
      'The free tiers cover a full video a week, so you can start with $0.',
      'Each tool does one job well, and the files move between them without re-recording.',
      'CapCut\u2019s auto-captions alone are worth it for short-form retention.'
    ],
    alternative_stacks: ['No-voice stack', 'Pro stack'],
    steps: [
      { tool: 'ChatGPT', title: 'ChatGPT', note: 'Brainstorm topics and write the hook. Ask it to write like you speak.', why: 'It turns a seed idea into a full script with a working hook in one session.', alternative: 'Claude', avoid_if: 'Your scripts are long-form and precise — Claude drafts those better.' },
      { tool: 'Ideogram', title: 'Ideogram', note: 'Generate the thumbnail and any on-screen graphics.', why: 'Thumbnails with readable text, and text is what drives the click.', alternative: 'Canva Magic Studio', avoid_if: 'You want to design the thumbnail by hand in a full editor.' },
      { tool: 'ElevenLabs', title: 'ElevenLabs', note: 'Record a studio-quality AI voiceover when you cannot use your own.', why: 'Studio-quality voiceovers when you cannot record — huge for talking-head channels.', alternative: 'Murf', avoid_if: 'You have a good mic and a natural on-camera voice — use it.' },
      { tool: 'CapCut', title: 'CapCut', note: 'Cut to the voiceover, add auto-captions and tighten pacing in minutes.', why: 'Free, fast, and auto-captions are the best retention hack in short-form.', alternative: 'DaVinci Resolve', avoid_if: 'You are editing long documentaries, not shorts.' },
      { tool: 'TubeBuddy', title: 'TubeBuddy', note: 'Optimize the title, tags and best upload time before hitting publish.', why: 'It picks titles and tags that rank and tells you when to publish.', alternative: 'vidIQ', avoid_if: 'You already know your keywords cold.' }
    ]
  },
  {
    slug: 'study-smarter',
    title: 'Study smarter, not harder',
    goal: 'Turn lectures and PDFs into notes you remember',
    summary: 'Capture, understand, quiz yourself — a complete study loop from source material to long-term memory.',
    icon: 'pi-book',
    color: '#22c55e',
    difficulty: 'Beginner',
    cost: 'Free',
    time_label: '~30 minutes per lecture',
    estimated_minutes: 30,
    is_featured: 1,
    sort_order: 4,
    why: [
      'Every tool on this stack is free, which matters when you are a student.',
      'The loop matches how memory works: capture, understand, then quiz yourself.',
      'You keep ownership of your notes instead of locking them into one app.'
    ],
    alternative_stacks: ['No-LLM stack', 'Video-first stack'],
    steps: [
      { tool: 'NotebookLM', title: 'NotebookLM', note: 'Upload lecture PDFs and get answers grounded only in your sources.', why: 'Answers are grounded only in your uploaded sources, so citations stay trustworthy.', alternative: 'ChatGPT with file upload', avoid_if: 'You need answers from the open web, not just your files.' },
      { tool: 'Whisper', title: 'Whisper', note: 'Transcribe audio lectures and meetings into searchable text, free.', why: 'Accurate, free transcription — ideal for audio-only lectures.', alternative: 'Otter.ai', avoid_if: 'You do not want a command line; Otter has a polished app.' },
      { tool: 'Perplexity', title: 'Perplexity', note: 'Fill the gaps in your notes with cited, up-to-date explanations.', why: 'Cited answers fill the gaps your lecture notes leave open.', alternative: 'Google', avoid_if: 'You only need one quick fact — a normal search is faster.' },
      { tool: 'ChatGPT', title: 'ChatGPT', note: 'Turn the notes into flashcards and practice questions.', why: 'Turning notes into flashcards is where general-purpose models shine.', alternative: 'Anki\u2019s AI add-ons', avoid_if: 'You already have a flashcard workflow you like.' },
      { tool: 'Obsidian', title: 'Obsidian', note: 'Keep a linked second brain so your notes compound over time.', why: 'Your notes stay local and linked, so the second brain compounds.', alternative: 'Notion', avoid_if: 'You prefer collaborating and sharing in the cloud.' }
    ]
  },
  {
    slug: 'research-like-a-pro',
    title: 'Research any topic like a pro',
    goal: 'From question to cited, organized answers',
    summary: 'Find the best sources, pull out what matters, and organize it all before you write a single word.',
    icon: 'pi-search',
    color: '#0ea5e9',
    difficulty: 'Intermediate',
    cost: 'Free',
    time_label: '~40 minutes per topic',
    estimated_minutes: 40,
    is_featured: 0,
    sort_order: 5,
    why: [
      'Cited sources first, synthesis second — you never build conclusions on unverified claims.',
      'Every tool is free and open to your own material.',
      'The last step files your work, so it becomes reusable research instead of a lost tab.'
    ],
    alternative_stacks: ['Speed stack', 'Academic stack'],
    steps: [
      { tool: 'Perplexity', title: 'Perplexity', note: 'Start broad — get cited answers and discover the key sources fast.', why: 'Cited answers give you the map of the topic before you commit to reading.', alternative: 'Google Scholar', avoid_if: 'You already know the exact papers you need.' },
      { tool: 'NotebookLM', title: 'NotebookLM', note: 'Load the best sources and ask questions grounded only in them.', why: 'Deep, grounded Q&A over the sources you actually chose.', alternative: 'ChatGPT with file upload', avoid_if: 'All your sources are web pages — Perplexity covers them.' },
      { tool: 'Claude', title: 'Claude', note: 'Draft the synthesis. Claude is the strongest at long, careful writing.', why: 'Long, careful synthesis is its strongest skill.', alternative: 'ChatGPT', avoid_if: 'You need every citation preserved verbatim in the draft.' },
      { tool: 'Whisper', title: 'Whisper', note: 'Transcribe any interviews or videos you gathered along the way.', why: 'Interviews and talks become searchable text you can quote.', alternative: 'Descript', avoid_if: 'The audio is short and clear — read the player\u2019s transcript.' },
      { tool: 'Obsidian', title: 'Obsidian', note: 'File your findings with links so the research is reusable next time.', why: 'Links make the research accumulate into a knowledge base over time.', alternative: 'Notion', avoid_if: 'Your team shares research in one shared doc.' }
    ]
  },
  {
    slug: 'launch-a-newsletter',
    title: 'Launch a newsletter',
    goal: 'Write, design and ship a newsletter people open',
    summary: 'The zero-hype starter stack: draft with AI, polish it, design the header, then send with confidence.',
    icon: 'pi-envelope',
    color: '#f59e0b',
    difficulty: 'Beginner',
    cost: 'Freemium',
    time_label: '~30 minutes per issue',
    estimated_minutes: 30,
    is_featured: 0,
    sort_order: 6,
    why: [
      'You can run the whole thing on free tiers until you grow.',
      'Draft with AI, then polish by hand — the loop beats staring at a blank page.',
      'Every tool is a category standard, so it scales when you get sponsors.'
    ],
    alternative_stacks: ['Writer-first stack', 'Subscriber stack'],
    steps: [
      { tool: 'ChatGPT', title: 'ChatGPT', note: 'Generate ten editions of content ideas, then draft the first issue.', why: 'A week of topic ideas in one session — starting is the hardest part.', alternative: 'Claude', avoid_if: 'Your niche is technical writing; Claude writes longer, denser drafts.' },
      { tool: 'Claude', title: 'Claude', note: 'Rewrite the draft for flow — Claude reads long documents best.', why: 'It reads and rewrites long documents with better flow than most.', alternative: 'QuillBot', avoid_if: 'Your draft is short — a light Grammarly pass is enough.' },
      { tool: 'Grammarly', title: 'Grammarly', note: 'Catch tone and grammar before it reaches thousands of inboxes.', why: 'It catches the tone and grammar slips that kill credibility at scale.', alternative: 'LanguageTool', avoid_if: 'You write cleanly and do not want constant suggestions.' },
      { tool: 'Canva Magic Studio', title: 'Canva', note: 'Design a clean header and cover so the first impression counts.', why: 'A clean header and cover make the first issue feel real.', alternative: 'Figma', avoid_if: 'You already have a designer on the team.' },
      { tool: 'Resend', title: 'Resend', note: 'Send it and watch deliverability. Start with a small test list.', why: 'Simple sending with readable analytics while you are small.', alternative: 'Buttondown', avoid_if: 'You want paid subscriptions built in from day one.' }
    ]
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
    console.log('> Creating workflows tables...');
    await pool.query(`CREATE TABLE IF NOT EXISTS workflows (
      id INT AUTO_INCREMENT PRIMARY KEY,
      slug VARCHAR(80) NOT NULL UNIQUE,
      title VARCHAR(120) NOT NULL,
      goal VARCHAR(200) DEFAULT NULL,
      summary VARCHAR(400) DEFAULT NULL,
      icon VARCHAR(50) DEFAULT NULL,
      color VARCHAR(20) DEFAULT NULL,
      estimated_minutes INT DEFAULT NULL,
      is_featured TINYINT(1) DEFAULT 0,
      sort_order INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);

    await pool.query(`CREATE TABLE IF NOT EXISTS workflow_steps (
      id INT AUTO_INCREMENT PRIMARY KEY,
      workflow_id INT NOT NULL,
      tool_id INT DEFAULT NULL,
      title VARCHAR(120) NOT NULL,
      note VARCHAR(300) DEFAULT NULL,
      sort_order INT DEFAULT 0,
      FOREIGN KEY (workflow_id) REFERENCES workflows(id) ON DELETE CASCADE,
      FOREIGN KEY (tool_id) REFERENCES tools(id) ON DELETE SET NULL
    )`);

    console.log('> Adding workflow enrichment columns...');
    const hasColumn = async (table, column) => {
      const [cols] = await pool.query('SHOW COLUMNS FROM ' + table);
      return cols.map(c => c.Field).includes(column);
    };
    for (const [col, ddl] of [
      ['difficulty', "VARCHAR(20) DEFAULT 'Beginner'"],
      ['cost', "VARCHAR(40) DEFAULT 'Free'"],
      ['time_label', 'VARCHAR(60) DEFAULT NULL'],
      ['why', 'TEXT DEFAULT NULL'],
      ['alternative_stacks', 'VARCHAR(500) DEFAULT NULL']
    ]) {
      if (!(await hasColumn('workflows', col))) await pool.query(`ALTER TABLE workflows ADD COLUMN ${col} ${ddl}`);
    }
    for (const [col, ddl] of [
      ['why', 'VARCHAR(300) DEFAULT NULL'],
      ['alternative', 'VARCHAR(200) DEFAULT NULL'],
      ['avoid_if', 'VARCHAR(200) DEFAULT NULL']
    ]) {
      if (!(await hasColumn('workflow_steps', col))) await pool.query(`ALTER TABLE workflow_steps ADD COLUMN ${col} ${ddl}`);
    }

    const [tools] = await pool.query('SELECT id, name FROM tools');
    const toolIdByName = {};
    tools.forEach(t => (toolIdByName[t.name.toLowerCase()] = t.id));

    let resolved = 0;
    let unresolved = 0;

    for (const w of WORKFLOWS) {
      const [existing] = await pool.query('SELECT id FROM workflows WHERE slug = ?', [w.slug]);
      let workflowId;
      if (existing.length > 0) {
        workflowId = existing[0].id;
        await pool.query(
          'UPDATE workflows SET title = ?, goal = ?, summary = ?, icon = ?, color = ?, estimated_minutes = ?, is_featured = ?, sort_order = ?, difficulty = ?, cost = ?, time_label = ?, why = ?, alternative_stacks = ? WHERE id = ?',
          [w.title, w.goal, w.summary, w.icon, w.color, w.estimated_minutes, w.is_featured, w.sort_order, w.difficulty, w.cost, w.time_label, JSON.stringify(w.why), JSON.stringify(w.alternative_stacks), workflowId]
        );
      } else {
        const [res] = await pool.query(
          'INSERT INTO workflows (slug, title, goal, summary, icon, color, estimated_minutes, is_featured, sort_order, difficulty, cost, time_label, why, alternative_stacks) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [w.slug, w.title, w.goal, w.summary, w.icon, w.color, w.estimated_minutes, w.is_featured, w.sort_order, w.difficulty, w.cost, w.time_label, JSON.stringify(w.why), JSON.stringify(w.alternative_stacks)]
        );
        workflowId = res.insertId;
      }

      await pool.query('DELETE FROM workflow_steps WHERE workflow_id = ?', [workflowId]);
      for (const [i, s] of w.steps.entries()) {
        const toolId = s.tool ? toolIdByName[s.tool.toLowerCase()] : null;
        if (s.tool) {
          if (toolId) resolved++;
          else unresolved++;
        }
        await pool.query(
          'INSERT INTO workflow_steps (workflow_id, tool_id, title, note, why, alternative, avoid_if, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
          [workflowId, toolId, s.title, s.note, s.why || null, s.alternative || null, s.avoid_if || null, i]
        );
      }
      console.log(`  seeded "${w.title}" (${w.steps.length} steps)`);
    }

    console.log(`Done. Linked steps: ${resolved}, unlinked (external tool): ${unresolved}`);
  } catch (err) {
    console.error('Workflows seed failed:', err.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

main();
