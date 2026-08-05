// Curated intent rules for the search fallback.
// When a query has few or no direct keyword matches, we read the user's
// intent and recommend a shortlist of hand-picked tools (editorial picks).
// toolNames must match tool names in the database exactly.
module.exports = [
  {
    key: 'studying',
    label: 'for studying',
    keywords: ['study', 'studying', 'studied', 'exam', 'exams', 'quiz', 'homework', 'assignment', 'notes', 'lecture', 'lectures', 'class', 'classes', 'school', 'academic', 'biology', 'chemistry', 'physics', 'history', 'learn', 'learning', 'understand pdf', 'understand pdfs', 'course', 'test prep'],
    toolNames: ['NotebookLM', 'ChatGPT', 'Claude', 'Perplexity']
  },
  {
    key: 'email',
    label: 'for writing emails',
    keywords: ['email', 'emails', 'write email', 'write emails', 'writing email', 'writing emails', 'respond to email', 'inbox', 'outreach', 'cold email', 'reply'],
    toolNames: ['ChatGPT', 'Claude']
  },
  {
    key: 'no-code-app',
    label: 'for building without code',
    keywords: ['no code', 'nocode', 'no coding', 'without code', 'without coding', 'build an app', 'build a website', 'build an app without', 'make an app', 'make a website', 'app builder', 'website builder', 'landing page', 'mvp'],
    toolNames: ['Bolt.new', 'v0', 'Cursor', 'Canva Magic Studio']
  },
  {
    key: 'code',
    label: 'for coding',
    keywords: ['code', 'coding', 'programming', 'developer', 'software', 'debug', 'refactor', 'write code', 'react', 'python', 'bug'],
    toolNames: ['Cursor', 'OpenCode', 'GitHub Copilot', 'Claude']
  },
  {
    key: 'content',
    label: 'for writing content',
    keywords: ['write content', 'writing content', 'blog post', 'blog posts', 'blog', 'article', 'articles', 'draft', 'drafts', 'copywriting', 'copy', 'social media post', 'tweet', 'tweets', 'linkedin post', 'newsletter'],
    toolNames: ['ChatGPT', 'Claude']
  },
  {
    key: 'image-generation',
    label: 'for generating images',
    keywords: ['generate image', 'generate images', 'image generation', 'create images', 'create an image', 'art', 'poster', 'logo design', 'illustration', 'illustrations', 'wallpaper'],
    toolNames: ['Midjourney', 'Flux', 'Stable Diffusion', 'Canva Magic Studio']
  },
  {
    key: 'video',
    label: 'for video',
    keywords: ['video', 'videos', 'edit video', 'edit videos', 'video editing', 'short form', 'shorts', 'tiktok', 'reels', 'youtube', 'captions', 'subtitles', 'voiceover', 'film'],
    toolNames: ['CapCut', 'Descript', 'Canva Magic Studio', 'Runway']
  },
  {
    key: 'audio-music',
    label: 'for audio and music',
    keywords: ['music', 'song', 'songs', 'make music', 'generate music', 'audio', 'voice', 'voiceover', 'text to speech', 'tts', 'podcast', 'podcasts'],
    toolNames: ['Suno', 'Udio', 'ElevenLabs', 'Descript']
  },
  {
    key: 'research',
    label: 'for research',
    keywords: ['research', 'find information', 'source', 'sources', 'citations', 'answer questions', 'explain', 'learn about', 'investigate'],
    toolNames: ['Perplexity', 'ChatGPT', 'Claude']
  },
  {
    key: 'productivity',
    label: 'for getting things done',
    keywords: ['productivity', 'organize', 'organise', 'plan', 'planning', 'manage', 'management', 'todos', 'tasks', 'take notes', 'summarize', 'summarise', 'summary', 'summarizing', 'summarising'],
    toolNames: ['Notion AI', 'ChatGPT', 'Claude', 'NotebookLM']
  },
  {
    key: 'marketing',
    label: 'for marketing',
    keywords: ['marketing', 'ad', 'ads', 'advertising', 'campaign', 'seo', 'growth', 'social media', 'brand', 'branding'],
    toolNames: ['ChatGPT', 'Canva Magic Studio', 'Perplexity']
  },
  {
    key: 'business',
    label: 'for your business',
    keywords: ['business', 'startup', 'start a business', 'company', 'saas', 'product', 'entrepreneur'],
    toolNames: ['Bolt.new', 'v0', 'Supabase', 'Cursor']
  },
  {
    key: 'privacy-local',
    label: 'for running locally',
    keywords: ['local', 'locally', 'self hosted', 'self-hosted', 'privacy', 'private', 'offline', 'open source', 'open-source', 'no cloud', 'on my machine'],
    toolNames: ['Ollama', 'LM Studio', 'OpenCode', 'LangChain']
  },
  {
    key: 'data-pipeline',
    label: 'for data and automation',
    keywords: ['data', 'pipeline', 'pipelines', 'automation', 'automate', 'workflow', 'workflows', 'agent', 'agents', 'rag', 'embedding', 'embeddings', 'scraping', 'scrape', 'dataset', 'datasets'],
    toolNames: ['LangChain', 'LlamaIndex', 'Gradio', 'Hugging Face']
  },
  {
    key: 'writing-assistance',
    label: 'for writing and grammar',
    keywords: ['grammar', 'spelling', 'proofread', 'proofreading', 'write better', 'improve writing', 'writing help'],
    toolNames: ['Grammarly', 'LanguageTool', 'ChatGPT']
  },
  {
    key: 'translation',
    label: 'for translation',
    keywords: ['translate', 'translation', 'translator', 'translate to'],
    toolNames: ['ChatGPT', 'Claude', 'LanguageTool']
  },
  {
    key: 'image-editing',
    label: 'for image editing',
    keywords: ['edit image', 'edit images', 'photo editing', 'edit photos', 'remove background', 'background removal', 'upscale', 'upscaling', 'restore', 'product photo', 'product photos', 'headshot', 'headshots', 'retouch'],
    toolNames: ['Photoroom', 'Canva Magic Studio', 'Midjourney']
  },
  {
    key: 'transcription',
    label: 'for transcription',
    keywords: ['transcribe', 'transcription', 'transcript', 'audio to text', 'meeting notes', 'meetings', 'call notes'],
    toolNames: ['Whisper', 'Descript', 'NotebookLM']
  },
  {
    key: 'presentation',
    label: 'for presentations',
    keywords: ['presentation', 'presentations', 'slides', 'deck', 'decks', 'pitch', 'pitch deck', 'powerpoint', 'keynote'],
    toolNames: ['Canva Magic Studio', 'ChatGPT', 'Claude']
  }
];
