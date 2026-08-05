const mysql = require('mysql2/promise');
require('dotenv').config();

const TOOL_DETAILS = {
  'OpenCode': {
    pros: ['Free and open source', 'Runs fully in your terminal', 'Edits files and runs commands autonomously'],
    cons: ['Terminal-first, no pretty UI', 'Steeper learning curve than editors'],
    alternatives: ['Cursor', 'GitHub Copilot'],
    tutorial_url: 'https://opencode.ai/docs', is_new: 1, is_gem: 1, trending_rank: 1,
    keywords: ['open code', 'opencode', 'ai coding agent', 'terminal ai', 'cli ai', 'free coding assistant', 'local coding', 'open source copilot']
  },
  'Cursor': {
    pros: ['Best-in-class autocomplete', 'Understands your whole codebase', 'Great onboarding for beginners'],
    cons: ['Subscription cost adds up', 'Needs a modern machine'],
    alternatives: ['OpenCode', 'GitHub Copilot'],
    tutorial_url: 'https://docs.cursor.com', is_new: 0, is_gem: 0, trending_rank: 2,
    keywords: ['ai code editor', 'cursor ai', 'coding assistant', 'ai editor', 'write code faster', 'autocomplete code']
  },
  'GitHub Copilot': {
    pros: ['Embedded in GitHub and editors', 'Great for autocomplete', 'Works where you already work'],
    cons: ['Can suggest outdated patterns', 'Paid tiers for full features'],
    alternatives: ['Cursor', 'OpenCode'],
    tutorial_url: 'https://docs.github.com/en/copilot', is_new: 0, is_gem: 0, trending_rank: 0,
    keywords: ['copilot', 'github copilot', 'pair programmer', 'code autocomplete', 'pr assistant', 'github ai']
  },
  'Bolt.new': {
    pros: ['Full app from one prompt', 'No setup, runs in browser', 'Instant prototyping'],
    cons: ['Complex apps hit limits', 'Code quality varies for big projects'],
    alternatives: ['v0', 'Cursor'],
    tutorial_url: 'https://bolt.new/docs', is_new: 1, is_gem: 0, trending_rank: 3,
    keywords: ['make a website', 'build a website', 'create an app', 'prototype app', 'ai app builder', 'no code website', 'full stack ai', 'bolt new', 'react builder']
  },
  'v0': {
    pros: ['Beautiful React + Tailwind output', 'Iterate visually on UI', 'Easy for frontend prototypes'],
    cons: ['Frontend only', 'Needs cleanup for production'],
    alternatives: ['Bolt.new', 'Cursor'],
    tutorial_url: 'https://v0.dev/docs', is_new: 1, is_gem: 0, trending_rank: 0,
    keywords: ['make a website', 'build a ui', 'react component generator', 'tailwind generator', 'ui generator', 'frontend ai', 'v0', 'landing page generator']
  },
  'Supabase': {
    pros: ['Open source', 'Postgres + auth + storage included', 'Great for AI app backends'],
    cons: ['More setup than a managed API', 'SQL knowledge helps'],
    alternatives: ['Firebase', 'Neon'],
    tutorial_url: 'https://supabase.com/docs', is_new: 0, is_gem: 1, trending_rank: 0,
    keywords: ['database', 'backend', 'ai app database', 'postgres', 'auth', 'storage', 'vector database', 'supabase']
  },
  'Ollama': {
    pros: ['Free and private', 'One command to run models locally', 'Huge model library'],
    cons: ['Needs decent hardware', 'Big models are slow on CPU'],
    alternatives: ['LM Studio', 'llama.cpp'],
    tutorial_url: 'https://github.com/ollama/ollama', is_new: 0, is_gem: 1, trending_rank: 0,
    keywords: ['run models locally', 'local ai', 'offline ai', 'ollama', 'llama locally', 'private ai', 'no cloud ai', 'download llama']
  },
  'ChatGPT': {
    pros: ['The default, most complete assistant', 'Handles files, images, voice', 'Great free tier'],
    cons: ['Free tier can be slow at peak', 'Hallucinations need double-checking'],
    alternatives: ['Claude', 'Perplexity'],
    tutorial_url: 'https://help.openai.com', is_new: 0, is_gem: 0, trending_rank: 4,
    keywords: ['chatgpt', 'ai chatbot', 'ask ai', 'write an email', 'summary', 'summarize text', 'ai assistant', 'everyday ai', 'gpt']
  },
  'Claude': {
    pros: ['Superb at long-form writing', 'Excellent reasoning and coding', 'Long context window'],
    cons: ['Fewer integrations than ChatGPT', 'Higher-tier plans are pricey'],
    alternatives: ['ChatGPT', 'Gemini'],
    tutorial_url: 'https://docs.anthropic.com', is_new: 0, is_gem: 1, trending_rank: 5,
    keywords: ['claude', 'anthropic', 'long document', 'write essays', 'reasoning ai', 'careful writing', 'ai analysis', 'claude sonnet']
  },
  'Grammarly': {
    pros: ['Real-time grammar everywhere', 'Saves time on email polish', 'Easy for non-writers'],
    cons: ['AI features locked behind premium', 'Can be annoying with suggestions'],
    alternatives: ['LanguageTool', 'Hemingway'],
    tutorial_url: 'https://support.grammarly.com', is_new: 0, is_gem: 0, trending_rank: 0,
    keywords: ['grammar check', 'spell check', 'fix my writing', 'email writing', 'proofread', 'better english', 'grammarly']
  },
  'Notion AI': {
    pros: ['AI inside your notes and wiki', 'Answers questions over your docs', 'Great second brain'],
    cons: ['Notion AI needs paid plan', 'Output depends on well-organized notes'],
    alternatives: ['Obsidian', 'Mem'],
    tutorial_url: 'https://www.notion.so/help/guides', is_new: 0, is_gem: 0, trending_rank: 0,
    keywords: ['notes', 'second brain', 'knowledge base', 'wiki ai', 'summarize notes', 'notion ai', 'document assistant']
  },
  'Midjourney': {
    pros: ['Best aesthetic output', 'Huge creative community', 'Stunning results fast'],
    cons: ['Paid only', 'Discord-based workflow feels dated'],
    alternatives: ['Stable Diffusion', 'Flux'],
    tutorial_url: 'https://docs.midjourney.com', is_new: 0, is_gem: 0, trending_rank: 6,
    keywords: ['generate images', 'image generation', 'ai art', 'midjourney', 'create art', 'text to image', 'poster art', 'fantasy art']
  },
  'Stable Diffusion': {
    pros: ['Free and open source', 'Runs locally, fully private', 'Total control via fine-tuning'],
    cons: ['Setup is technical', 'Requires a good GPU for speed'],
    alternatives: ['Midjourney', 'Flux'],
    tutorial_url: 'https://stable-diffusion-art.com/tutorial/', is_new: 0, is_gem: 1, trending_rank: 0,
    keywords: ['stable diffusion', 'free image generation', 'local image gen', 'ai art free', 'comfyui', 'private image generation', 'txt2img']
  },
  'Canva Magic Studio': {
    pros: ['Easy for non-designers', 'Everything in one editor', 'Great templates'],
    cons: ['Not for professional print design', 'AI features limited on free tier'],
    alternatives: ['Figma', 'Adobe Express'],
    tutorial_url: 'https://www.canva.com/learn/', is_new: 1, is_gem: 0, trending_rank: 7,
    keywords: ['remove background', 'canva', 'design', 'poster', 'logo maker', 'social media post', 'thumbnail', 'presentation design', 'photo background remover', 'edit images online']
  },
  'Runway': {
    pros: ['Text-to-video that works', 'Built-in video editing tools', 'Studio features for pros'],
    cons: ['Credits run out fast', 'Short clips by default'],
    alternatives: ['Pika', 'CapCut'],
    tutorial_url: 'https://learn.runwayml.com', is_new: 1, is_gem: 0, trending_rank: 8,
    keywords: ['generate video', 'text to video', 'ai video', 'runway', 'create video clips', 'video generation', 'motion video']
  },
  'CapCut': {
    pros: ['Free and fast', 'Auto captions are excellent', 'Perfect for short-form'],
    cons: ['Watermark without subscription', 'Advanced AI needs paid'],
    alternatives: ['Descript', 'DaVinci Resolve'],
    tutorial_url: 'https://www.capcut.com/resource', is_new: 0, is_gem: 0, trending_rank: 9,
    keywords: ['edit video', 'video editor', 'add captions', 'short form video', 'tiktok editor', 'subtitle generator', 'capcut', 'reels editing']
  },
  'Whisper': {
    pros: ['Free and accurate', 'Open source', 'Works in dozens of languages'],
    cons: ['Command-line setup', 'Slow on CPU for long files'],
    alternatives: ['Otter.ai', 'Descript'],
    tutorial_url: 'https://github.com/openai/whisper', is_new: 0, is_gem: 1, trending_rank: 0,
    keywords: ['transcribe audio', 'speech to text', 'subtitles', 'transcription', 'whisper', 'audio to text', 'caption video', 'meeting notes transcription']
  },
  'ElevenLabs': {
    pros: ['Most realistic AI voices', 'Instant voice cloning', 'Great for narration'],
    cons: ['Credits are expensive', 'Free tier is very limited'],
    alternatives: ['Murf', 'PlayHT'],
    tutorial_url: 'https://elevenlabs.io/docs', is_new: 0, is_gem: 0, trending_rank: 0,
    keywords: ['text to speech', 'voice over', 'ai voice', 'voice cloning', 'narration', 'elevenlabs', 'realistic voice', 'audio book']
  },
  'NotebookLM': {
    pros: ['Answers grounded in YOUR sources', 'Free with Google account', 'Amazing for study notes'],
    cons: ['Limited to uploaded sources', 'Google-only ecosystem'],
    alternatives: ['ChatGPT', 'Perplexity'],
    tutorial_url: 'https://notebooklm.google.com', is_new: 1, is_gem: 1, trending_rank: 10,
    keywords: ['study', 'study notes', 'summarize pdf', 'pdf summary', 'learn from documents', 'notebooklm', 'google notebook', 'lecture notes', 'exam prep', 'research papers']
  },
  'Perplexity': {
    pros: ['Answers with citations', 'Great for research', 'Fast and reliable'],
    cons: ['Free tier limits deep research', 'Occasionally misreads sources'],
    alternatives: ['ChatGPT', 'Google AI Overviews'],
    tutorial_url: 'https://www.perplexity.ai/hub', is_new: 0, is_gem: 0, trending_rank: 11,
    keywords: ['research', 'search with ai', 'perplexity', 'citations', 'fact check', 'find sources', 'ai search engine', 'research assistant', 'deep research']
  },
  'Hugging Face': {
    pros: ['Every open model in one place', 'Free demos to try models', 'Huge community'],
    cons: ['Overwhelming for beginners', 'Quality varies across models'],
    alternatives: ['GitHub', 'Replicate'],
    tutorial_url: 'https://huggingface.co/docs', is_new: 0, is_gem: 0, trending_rank: 0,
    keywords: ['hugging face', 'ai models', 'download models', 'open models', 'model hub', 'try models', 'transformers', 'datasets']
  },
  'Gradio': {
    pros: ['Share a model demo in minutes', 'Free and open source', 'Beginner friendly for builders'],
    cons: ['Not for production apps', 'Python required'],
    alternatives: ['Streamlit', 'Replicate'],
    tutorial_url: 'https://www.gradio.app/guides', is_new: 0, is_gem: 1, trending_rank: 0,
    keywords: ['model demo', 'share ai demo', 'gradio', 'streamlit alternative', 'showcase model', 'ai demo app', 'prototype model ui']
  },
  'LangChain': {
    pros: ['Most popular LLM framework', 'Huge ecosystem of tools', 'Python and JS support'],
    cons: ['API churns quickly', 'Overkill for simple apps'],
    alternatives: ['LlamaIndex', 'Haystack'],
    tutorial_url: 'https://python.langchain.com/docs', is_new: 0, is_gem: 0, trending_rank: 0,
    keywords: ['llm framework', 'build ai pipeline', 'agents framework', 'langchain', 'rag', 'ai orchestration', 'llm app development']
  },
  'Suno': {
    pros: ['Full songs with vocals from text', 'Incredibly fun', 'Quick results'],
    cons: ['Song quality varies', 'Commercial terms need checking'],
    alternatives: ['Udio', 'AIVA'],
    tutorial_url: 'https://suno.com', is_new: 1, is_gem: 0, trending_rank: 12,
    keywords: ['make music', 'generate music', 'ai song', 'suno', 'text to music', 'create a song', 'music generator', 'ai beats']
  },
  'Gemini': {
    pros: ['Free and generous', 'Deeply integrated with Google apps', 'Handles images, video and files'],
    cons: ['Fewer extensions outside Google', 'Can feel generic for creative writing'],
    alternatives: ['ChatGPT', 'Claude'],
    tutorial_url: 'https://support.google.com/gemini', is_new: 0, is_gem: 0, trending_rank: 0,
    keywords: ['gemini', 'google ai', 'free ai assistant', 'gmail ai', 'google apps', 'gemini ai', 'google gemini', 'google assistant']
  },
  'Flux': {
    pros: ['Open weights, free to run', 'Near-Midjourney quality', 'Fast API option'],
    cons: ['Top quality needs a good GPU', 'Ecosystem smaller than Stable Diffusion'],
    alternatives: ['Stable Diffusion', 'Midjourney'],
    tutorial_url: 'https://huggingface.co/black-forest-labs/FLUX.1-dev', is_new: 1, is_gem: 1, trending_rank: 13,
    keywords: ['flux', 'flux model', 'open image model', 'text to image free', 'image generator', 'black forest labs', 'midjourney alternative']
  },
  'LM Studio': {
    pros: ['Point-and-click local models', 'No command line needed', 'Chat and API mode built in'],
    cons: ['Large models need plenty of RAM', 'Fewer advanced knobs than raw llama.cpp'],
    alternatives: ['Ollama', 'llama.cpp'],
    tutorial_url: 'https://lmstudio.ai/docs', is_new: 0, is_gem: 1, trending_rank: 0,
    keywords: ['lm studio', 'run models locally', 'local ai gui', 'download models', 'offline chat', 'local llm app', 'run gpt locally']
  },
  'Descript': {
    pros: ['Edit video by editing text', 'Overdub fixes flubs instantly', 'Great for podcasts'],
    cons: ['Expensive for heavy use', 'Long videos get pricey'],
    alternatives: ['CapCut', 'DaVinci Resolve'],
    tutorial_url: 'https://help.descript.com', is_new: 1, is_gem: 0, trending_rank: 0,
    keywords: ['edit video', 'podcast editing', 'transcript editing', 'remove filler words', 'descript', 'audio editor', 'screen recording', 'studio sound']
  },
  'Figma': {
    pros: ['Industry-standard UI design', 'Real-time collaboration', 'AI helps turn designs into layouts'],
    cons: ['Overkill for simple graphics', 'Pro features cost money'],
    alternatives: ['Canva Magic Studio', 'Framer'],
    tutorial_url: 'https://help.figma.com', is_new: 0, is_gem: 0, trending_rank: 0,
    keywords: ['figma', 'ui design', 'prototyping', 'design tool', 'wireframe', 'product design', 'collaboration design']
  },
  'LlamaIndex': {
    pros: ['Best-in-class RAG tooling', 'Connects LLMs to your data', 'Large ecosystem'],
    cons: ['Python required', 'Steeper learning curve'],
    alternatives: ['LangChain', 'Haystack'],
    tutorial_url: 'https://docs.llamaindex.ai', is_new: 0, is_gem: 1, trending_rank: 0,
    keywords: ['rag', 'llamaindex', 'document qa', 'search your docs', 'vector search', 'llm data framework', 'knowledge base ai']
  },
  'Udio': {
    pros: ['Full songs with vocals', 'Fine control over style', 'Great remixing tools'],
    cons: ['Quality varies by genre', 'Free credits run out'],
    alternatives: ['Suno', 'AIVA'],
    tutorial_url: 'https://www.udio.com/help', is_new: 1, is_gem: 1, trending_rank: 0,
    keywords: ['make music', 'generate music', 'ai song', 'udio', 'music generator', 'create a song', 'ai music', 'vocal songs']
  },
  'LanguageTool': {
    pros: ['Free core grammar checking', 'Supports 30+ languages', 'Open source'],
    cons: ['AI rewrite needs premium', 'Can miss context-specific errors'],
    alternatives: ['Grammarly', 'Hemingway'],
    tutorial_url: 'https://languagetool.org/help', is_new: 0, is_gem: 1, trending_rank: 0,
    keywords: ['grammar check', 'spell check', 'languagetool', 'free grammar checker', 'proofread', 'fix writing', 'multilingual checker']
  },
  'Photoroom': {
    pros: ['One-tap background removal', 'Studio product photos from a phone', 'Made for sellers'],
    cons: ['Best features need paid plan', 'Not a full design suite'],
    alternatives: ['Canva Magic Studio', 'Stable Diffusion'],
    tutorial_url: 'https://help.photoroom.com', is_new: 1, is_gem: 0, trending_rank: 0,
    keywords: ['remove background', 'background remover', 'product photo', 'photoroom', 'ecommerce photo', 'studio photo', 'passport photo']
  }
};

const MODELS = [
  {
    name: 'Llama 3.1 405B', provider: 'Meta', description: 'Meta\'s flagship open model. One of the strongest open-weight LLMs for general reasoning and coding.', url: 'https://huggingface.co/meta-llama/Llama-3.1-405B', image_url: '', framework: 'Transformers', license: 'Llama 3.1',
    parameters: '405B', downloads: 2800000, likes: 32000, best_for: 'Open-weight model closest to frontier quality', runs_locally: 1, requires_gpu: 1, is_free: 1, has_api: 1, on_openrouter: 1,
    alternatives: ['DeepSeek-V3', 'Qwen 2.5']
  },
  {
    name: 'Llama 3.1 8B', provider: 'Meta', description: 'Small, fast and free. The go-to model to run on a laptop for chat and simple tasks.', url: 'https://huggingface.co/meta-llama/Llama-3.1-8B', image_url: '', framework: 'Transformers', license: 'Llama 3.1',
    parameters: '8B', downloads: 1900000, likes: 21000, best_for: 'Runs on a laptop — great for local experiments', runs_locally: 1, requires_gpu: 0, is_free: 1, has_api: 1, on_openrouter: 1,
    alternatives: ['Gemma 3', 'Phi-4']
  },
  {
    name: 'Mistral Large 2', provider: 'Mistral AI', description: 'A big European open model with strong multilingual and coding skills.', url: 'https://huggingface.co/mistralai/Mistral-Large', image_url: '', framework: 'Transformers', license: 'Apache 2.0',
    parameters: '123B', downloads: 350000, likes: 6000, best_for: 'Strong open alternative for code and many languages', runs_locally: 1, requires_gpu: 1, is_free: 1, has_api: 1, on_openrouter: 1,
    alternatives: ['DeepSeek-V3', 'Llama 3.1 405B']
  },
  {
    name: 'Gemma 2 27B', provider: 'Google', description: 'Google\'s open model, surprisingly capable for its size and great on a single GPU.', url: 'https://huggingface.co/google/gemma-2-27b', image_url: '', framework: 'Transformers', license: 'Gemma',
    parameters: '27B', downloads: 900000, likes: 15000, best_for: 'Great quality-per-GPU ratio', runs_locally: 1, requires_gpu: 1, is_free: 1, has_api: 1, on_openrouter: 1,
    alternatives: ['Gemma 3', 'Phi-4']
  },
  {
    name: 'GPT-4o', provider: 'OpenAI', description: 'OpenAI\'s fast all-rounder — text, images and audio in one model. What ChatGPT uses.', url: 'https://platform.openai.com', image_url: '', framework: 'API', license: 'Proprietary',
    parameters: '—', downloads: 0, likes: 0, best_for: 'Best all-in-one model via API or ChatGPT', runs_locally: 0, requires_gpu: 0, is_free: 0, has_api: 1, on_openrouter: 1,
    alternatives: ['Claude Sonnet', 'DeepSeek-V3']
  },
  {
    name: 'Claude Sonnet', provider: 'Anthropic', description: 'Anthropic\'s workhorse model — excellent at writing, reasoning and coding.', url: 'https://anthropic.com', image_url: '', framework: 'API', license: 'Proprietary',
    parameters: '—', downloads: 0, likes: 0, best_for: 'Best for careful writing and complex reasoning', runs_locally: 0, requires_gpu: 0, is_free: 0, has_api: 1, on_openrouter: 1,
    alternatives: ['GPT-4o', 'DeepSeek-V3']
  },
  {
    name: 'DeepSeek-V3', provider: 'DeepSeek', description: 'Frontier-level performance at a fraction of the price. Hugely popular open-weight model.', url: 'https://huggingface.co/deepseek-ai/DeepSeek-V3', image_url: '', framework: 'Transformers', license: 'MIT',
    parameters: '671B', downloads: 800000, likes: 19000, best_for: 'Cutting-edge open model without the price tag', runs_locally: 1, requires_gpu: 1, is_free: 1, has_api: 1, on_openrouter: 1,
    alternatives: ['Qwen 2.5', 'Llama 3.1 405B']
  },
  {
    name: 'Qwen 2.5', provider: 'Alibaba', description: 'A family of strong open models from small to massive. Great multilingual support.', url: 'https://huggingface.co/Qwen/Qwen2.5-72B', image_url: '', framework: 'Transformers', license: 'Apache 2.0',
    parameters: '72B', downloads: 1200000, likes: 22000, best_for: 'Flexible open models for almost any task', runs_locally: 1, requires_gpu: 1, is_free: 1, has_api: 1, on_openrouter: 1,
    alternatives: ['DeepSeek-V3', 'Llama 3.1 8B']
  },
  {
    name: 'FLUX.1', provider: 'Black Forest Labs', description: 'The open image model that finally rivals Midjourney — from the Stable Diffusion team.', url: 'https://huggingface.co/black-forest-labs/FLUX.1-dev', image_url: '', framework: 'Diffusers', license: 'FLUX.1 Dev',
    parameters: '12B', downloads: 1100000, likes: 28000, best_for: 'Best free open model for high-quality images', runs_locally: 1, requires_gpu: 1, is_free: 1, has_api: 1, on_openrouter: 0,
    alternatives: ['Stable Diffusion XL']
  },
  {
    name: 'Phi-4', provider: 'Microsoft', description: 'A small, sharp reasoning model from Microsoft that punches way above its size.', url: 'https://huggingface.co/microsoft/phi-4', image_url: '', framework: 'Transformers', license: 'MIT',
    parameters: '14B', downloads: 700000, likes: 14000, best_for: 'Smart small model for laptops and edge devices', runs_locally: 1, requires_gpu: 0, is_free: 1, has_api: 1, on_openrouter: 1,
    alternatives: ['Gemma 3', 'Llama 3.1 8B']
  },
  {
    name: 'Gemma 3', provider: 'Google', description: 'Google\'s latest open model family — multimodal and strong for its size.', url: 'https://huggingface.co/google/gemma-3-27b-it', image_url: '', framework: 'Transformers', license: 'Gemma',
    parameters: '27B', downloads: 1500000, likes: 26000, best_for: 'Best new open all-rounder for one GPU', runs_locally: 1, requires_gpu: 1, is_free: 1, has_api: 1, on_openrouter: 1,
    alternatives: ['Phi-4', 'Llama 3.1 8B']
  },
  {
    name: 'DeepSeek-R1', provider: 'DeepSeek', description: 'The open reasoning model that showed frontier-style thinking for a fraction of the price.', url: 'https://huggingface.co/deepseek-ai/DeepSeek-R1', image_url: '', framework: 'Transformers', license: 'MIT',
    parameters: '671B', downloads: 1000000, likes: 24000, best_for: 'Open model that thinks step-by-step', runs_locally: 1, requires_gpu: 1, is_free: 1, has_api: 1, on_openrouter: 1,
    alternatives: ['DeepSeek-V3', 'Qwen 2.5']
  },
  {
    name: 'Whisper Large-v3', provider: 'OpenAI', description: 'OpenAI\'s best open speech-to-text model. Transcribe audio to text with high accuracy.', url: 'https://huggingface.co/openai/whisper-large-v3', image_url: '', framework: 'Transformers', license: 'MIT',
    parameters: '1.5B', downloads: 1600000, likes: 25000, best_for: 'Free, accurate transcription and subtitles', runs_locally: 1, requires_gpu: 0, is_free: 1, has_api: 1, on_openrouter: 1,
    alternatives: ['faster-whisper', 'Vosk']
  },
  {
    name: 'Stable Diffusion XL', provider: 'Stability AI', description: 'The open image generation model everyone fine-tunes. Great quality, huge ecosystem.', url: 'https://huggingface.co/stabilityai/stable-diffusion-xl-base-1.0', image_url: '', framework: 'Diffusers', license: 'Stability AI Community',
    parameters: '3.5B', downloads: 3200000, likes: 34000, best_for: 'Free, highly customizable image generation', runs_locally: 1, requires_gpu: 1, is_free: 1, has_api: 1, on_openrouter: 1,
    alternatives: ['FLUX.1']
  }
];

const NEWS = [
  {
    title: 'OpenAI Opens GPT-5.6 to Everyone', source: 'CNBC', author: 'Editorial', url: 'https://www.cnbc.com/2026/07/08/openai-expanding-gpt-5point6-ai-model-release-ending-government-limits.html', image_url: '', published_at: '2026-07-08',
    summary: 'OpenAI is making GPT-5.6 publicly available and rolling out its new Live voice AI models to ChatGPT users around the globe.',
    why_it_matters: 'The newest flagship is no longer exclusive to paid tiers — access for everyone means every product built on OpenAI gets smarter overnight, and Live voice points to where assistants are headed.',
    who_benefits: 'Anyone using ChatGPT, developers building on the OpenAI API, and builders shipping AI features.',
    tools_to_try: 'ChatGPT, Claude, Perplexity',
    reading_time: 2
  },
  {
    title: 'Open-Source LLMs Now Beat GPT-4-Class Models', source: 'Techsy', author: 'Editorial', url: 'https://techsy.io/en/blog/best-open-source-llms-2026', image_url: '', published_at: '2026-07-05',
    summary: 'A July 2026 benchmark roundup finds several open-weight models — led by Qwen 3 — now match or beat GPT-4-class performance on coding and math.',
    why_it_matters: 'Open models keep closing the gap. That means frontier-level AI you can run yourself, freely and privately, instead of paying per token.',
    who_benefits: 'Developers who want control, privacy-conscious users, and anyone tired of subscription lock-in.',
    tools_to_try: 'Ollama, Hugging Face, DeepSeek-V3, OpenCode',
    reading_time: 3
  },
  {
    title: 'EU Starts Enforcing AI Act Transparency Rules', source: 'European Commission', author: 'Editorial', url: 'https://digital-strategy.ec.europa.eu/en/news/commission-starts-enforcing-ai-act-rules-and-new-transparency-requirements-2-august', image_url: '', published_at: '2026-07-31',
    summary: 'From 2 August, chatbots must tell users they are AI and AI-generated content must be labelled — the EU AI Act rules are now being enforced.',
    why_it_matters: 'If you ship an AI feature, you need to know whether it needs a disclosure label or human-in-the-loop review. Ignorance is no longer an excuse.',
    who_benefits: 'Startups, SaaS builders, and anyone launching consumer-facing AI tools.',
    tools_to_try: 'OpenCode, LangChain, Perplexity',
    reading_time: 4
  },
  {
    title: 'AI Video Tools Just Got a Massive Upgrade', source: 'TechWeek', author: 'Editorial', url: 'https://techweek.com/ai-video-generation-2026-guide-sora-veo-kling-runway/', image_url: '', published_at: '2026-07-16',
    summary: 'Leading video models now generate native HD and 4K clips with consistent characters, synchronized audio, and longer multi-shot sequences.',
    why_it_matters: 'Short-form creators can now produce full scenes instead of 4-second clips, which changes what is realistic for solo creators.',
    who_benefits: 'Video editors, TikTok/Reels creators, and small marketing teams.',
    tools_to_try: 'Runway, CapCut, Suno',
    reading_time: 2
  }
];

const COLLECTIONS = [
  { slug: 'students', title: 'Best AI for Students', description: 'Learn faster, summarize lectures, and prep for exams.', icon: 'pi-graduation-cap', color: '#6366f1', tool_names: ['NotebookLM', 'ChatGPT', 'Perplexity', 'Whisper', 'Claude'] },
  { slug: 'developers', title: 'Best AI for Developers', description: 'Code faster and ship apps with the tools pros actually use.', icon: 'pi-code', color: '#22c55e', tool_names: ['OpenCode', 'Cursor', 'GitHub Copilot', 'Supabase', 'Bolt.new', 'v0', 'Ollama', 'LangChain', 'Gradio', 'Hugging Face', 'Claude', 'Figma', 'Gemini', 'LlamaIndex'] },
  { slug: 'free-ai', title: 'Best Free AI', description: 'Zero cost, no credit card. The best free tools that hold up.', icon: 'pi-gift', color: '#f59e0b', tool_names: ['OpenCode', 'Stable Diffusion', 'Whisper', 'NotebookLM', 'Ollama', 'Gradio', 'LangChain', 'ChatGPT', 'Perplexity', 'LM Studio', 'LanguageTool', 'Flux'] },
  { slug: 'agents', title: 'Best AI Agents', description: 'AI that does the work for you, not just chats.', icon: 'pi-robot', color: '#a855f7', tool_names: ['OpenCode', 'LangChain', 'LlamaIndex', 'Claude', 'ChatGPT', 'Bolt.new'] },
  { slug: 'replace-photoshop', title: 'Replace Photoshop', description: 'Edit images and design without the subscription.', icon: 'pi-image', color: '#0ea5e9', tool_names: ['Stable Diffusion', 'Canva Magic Studio', 'Midjourney', 'Photoroom', 'Flux'] },
  { slug: 'replace-canva', title: 'Replace Canva', description: 'Design posts and thumbnails with AI doing the heavy lifting.', icon: 'pi-palette', color: '#ec4899', tool_names: ['Canva Magic Studio', 'Midjourney', 'Stable Diffusion', 'Photoroom'] },
  { slug: 'replace-excel', title: 'Replace Excel', description: 'Analyze data and clean up spreadsheets with plain English.', icon: 'pi-table', color: '#10b981', tool_names: ['ChatGPT', 'Claude', 'NotebookLM', 'Perplexity'] },
  { slug: 'replace-google', title: 'Replace Google', description: 'Find answers with citations instead of scrolling links.', icon: 'pi-search', color: '#6366f1', tool_names: ['Perplexity', 'ChatGPT', 'NotebookLM', 'Gemini'] }
];

async function main() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'ai_compass'
  });

  try {
    const hasColumn = async (table, column) => {
      const [cols] = await pool.query('SHOW COLUMNS FROM ' + table);
      return cols.map(c => c.Field).includes(column);
    };

    console.log('> tools enrichment columns...');
    for (const [col, ddl] of [
      ['pros', 'TEXT DEFAULT NULL'],
      ['cons', 'TEXT DEFAULT NULL'],
      ['alternatives', 'VARCHAR(300) DEFAULT NULL'],
      ['tutorial_url', 'VARCHAR(1024) DEFAULT NULL'],
      ['is_new', 'TINYINT(1) DEFAULT 0'],
      ['is_gem', 'TINYINT(1) DEFAULT 0'],
      ['trending_rank', 'INT DEFAULT NULL']
    ]) {
      if (!(await hasColumn('tools', col))) await pool.query(`ALTER TABLE tools ADD COLUMN ${col} ${ddl}`);
    }

    console.log('> tool_keywords table...');
    await pool.query(`CREATE TABLE IF NOT EXISTS tool_keywords (
      id INT AUTO_INCREMENT PRIMARY KEY,
      tool_id INT NOT NULL,
      keyword VARCHAR(100) NOT NULL,
      KEY idx_tool (tool_id),
      KEY idx_keyword (keyword)
    )`);

    console.log('> ai_models enrichment columns...');
    for (const [col, ddl] of [
      ['best_for', 'VARCHAR(255) DEFAULT NULL'],
      ['runs_locally', 'TINYINT(1) DEFAULT 0'],
      ['requires_gpu', 'TINYINT(1) DEFAULT 0'],
      ['is_free', 'TINYINT(1) DEFAULT 1'],
      ['has_api', 'TINYINT(1) DEFAULT 0'],
      ['on_openrouter', 'TINYINT(1) DEFAULT 0'],
      ['alternatives', 'VARCHAR(300) DEFAULT NULL']
    ]) {
      if (!(await hasColumn('ai_models', col))) await pool.query(`ALTER TABLE ai_models ADD COLUMN ${col} ${ddl}`);
    }

    console.log('> news enrichment columns...');
    for (const [col, ddl] of [
      ['why_it_matters', 'TEXT DEFAULT NULL'],
      ['who_benefits', 'VARCHAR(300) DEFAULT NULL'],
      ['tools_to_try', 'VARCHAR(300) DEFAULT NULL'],
      ['reading_time', 'INT DEFAULT 3']
    ]) {
      if (!(await hasColumn('news', col))) await pool.query(`ALTER TABLE news ADD COLUMN ${col} ${ddl}`);
    }

    console.log('> saves folder column...');
    if (!(await hasColumn('saves', 'folder'))) await pool.query("ALTER TABLE saves ADD COLUMN folder VARCHAR(60) DEFAULT 'Unsorted'");

    console.log('> saves expiry column...');
    if (!(await hasColumn('saves', 'expires_at'))) await pool.query("ALTER TABLE saves ADD COLUMN expires_at TIMESTAMP NULL DEFAULT NULL");
    await pool.query("UPDATE saves SET expires_at = DATE_ADD(created_at, INTERVAL 7 DAY) WHERE expires_at IS NULL");

    console.log('> collections tables...');
    await pool.query(`CREATE TABLE IF NOT EXISTS collections (
      id INT AUTO_INCREMENT PRIMARY KEY,
      slug VARCHAR(80) NOT NULL UNIQUE,
      title VARCHAR(120) NOT NULL,
      description VARCHAR(300) DEFAULT NULL,
      icon VARCHAR(50) DEFAULT NULL,
      color VARCHAR(20) DEFAULT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);
    await pool.query(`CREATE TABLE IF NOT EXISTS collection_tools (
      collection_id INT NOT NULL,
      tool_id INT NOT NULL,
      sort_order INT DEFAULT 0,
      PRIMARY KEY (collection_id, tool_id),
      FOREIGN KEY (collection_id) REFERENCES collections(id) ON DELETE CASCADE,
      FOREIGN KEY (tool_id) REFERENCES tools(id) ON DELETE CASCADE
    )`);

    console.log('> enrich tools + keywords...');
    const [tools] = await pool.query('SELECT id, name FROM tools');
    const toolIdByName = {};
    tools.forEach(t => toolIdByName[t.name] = t.id);

    for (const [name, d] of Object.entries(TOOL_DETAILS)) {
      const toolId = toolIdByName[name];
      if (!toolId) continue;
      await pool.query(
        'UPDATE tools SET pros = ?, cons = ?, alternatives = ?, tutorial_url = ?, is_new = ?, is_gem = ?, trending_rank = ? WHERE id = ?',
        [JSON.stringify(d.pros), JSON.stringify(d.cons), JSON.stringify(d.alternatives), d.tutorial_url, d.is_new, d.is_gem, d.trending_rank, toolId]
      );
      await pool.query('DELETE FROM tool_keywords WHERE tool_id = ?', [toolId]);
      for (const kw of d.keywords) {
        await pool.query('INSERT INTO tool_keywords (tool_id, keyword) VALUES (?, ?)', [toolId, kw.toLowerCase()]);
      }
    }

    console.log('> seed models...');
    for (const m of MODELS) {
      const [existing] = await pool.query('SELECT id FROM ai_models WHERE name = ?', [m.name]);
      if (existing.length > 0) {
        await pool.query(
          'UPDATE ai_models SET provider = ?, description = ?, url = ?, framework = ?, license = ?, parameters = ?, downloads = ?, likes = ?, best_for = ?, runs_locally = ?, requires_gpu = ?, is_free = ?, has_api = ?, on_openrouter = ?, alternatives = ? WHERE id = ?',
          [m.provider, m.description, m.url, m.framework, m.license, m.parameters, m.downloads, m.likes, m.best_for, m.runs_locally, m.requires_gpu, m.is_free, m.has_api, m.on_openrouter, JSON.stringify(m.alternatives || []), existing[0].id]
        );
      } else {
        await pool.query(
          'INSERT INTO ai_models (name, provider, description, url, image_url, framework, license, parameters, downloads, likes, best_for, runs_locally, requires_gpu, is_free, has_api, on_openrouter, alternatives) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [m.name, m.provider, m.description, m.url, m.image_url, m.framework, m.license, m.parameters, m.downloads, m.likes, m.best_for, m.runs_locally, m.requires_gpu, m.is_free, m.has_api, m.on_openrouter, JSON.stringify(m.alternatives || [])]
        );
      }
    }

    console.log('> seed news explainer...');
    for (const n of NEWS) {
      const [existing] = await pool.query('SELECT id FROM news WHERE title = ?', [n.title]);
      if (existing.length > 0) {
        await pool.query(
          'UPDATE news SET summary = ?, why_it_matters = ?, who_benefits = ?, tools_to_try = ?, reading_time = ?, published_at = ?, url = ?, source = ?, author = ? WHERE id = ?',
          [n.summary, n.why_it_matters, n.who_benefits, n.tools_to_try, n.reading_time, n.published_at, n.url, n.source, n.author, existing[0].id]
        );
      } else {
        await pool.query(
          'INSERT INTO news (title, summary, content, url, image_url, source, author, published_at, why_it_matters, who_benefits, tools_to_try, reading_time) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [n.title, n.summary, n.summary, n.url, n.image_url, n.source, n.author, n.published_at, n.why_it_matters, n.who_benefits, n.tools_to_try, n.reading_time]
        );
      }
    }

    console.log('> seed collections...');
    for (const c of COLLECTIONS) {
      const [existing] = await pool.query('SELECT id FROM collections WHERE slug = ?', [c.slug]);
      let collectionId;
      if (existing.length > 0) {
        collectionId = existing[0].id;
        await pool.query('UPDATE collections SET title = ?, description = ?, icon = ?, color = ? WHERE id = ?', [c.title, c.description, c.icon, c.color, collectionId]);
      } else {
        const [res] = await pool.query('INSERT INTO collections (slug, title, description, icon, color) VALUES (?, ?, ?, ?, ?)', [c.slug, c.title, c.description, c.icon, c.color]);
        collectionId = res.insertId;
      }
      await pool.query('DELETE FROM collection_tools WHERE collection_id = ?', [collectionId]);
      for (const [i, name] of c.tool_names.entries()) {
        if (toolIdByName[name]) {
          await pool.query('INSERT INTO collection_tools (collection_id, tool_id, sort_order) VALUES (?, ?, ?)', [collectionId, toolIdByName[name], i]);
        }
      }
    }

    console.log('Done.');
  } catch (err) {
    console.error('Redesign migration failed:', err.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

main();
