-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: localhost    Database: ai_compass
-- ------------------------------------------------------
-- Server version	8.0.46

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `ai_models`
--

DROP TABLE IF EXISTS `ai_models`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ai_models` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `provider` varchar(255) DEFAULT NULL,
  `description` text,
  `url` varchar(1024) DEFAULT NULL,
  `image_url` varchar(1024) DEFAULT NULL,
  `framework` varchar(100) DEFAULT NULL,
  `license` varchar(100) DEFAULT NULL,
  `parameters` varchar(100) DEFAULT NULL,
  `downloads` int DEFAULT '0',
  `likes` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `best_for` varchar(255) DEFAULT NULL,
  `runs_locally` tinyint(1) DEFAULT '0',
  `requires_gpu` tinyint(1) DEFAULT '0',
  `is_free` tinyint(1) DEFAULT '1',
  `has_api` tinyint(1) DEFAULT '0',
  `on_openrouter` tinyint(1) DEFAULT '0',
  `alternatives` varchar(300) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ai_models`
--

LOCK TABLES `ai_models` WRITE;
/*!40000 ALTER TABLE `ai_models` DISABLE KEYS */;
INSERT INTO `ai_models` VALUES (1,'Llama 3.1 405B','Meta','Meta\'s flagship open model. One of the strongest open-weight LLMs for general reasoning and coding.','https://huggingface.co/meta-llama/Llama-3.1-405B',NULL,'Transformers','Llama 3.1','405B',2800000,32000,'2026-07-30 11:22:37','2026-08-01 12:34:50','Open-weight model closest to frontier quality',1,1,1,1,1,'[\"DeepSeek-V3\",\"Qwen 2.5\"]'),(2,'Mistral Large 2','Mistral AI','A big European open model with strong multilingual and coding skills.','https://huggingface.co/mistralai/Mistral-Large',NULL,'Transformers','Apache 2.0','123B',350000,6000,'2026-07-30 11:22:37','2026-08-01 12:34:50','Strong open alternative for code and many languages',1,1,1,1,1,'[\"DeepSeek-V3\",\"Llama 3.1 405B\"]'),(3,'Gemma 2 27B','Google','Google\'s open model, surprisingly capable for its size and great on a single GPU.','https://huggingface.co/google/gemma-2-27b',NULL,'Transformers','Gemma','27B',900000,15000,'2026-07-30 11:22:37','2026-08-01 12:34:50','Great quality-per-GPU ratio',1,1,1,1,1,'[\"Gemma 3\",\"Phi-4\"]'),(4,'Llama 3.1 8B','Meta','Small, fast and free. The go-to model to run on a laptop for chat and simple tasks.','https://huggingface.co/meta-llama/Llama-3.1-8B','','Transformers','Llama 3.1','8B',1900000,21000,'2026-08-01 06:17:11','2026-08-01 12:34:50','Runs on a laptop — great for local experiments',1,0,1,1,1,'[\"Gemma 3\",\"Phi-4\"]'),(5,'GPT-4o','OpenAI','OpenAI\'s fast all-rounder — text, images and audio in one model. What ChatGPT uses.','https://platform.openai.com','','API','Proprietary','—',0,0,'2026-08-01 06:17:11','2026-08-01 12:34:50','Best all-in-one model via API or ChatGPT',0,0,0,1,1,'[\"Claude Sonnet\",\"DeepSeek-V3\"]'),(6,'Claude Sonnet','Anthropic','Anthropic\'s workhorse model — excellent at writing, reasoning and coding.','https://anthropic.com','','API','Proprietary','—',0,0,'2026-08-01 06:17:11','2026-08-01 12:34:50','Best for careful writing and complex reasoning',0,0,0,1,1,'[\"GPT-4o\",\"DeepSeek-V3\"]'),(7,'DeepSeek-V3','DeepSeek','Frontier-level performance at a fraction of the price. Hugely popular open-weight model.','https://huggingface.co/deepseek-ai/DeepSeek-V3','','Transformers','MIT','671B',800000,19000,'2026-08-01 06:17:11','2026-08-01 12:34:50','Cutting-edge open model without the price tag',1,1,1,1,1,'[\"Qwen 2.5\",\"Llama 3.1 405B\"]'),(8,'Qwen 2.5','Alibaba','A family of strong open models from small to massive. Great multilingual support.','https://huggingface.co/Qwen/Qwen2.5-72B','','Transformers','Apache 2.0','72B',1200000,22000,'2026-08-01 06:17:11','2026-08-01 12:34:50','Flexible open models for almost any task',1,1,1,1,1,'[\"DeepSeek-V3\",\"Llama 3.1 8B\"]'),(9,'FLUX.1','Black Forest Labs','The open image model that finally rivals Midjourney — from the Stable Diffusion team.','https://huggingface.co/black-forest-labs/FLUX.1-dev','','Diffusers','FLUX.1 Dev','12B',1100000,28000,'2026-08-01 06:17:11','2026-08-01 12:34:50','Best free open model for high-quality images',1,1,1,1,0,'[\"Stable Diffusion XL\"]'),(10,'Phi-4','Microsoft','A small, sharp reasoning model from Microsoft that punches way above its size.','https://huggingface.co/microsoft/phi-4','','Transformers','MIT','14B',700000,14000,'2026-08-01 12:34:50','2026-08-01 12:34:50','Smart small model for laptops and edge devices',1,0,1,1,1,'[\"Gemma 3\",\"Llama 3.1 8B\"]'),(11,'Gemma 3','Google','Google\'s latest open model family — multimodal and strong for its size.','https://huggingface.co/google/gemma-3-27b-it','','Transformers','Gemma','27B',1500000,26000,'2026-08-01 12:34:50','2026-08-01 12:34:50','Best new open all-rounder for one GPU',1,1,1,1,1,'[\"Phi-4\",\"Llama 3.1 8B\"]'),(12,'DeepSeek-R1','DeepSeek','The open reasoning model that showed frontier-style thinking for a fraction of the price.','https://huggingface.co/deepseek-ai/DeepSeek-R1','','Transformers','MIT','671B',1000000,24000,'2026-08-01 12:34:50','2026-08-01 12:34:50','Open model that thinks step-by-step',1,1,1,1,1,'[\"DeepSeek-V3\",\"Qwen 2.5\"]'),(13,'Whisper Large-v3','OpenAI','OpenAI\'s best open speech-to-text model. Transcribe audio to text with high accuracy.','https://huggingface.co/openai/whisper-large-v3','','Transformers','MIT','1.5B',1600000,25000,'2026-08-01 12:34:50','2026-08-01 17:07:05','Free, accurate transcription and subtitles',1,0,1,1,1,'[\"faster-whisper\",\"Vosk\"]'),(14,'Stable Diffusion XL','Stability AI','The open image generation model everyone fine-tunes. Great quality, huge ecosystem.','https://huggingface.co/stabilityai/stable-diffusion-xl-base-1.0','','Diffusers','Stability AI Community','3.5B',3200000,34000,'2026-08-01 12:34:50','2026-08-01 12:34:50','Free, highly customizable image generation',1,1,1,1,1,'[\"FLUX.1\"]');
/*!40000 ALTER TABLE `ai_models` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `slug` varchar(100) NOT NULL,
  `description` text,
  `icon` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'AI News','ai-news','Latest news and developments in artificial intelligence','pi pi-calendar','2026-07-30 11:22:37'),(2,'AI Models','ai-models','New and trending AI models from various providers','pi pi-database','2026-07-30 11:22:37'),(3,'AI Tools','ai-tools','Software tools powered by artificial intelligence','pi pi-wrench','2026-07-30 11:22:37'),(4,'GitHub Repos','github-repos','Popular AI-related GitHub repositories','pi pi-github','2026-07-30 11:22:37'),(5,'Tutorials','tutorials','Guides and tutorials for learning AI','pi pi-book','2026-07-30 11:22:37'),(6,'AI Videos','ai-videos','Video content about artificial intelligence','pi pi-video','2026-07-30 11:22:37');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `collection_tools`
--

DROP TABLE IF EXISTS `collection_tools`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `collection_tools` (
  `collection_id` int NOT NULL,
  `tool_id` int NOT NULL,
  `sort_order` int DEFAULT '0',
  PRIMARY KEY (`collection_id`,`tool_id`),
  KEY `tool_id` (`tool_id`),
  CONSTRAINT `collection_tools_ibfk_1` FOREIGN KEY (`collection_id`) REFERENCES `collections` (`id`) ON DELETE CASCADE,
  CONSTRAINT `collection_tools_ibfk_2` FOREIGN KEY (`tool_id`) REFERENCES `tools` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `collection_tools`
--

LOCK TABLES `collection_tools` WRITE;
/*!40000 ALTER TABLE `collection_tools` DISABLE KEYS */;
INSERT INTO `collection_tools` VALUES (1,1,1),(1,11,4),(1,18,3),(1,20,0),(1,21,2),(2,3,2),(2,4,9),(2,5,0),(2,6,1),(2,7,4),(2,8,5),(2,9,3),(2,10,6),(2,11,10),(2,22,8),(2,23,7),(2,25,12),(2,29,11),(2,30,13),(3,1,7),(3,5,0),(3,10,4),(3,14,1),(3,18,2),(3,20,3),(3,21,8),(3,22,5),(3,23,6),(3,26,11),(3,27,9),(3,32,10),(4,1,4),(4,5,0),(4,7,5),(4,11,3),(4,23,1),(4,30,2),(5,2,2),(5,14,0),(5,15,1),(5,26,4),(5,33,3),(6,2,1),(6,14,2),(6,15,0),(6,33,3),(7,1,0),(7,11,1),(7,20,2),(7,21,3),(8,1,1),(8,20,2),(8,21,0),(8,25,3),(9,4,9),(9,5,7),(9,9,8),(9,10,0),(9,14,5),(9,18,6),(9,22,4),(9,23,2),(9,27,1),(9,30,3);
/*!40000 ALTER TABLE `collection_tools` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `collections`
--

DROP TABLE IF EXISTS `collections`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `collections` (
  `id` int NOT NULL AUTO_INCREMENT,
  `slug` varchar(80) NOT NULL,
  `title` varchar(120) NOT NULL,
  `description` varchar(300) DEFAULT NULL,
  `icon` varchar(50) DEFAULT NULL,
  `color` varchar(20) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `collections`
--

LOCK TABLES `collections` WRITE;
/*!40000 ALTER TABLE `collections` DISABLE KEYS */;
INSERT INTO `collections` VALUES (1,'students','Best AI for Students','Learn faster, summarize lectures, and prep for exams.','pi-graduation-cap','#6366f1','2026-08-01 06:17:11'),(2,'developers','Best AI for Developers','Code faster and ship apps with the tools pros actually use.','pi-code','#22c55e','2026-08-01 06:17:11'),(3,'free-ai','Best Free AI','Zero cost, no credit card. The best free tools that hold up.','pi-gift','#f59e0b','2026-08-01 06:17:11'),(4,'agents','Best AI Agents','AI that does the work for you, not just chats.','pi-robot','#a855f7','2026-08-01 06:17:11'),(5,'replace-photoshop','Replace Photoshop','Edit images and design without the subscription.','pi-image','#0ea5e9','2026-08-01 06:17:11'),(6,'replace-canva','Replace Canva','Design posts and thumbnails with AI doing the heavy lifting.','pi-palette','#ec4899','2026-08-01 06:17:11'),(7,'replace-excel','Replace Excel','Analyze data and clean up spreadsheets with plain English.','pi-table','#10b981','2026-08-01 06:17:11'),(8,'replace-google','Replace Google','Find answers with citations instead of scrolling links.','pi-search','#6366f1','2026-08-01 06:17:11'),(9,'open-source-self-hosted','Open Source & self-hosted','Run it yourself. Truly free, transparent AI — no subscriptions, no data leaving your machine.','pi-github','#22c55e','2026-08-03 16:01:29');
/*!40000 ALTER TABLE `collections` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `follows`
--

DROP TABLE IF EXISTS `follows`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `follows` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `category_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_follow` (`user_id`,`category_id`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `follows_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `follows_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `follows`
--

LOCK TABLES `follows` WRITE;
/*!40000 ALTER TABLE `follows` DISABLE KEYS */;
/*!40000 ALTER TABLE `follows` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `news`
--

DROP TABLE IF EXISTS `news`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `news` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(500) NOT NULL,
  `summary` text,
  `content` text,
  `url` varchar(1024) NOT NULL,
  `image_url` varchar(1024) DEFAULT NULL,
  `source` varchar(255) DEFAULT NULL,
  `author` varchar(255) DEFAULT NULL,
  `published_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `why_it_matters` text,
  `who_benefits` varchar(300) DEFAULT NULL,
  `tools_to_try` varchar(300) DEFAULT NULL,
  `reading_time` int DEFAULT '3',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `news`
--

LOCK TABLES `news` WRITE;
/*!40000 ALTER TABLE `news` DISABLE KEYS */;
INSERT INTO `news` VALUES (6,'OpenAI Opens GPT-5.6 to Everyone','OpenAI is making GPT-5.6 publicly available and rolling out its new Live voice AI models to ChatGPT users around the globe.','OpenAI is making GPT-5.6 publicly available and rolling out its new Live voice AI models to ChatGPT users around the globe.','https://www.cnbc.com/2026/07/08/openai-expanding-gpt-5point6-ai-model-release-ending-government-limits.html','','CNBC','Editorial','2026-07-07 21:00:00','2026-08-01 17:03:04','2026-08-01 17:03:04','The newest flagship is no longer exclusive to paid tiers — access for everyone means every product built on OpenAI gets smarter overnight, and Live voice points to where assistants are headed.','Anyone using ChatGPT, developers building on the OpenAI API, and builders shipping AI features.','ChatGPT, Claude, Perplexity',2),(7,'Open-Source LLMs Now Beat GPT-4-Class Models','A July 2026 benchmark roundup finds several open-weight models — led by Qwen 3 — now match or beat GPT-4-class performance on coding and math.','A July 2026 benchmark roundup finds several open-weight models — led by Qwen 3 — now match or beat GPT-4-class performance on coding and math.','https://techsy.io/en/blog/best-open-source-llms-2026','','Techsy','Editorial','2026-07-04 21:00:00','2026-08-01 17:03:04','2026-08-01 17:03:04','Open models keep closing the gap. That means frontier-level AI you can run yourself, freely and privately, instead of paying per token.','Developers who want control, privacy-conscious users, and anyone tired of subscription lock-in.','Ollama, Hugging Face, DeepSeek-V3, OpenCode',3),(8,'EU Starts Enforcing AI Act Transparency Rules','From 2 August, chatbots must tell users they are AI and AI-generated content must be labelled — the EU AI Act rules are now being enforced.','From 2 August, chatbots must tell users they are AI and AI-generated content must be labelled — the EU AI Act rules are now being enforced.','https://digital-strategy.ec.europa.eu/en/news/commission-starts-enforcing-ai-act-rules-and-new-transparency-requirements-2-august','','European Commission','Editorial','2026-07-30 21:00:00','2026-08-01 17:03:04','2026-08-01 17:03:04','If you ship an AI feature, you need to know whether it needs a disclosure label or human-in-the-loop review. Ignorance is no longer an excuse.','Startups, SaaS builders, and anyone launching consumer-facing AI tools.','OpenCode, LangChain, Perplexity',4),(9,'AI Video Tools Just Got a Massive Upgrade','Leading video models now generate native HD and 4K clips with consistent characters, synchronized audio, and longer multi-shot sequences.','Leading video models now generate native HD and 4K clips with consistent characters, synchronized audio, and longer multi-shot sequences.','https://techweek.com/ai-video-generation-2026-guide-sora-veo-kling-runway/','','TechWeek','Editorial','2026-07-15 21:00:00','2026-08-01 17:03:04','2026-08-01 17:03:04','Short-form creators can now produce full scenes instead of 4-second clips, which changes what is realistic for solo creators.','Video editors, TikTok/Reels creators, and small marketing teams.','Runway, CapCut, Suno',2);
/*!40000 ALTER TABLE `news` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `saves`
--

DROP TABLE IF EXISTS `saves`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `saves` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `tool_id` int NOT NULL,
  `note` varchar(500) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `folder` varchar(60) DEFAULT 'Unsorted',
  `expires_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_save` (`user_id`,`tool_id`),
  KEY `tool_id` (`tool_id`),
  CONSTRAINT `saves_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `saves_ibfk_2` FOREIGN KEY (`tool_id`) REFERENCES `tools` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `saves`
--

LOCK TABLES `saves` WRITE;
/*!40000 ALTER TABLE `saves` DISABLE KEYS */;
/*!40000 ALTER TABLE `saves` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tool_keywords`
--

DROP TABLE IF EXISTS `tool_keywords`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tool_keywords` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tool_id` int NOT NULL,
  `keyword` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_tool` (`tool_id`),
  KEY `idx_keyword` (`keyword`)
) ENGINE=InnoDB AUTO_INCREMENT=1176 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tool_keywords`
--

LOCK TABLES `tool_keywords` WRITE;
/*!40000 ALTER TABLE `tool_keywords` DISABLE KEYS */;
INSERT INTO `tool_keywords` VALUES (921,5,'open code'),(922,5,'opencode'),(923,5,'ai coding agent'),(924,5,'terminal ai'),(925,5,'cli ai'),(926,5,'free coding assistant'),(927,5,'local coding'),(928,5,'open source copilot'),(929,6,'ai code editor'),(930,6,'cursor ai'),(931,6,'coding assistant'),(932,6,'ai editor'),(933,6,'write code faster'),(934,6,'autocomplete code'),(935,3,'copilot'),(936,3,'github copilot'),(937,3,'pair programmer'),(938,3,'code autocomplete'),(939,3,'pr assistant'),(940,3,'github ai'),(941,7,'make a website'),(942,7,'build a website'),(943,7,'create an app'),(944,7,'prototype app'),(945,7,'ai app builder'),(946,7,'no code website'),(947,7,'full stack ai'),(948,7,'bolt new'),(949,7,'react builder'),(950,8,'make a website'),(951,8,'build a ui'),(952,8,'react component generator'),(953,8,'tailwind generator'),(954,8,'ui generator'),(955,8,'frontend ai'),(956,8,'v0'),(957,8,'landing page generator'),(958,9,'database'),(959,9,'backend'),(960,9,'ai app database'),(961,9,'postgres'),(962,9,'auth'),(963,9,'storage'),(964,9,'vector database'),(965,9,'supabase'),(966,10,'run models locally'),(967,10,'local ai'),(968,10,'offline ai'),(969,10,'ollama'),(970,10,'llama locally'),(971,10,'private ai'),(972,10,'no cloud ai'),(973,10,'download llama'),(974,1,'chatgpt'),(975,1,'ai chatbot'),(976,1,'ask ai'),(977,1,'write an email'),(978,1,'summary'),(979,1,'summarize text'),(980,1,'ai assistant'),(981,1,'everyday ai'),(982,1,'gpt'),(983,11,'claude'),(984,11,'anthropic'),(985,11,'long document'),(986,11,'write essays'),(987,11,'reasoning ai'),(988,11,'careful writing'),(989,11,'ai analysis'),(990,11,'claude sonnet'),(991,12,'grammar check'),(992,12,'spell check'),(993,12,'fix my writing'),(994,12,'email writing'),(995,12,'proofread'),(996,12,'better english'),(997,12,'grammarly'),(998,13,'notes'),(999,13,'second brain'),(1000,13,'knowledge base'),(1001,13,'wiki ai'),(1002,13,'summarize notes'),(1003,13,'notion ai'),(1004,13,'document assistant'),(1005,2,'generate images'),(1006,2,'image generation'),(1007,2,'ai art'),(1008,2,'midjourney'),(1009,2,'create art'),(1010,2,'text to image'),(1011,2,'poster art'),(1012,2,'fantasy art'),(1013,14,'stable diffusion'),(1014,14,'free image generation'),(1015,14,'local image gen'),(1016,14,'ai art free'),(1017,14,'comfyui'),(1018,14,'private image generation'),(1019,14,'txt2img'),(1020,15,'remove background'),(1021,15,'canva'),(1022,15,'design'),(1023,15,'poster'),(1024,15,'logo maker'),(1025,15,'social media post'),(1026,15,'thumbnail'),(1027,15,'presentation design'),(1028,15,'photo background remover'),(1029,15,'edit images online'),(1030,16,'generate video'),(1031,16,'text to video'),(1032,16,'ai video'),(1033,16,'runway'),(1034,16,'create video clips'),(1035,16,'video generation'),(1036,16,'motion video'),(1037,17,'edit video'),(1038,17,'video editor'),(1039,17,'add captions'),(1040,17,'short form video'),(1041,17,'tiktok editor'),(1042,17,'subtitle generator'),(1043,17,'capcut'),(1044,17,'reels editing'),(1045,18,'transcribe audio'),(1046,18,'speech to text'),(1047,18,'subtitles'),(1048,18,'transcription'),(1049,18,'whisper'),(1050,18,'audio to text'),(1051,18,'caption video'),(1052,18,'meeting notes transcription'),(1053,19,'text to speech'),(1054,19,'voice over'),(1055,19,'ai voice'),(1056,19,'voice cloning'),(1057,19,'narration'),(1058,19,'elevenlabs'),(1059,19,'realistic voice'),(1060,19,'audio book'),(1061,20,'study'),(1062,20,'study notes'),(1063,20,'summarize pdf'),(1064,20,'pdf summary'),(1065,20,'learn from documents'),(1066,20,'notebooklm'),(1067,20,'google notebook'),(1068,20,'lecture notes'),(1069,20,'exam prep'),(1070,20,'research papers'),(1071,21,'research'),(1072,21,'search with ai'),(1073,21,'perplexity'),(1074,21,'citations'),(1075,21,'fact check'),(1076,21,'find sources'),(1077,21,'ai search engine'),(1078,21,'research assistant'),(1079,21,'deep research'),(1080,4,'hugging face'),(1081,4,'ai models'),(1082,4,'download models'),(1083,4,'open models'),(1084,4,'model hub'),(1085,4,'try models'),(1086,4,'transformers'),(1087,4,'datasets'),(1088,22,'model demo'),(1089,22,'share ai demo'),(1090,22,'gradio'),(1091,22,'streamlit alternative'),(1092,22,'showcase model'),(1093,22,'ai demo app'),(1094,22,'prototype model ui'),(1095,23,'llm framework'),(1096,23,'build ai pipeline'),(1097,23,'agents framework'),(1098,23,'langchain'),(1099,23,'rag'),(1100,23,'ai orchestration'),(1101,23,'llm app development'),(1102,24,'make music'),(1103,24,'generate music'),(1104,24,'ai song'),(1105,24,'suno'),(1106,24,'text to music'),(1107,24,'create a song'),(1108,24,'music generator'),(1109,24,'ai beats'),(1110,25,'gemini'),(1111,25,'google ai'),(1112,25,'free ai assistant'),(1113,25,'gmail ai'),(1114,25,'google apps'),(1115,25,'gemini ai'),(1116,25,'google gemini'),(1117,25,'google assistant'),(1118,26,'flux'),(1119,26,'flux model'),(1120,26,'open image model'),(1121,26,'text to image free'),(1122,26,'image generator'),(1123,26,'black forest labs'),(1124,26,'midjourney alternative'),(1125,27,'lm studio'),(1126,27,'run models locally'),(1127,27,'local ai gui'),(1128,27,'download models'),(1129,27,'offline chat'),(1130,27,'local llm app'),(1131,27,'run gpt locally'),(1132,28,'edit video'),(1133,28,'podcast editing'),(1134,28,'transcript editing'),(1135,28,'remove filler words'),(1136,28,'descript'),(1137,28,'audio editor'),(1138,28,'screen recording'),(1139,28,'studio sound'),(1140,29,'figma'),(1141,29,'ui design'),(1142,29,'prototyping'),(1143,29,'design tool'),(1144,29,'wireframe'),(1145,29,'product design'),(1146,29,'collaboration design'),(1147,30,'rag'),(1148,30,'llamaindex'),(1149,30,'document qa'),(1150,30,'search your docs'),(1151,30,'vector search'),(1152,30,'llm data framework'),(1153,30,'knowledge base ai'),(1154,31,'make music'),(1155,31,'generate music'),(1156,31,'ai song'),(1157,31,'udio'),(1158,31,'music generator'),(1159,31,'create a song'),(1160,31,'ai music'),(1161,31,'vocal songs'),(1162,32,'grammar check'),(1163,32,'spell check'),(1164,32,'languagetool'),(1165,32,'free grammar checker'),(1166,32,'proofread'),(1167,32,'fix writing'),(1168,32,'multilingual checker'),(1169,33,'remove background'),(1170,33,'background remover'),(1171,33,'product photo'),(1172,33,'photoroom'),(1173,33,'ecommerce photo'),(1174,33,'studio photo'),(1175,33,'passport photo');
/*!40000 ALTER TABLE `tool_keywords` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tool_use_cases`
--

DROP TABLE IF EXISTS `tool_use_cases`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tool_use_cases` (
  `tool_id` int NOT NULL,
  `use_case_id` int NOT NULL,
  PRIMARY KEY (`tool_id`,`use_case_id`),
  KEY `use_case_id` (`use_case_id`),
  CONSTRAINT `tool_use_cases_ibfk_1` FOREIGN KEY (`tool_id`) REFERENCES `tools` (`id`) ON DELETE CASCADE,
  CONSTRAINT `tool_use_cases_ibfk_2` FOREIGN KEY (`use_case_id`) REFERENCES `use_cases` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tool_use_cases`
--

LOCK TABLES `tool_use_cases` WRITE;
/*!40000 ALTER TABLE `tool_use_cases` DISABLE KEYS */;
INSERT INTO `tool_use_cases` VALUES (3,1),(4,1),(5,1),(6,1),(7,1),(8,1),(9,1),(10,1),(11,1),(22,1),(23,1),(27,1),(29,1),(30,1),(1,2),(11,2),(12,2),(13,2),(25,2),(32,2),(2,3),(14,3),(15,3),(26,3),(29,3),(33,3),(16,4),(17,4),(18,4),(19,4),(24,4),(28,4),(31,4),(1,5),(4,5),(10,5),(11,5),(13,5),(18,5),(20,5),(21,5),(25,5),(27,5),(32,5),(1,6),(11,6),(12,6),(13,6),(15,6),(17,6),(18,6),(19,6),(21,6),(25,6),(28,6),(32,6),(33,6);
/*!40000 ALTER TABLE `tool_use_cases` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tools`
--

DROP TABLE IF EXISTS `tools`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tools` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text,
  `url` varchar(1024) DEFAULT NULL,
  `image_url` varchar(1024) DEFAULT NULL,
  `category` varchar(100) DEFAULT NULL,
  `pricing` varchar(50) DEFAULT NULL,
  `rating` decimal(2,1) DEFAULT '0.0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `best_for` varchar(255) DEFAULT NULL,
  `beginner_friendly` tinyint(1) DEFAULT '0',
  `pros` text,
  `cons` text,
  `alternatives` varchar(300) DEFAULT NULL,
  `tutorial_url` varchar(1024) DEFAULT NULL,
  `is_new` tinyint(1) DEFAULT '0',
  `is_gem` tinyint(1) DEFAULT '0',
  `trending_rank` int DEFAULT NULL,
  `last_reviewed` date DEFAULT NULL,
  `reviewer` varchar(60) DEFAULT NULL,
  `confidence` tinyint DEFAULT NULL,
  `review_note` varchar(300) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tools`
--

LOCK TABLES `tools` WRITE;
/*!40000 ALTER TABLE `tools` DISABLE KEYS */;
INSERT INTO `tools` VALUES (1,'ChatGPT','The default AI assistant. Chat, write, code, analyze files and search the web in one place.','https://chatgpt.com','','Chatbot','Freemium',4.5,'2026-07-30 11:22:37','2026-08-01 09:51:12','Everyday questions, writing and quick help',1,'[\"The default, most complete assistant\",\"Handles files, images, voice\",\"Great free tier\"]','[\"Free tier can be slow at peak\",\"Hallucinations need double-checking\"]','[\"Claude\",\"Perplexity\"]','https://help.openai.com',0,0,4,'2026-07-27','Bassel',4,'The most complete all-rounder; the free tier alone covers most people.'),(2,'Midjourney','The reference for AI image generation. Stunning artistic output from a text prompt.','https://midjourney.com','','Image Generation','Paid',4.7,'2026-07-30 11:22:37','2026-08-01 09:51:12','Beautiful, artistic images for creatives',0,'[\"Best aesthetic output\",\"Huge creative community\",\"Stunning results fast\"]','[\"Paid only\",\"Discord-based workflow feels dated\"]','[\"Stable Diffusion\",\"Flux\"]','https://docs.midjourney.com',0,0,6,'2026-07-15','Bassel',4,'Still the aesthetic benchmark for AI images; the Discord workflow is dated.'),(3,'GitHub Copilot','AI pair programmer embedded in VS Code, JetBrains and GitHub. Great for autocomplete and pull requests.','https://github.com/features/copilot','','Code Assistant','Paid',4.4,'2026-07-30 11:22:37','2026-08-01 09:51:12','AI autocomplete and PR help inside GitHub',0,'[\"Embedded in GitHub and editors\",\"Great for autocomplete\",\"Works where you already work\"]','[\"Can suggest outdated patterns\",\"Paid tiers for full features\"]','[\"Cursor\",\"OpenCode\"]','https://docs.github.com/en/copilot',0,0,0,'2026-07-20','Bassel',3,'Solid autocomplete, but agents and editors caught up; worth it mainly inside GitHub.'),(4,'Hugging Face','The hub for open-source AI models, datasets and demos. Where models are shared and tried.','https://huggingface.co','','Model Hub','Freemium',4.8,'2026-07-30 11:22:37','2026-08-01 09:51:12','Finding and trying open AI models',0,'[\"Every open model in one place\",\"Free demos to try models\",\"Huge community\"]','[\"Overwhelming for beginners\",\"Quality varies across models\"]','[\"GitHub\",\"Replicate\"]','https://huggingface.co/docs',0,0,0,'2026-07-08','Bassel',4,'The hub for open models; overwhelming for beginners but essential.'),(5,'OpenCode','Open-source AI coding agent that runs in your terminal. Reads your whole repo, edits files and runs commands — free and local.','https://opencode.ai','','Code Assistant','Free',4.8,'2026-08-01 05:37:03','2026-08-01 09:51:12','Free AI coding agent for building software in the terminal',1,'[\"Free and open source\",\"Runs fully in your terminal\",\"Edits files and runs commands autonomously\"]','[\"Terminal-first, no pretty UI\",\"Steeper learning curve than editors\"]','[\"Cursor\",\"GitHub Copilot\"]','https://opencode.ai/docs',1,1,1,'2026-07-30','Bassel',5,'The default free coding agent — better than most paid options for terminal users.'),(6,'Cursor','AI-first code editor. Tab-tab-tab autocomplete plus agent chat over your whole codebase.','https://cursor.com','','Code Assistant','Paid',4.8,'2026-08-01 05:37:03','2026-08-01 17:03:01','AI code editor that feels like magic for daily coding',1,'[\"Best-in-class autocomplete\",\"Understands your whole codebase\",\"Great onboarding for beginners\"]','[\"Subscription cost adds up\",\"Needs a modern machine\"]','[\"OpenCode\",\"GitHub Copilot\"]','https://docs.cursor.com',0,0,2,'2026-07-28','Bassel',5,'Still the smoothest AI editor experience for daily coding.'),(7,'Bolt.new','Describe an app and get a running web app instantly, no setup. Then keep editing it in the browser.','https://bolt.new','','App Builder','Freemium',4.5,'2026-08-01 05:37:03','2026-08-01 17:03:01','Prototyping a full web app from a single prompt',1,'[\"Full app from one prompt\",\"No setup, runs in browser\",\"Instant prototyping\"]','[\"Complex apps hit limits\",\"Code quality varies for big projects\"]','[\"v0\",\"Cursor\"]','https://bolt.new/docs',1,0,3,'2026-07-25','Bassel',4,'Fastest route from prompt to a working web app; hits limits on serious projects.'),(8,'v0','Vercel\'s AI UI generator. Describe a UI and get production-ready React + Tailwind code.','https://v0.dev','','App Builder','Freemium',4.6,'2026-08-01 05:37:03','2026-08-01 09:51:12','Generating polished frontend UI components',1,'[\"Beautiful React + Tailwind output\",\"Iterate visually on UI\",\"Easy for frontend prototypes\"]','[\"Frontend only\",\"Needs cleanup for production\"]','[\"Bolt.new\",\"Cursor\"]','https://v0.dev/docs',1,0,0,'2026-07-25','Bassel',4,'Best-in-class UI generation; pair it with a real editor for production.'),(9,'Supabase','Open-source Firebase alternative. Postgres database, auth and storage with an AI toolkit.','https://supabase.com','','Backend','Freemium',4.7,'2026-08-01 05:37:03','2026-08-01 09:51:12','Database and backend for AI apps you build yourself',0,'[\"Open source\",\"Postgres + auth + storage included\",\"Great for AI app backends\"]','[\"More setup than a managed API\",\"SQL knowledge helps\"]','[\"Firebase\",\"Neon\"]','https://supabase.com/docs',0,1,0,'2026-07-22','Bassel',5,'Our default backend for AI apps — open, portable, generous free tier.'),(10,'Ollama','Run open-source LLMs like Llama and Qwen on your own machine, free and offline.','https://ollama.com','','Local AI','Free',4.7,'2026-08-01 05:37:03','2026-08-01 09:51:12','Running local AI models privately on your laptop',1,'[\"Free and private\",\"One command to run models locally\",\"Huge model library\"]','[\"Needs decent hardware\",\"Big models are slow on CPU\"]','[\"LM Studio\",\"llama.cpp\"]','https://github.com/ollama/ollama',0,1,0,'2026-07-18','Bassel',5,'The easiest way to run models locally; essential for private AI.'),(11,'Claude','Anthropic\'s AI assistant, especially strong at writing, long documents and coding.','https://claude.ai','','Chatbot','Freemium',4.7,'2026-08-01 05:37:03','2026-08-01 09:51:12','Long-form writing and careful reasoning',1,'[\"Superb at long-form writing\",\"Excellent reasoning and coding\",\"Long context window\"]','[\"Fewer integrations than ChatGPT\",\"Higher-tier plans are pricey\"]','[\"ChatGPT\",\"Gemini\"]','https://docs.anthropic.com',0,1,5,'2026-07-24','Bassel',5,'Our pick for long-form writing and careful reasoning over documents.'),(12,'Grammarly','Real-time grammar, tone and clarity fixes across your writing and email.','https://grammarly.com','','Writing','Freemium',4.3,'2026-08-01 05:37:03','2026-08-01 09:51:12','Polishing emails and documents as you type',1,'[\"Real-time grammar everywhere\",\"Saves time on email polish\",\"Easy for non-writers\"]','[\"AI features locked behind premium\",\"Can be annoying with suggestions\"]','[\"LanguageTool\",\"Hemingway\"]','https://support.grammarly.com',0,0,0,'2026-06-30','Bassel',3,'Solid for polish, but the premium tier is pricey and free alternatives are close.'),(13,'Notion AI','AI inside your notes and wiki — summarise pages, generate drafts, answer questions over your docs.','https://notion.so/product/ai','','Productivity','Freemium',4.4,'2026-08-01 05:37:03','2026-08-01 09:51:12','Second brain users who live in Notion',1,'[\"AI inside your notes and wiki\",\"Answers questions over your docs\",\"Great second brain\"]','[\"Notion AI needs paid plan\",\"Output depends on well-organized notes\"]','[\"Obsidian\",\"Mem\"]','https://www.notion.so/help/guides',0,0,0,'2026-07-10','Bassel',3,'Useful only if you already live in Notion; not a reason to switch to it.'),(14,'Stable Diffusion','Open-source image generation you can run locally for free with total control.','https://stability.ai','','Image Generation','Free',4.5,'2026-08-01 05:37:03','2026-08-01 09:51:12','Free, private and customizable image generation',0,'[\"Free and open source\",\"Runs locally, fully private\",\"Total control via fine-tuning\"]','[\"Setup is technical\",\"Requires a good GPU for speed\"]','[\"Midjourney\",\"Flux\"]','https://stable-diffusion-art.com/tutorial/',0,1,0,'2026-07-12','Bassel',4,'Free, local, fully controlled — if you can handle the setup.'),(15,'Canva Magic Studio','Design anything — posts, logos, posters — with AI assist built into an easy editor.','https://canva.com/magic-studio','','Design','Freemium',4.5,'2026-08-01 05:37:03','2026-08-01 09:51:12','Non-designers who need graphics fast',1,'[\"Easy for non-designers\",\"Everything in one editor\",\"Great templates\"]','[\"Not for professional print design\",\"AI features limited on free tier\"]','[\"Figma\",\"Adobe Express\"]','https://www.canva.com/learn/',1,0,7,'2026-07-21','Bassel',4,'The beginner-friendly design default: fast, familiar, great templates.'),(16,'Runway','AI video generation and editing in the browser. Text-to-video and motion tools.','https://runwayml.com','','Video','Freemium',4.4,'2026-08-01 05:37:03','2026-08-01 09:51:12','Generating short video clips from a prompt',0,'[\"Text-to-video that works\",\"Built-in video editing tools\",\"Studio features for pros\"]','[\"Credits run out fast\",\"Short clips by default\"]','[\"Pika\",\"CapCut\"]','https://learn.runwayml.com',1,0,8,'2026-07-16','Bassel',4,'Best text-to-video for short clips; credits run out quickly.'),(17,'CapCut','Free, fast video editor with AI captions, effects and templates. Huge for short-form content.','https://capcut.com','','Video','Freemium',4.5,'2026-08-01 05:37:03','2026-08-01 09:51:12','Editing TikTok/Shorts/Reels fast',1,'[\"Free and fast\",\"Auto captions are excellent\",\"Perfect for short-form\"]','[\"Watermark without subscription\",\"Advanced AI needs paid\"]','[\"Descript\",\"DaVinci Resolve\"]','https://www.capcut.com/resource',0,0,9,'2026-07-23','Bassel',5,'The default editor for short-form; auto-captions are unbeatable value.'),(18,'Whisper','OpenAI\'s open-source speech-to-text. Transcribe audio to text with near-human accuracy, free.','https://github.com/openai/whisper','','Audio','Free',4.7,'2026-08-01 05:37:03','2026-08-01 09:51:12','Free transcription and subtitles',0,'[\"Free and accurate\",\"Open source\",\"Works in dozens of languages\"]','[\"Command-line setup\",\"Slow on CPU for long files\"]','[\"Otter.ai\",\"Descript\"]','https://github.com/openai/whisper',0,1,0,'2026-07-19','Bassel',5,'Free, accurate transcription that is hard to beat; command line required.'),(19,'ElevenLabs','The most realistic AI voices and voice cloning. Narrate videos and podcasts.','https://elevenlabs.io','','Audio','Freemium',4.5,'2026-08-01 05:37:03','2026-08-01 09:51:12','Realistic AI voiceovers',0,'[\"Most realistic AI voices\",\"Instant voice cloning\",\"Great for narration\"]','[\"Credits are expensive\",\"Free tier is very limited\"]','[\"Murf\",\"PlayHT\"]','https://elevenlabs.io/docs',0,0,0,'2026-07-17','Bassel',4,'The most realistic voices; the free tier is just a taste.'),(20,'NotebookLM','Upload your sources — PDFs, links, notes — and get answers grounded only in them. Free.','https://notebooklm.google.com','','Study','Free',4.7,'2026-08-01 05:37:03','2026-08-01 09:51:12','Learning from your own documents',1,'[\"Answers grounded in YOUR sources\",\"Free with Google account\",\"Amazing for study notes\"]','[\"Limited to uploaded sources\",\"Google-only ecosystem\"]','[\"ChatGPT\",\"Perplexity\"]','https://notebooklm.google.com',1,1,10,'2026-07-26','Bassel',5,'The study tool we recommend to every student — free and grounded in your sources.'),(21,'Perplexity','AI search engine with cited answers. The fastest way to research a topic.','https://perplexity.ai','','Research','Freemium',4.6,'2026-08-01 05:37:03','2026-08-01 09:51:12','Fact-finding with real sources',1,'[\"Answers with citations\",\"Great for research\",\"Fast and reliable\"]','[\"Free tier limits deep research\",\"Occasionally misreads sources\"]','[\"ChatGPT\",\"Google AI Overviews\"]','https://www.perplexity.ai/hub',0,0,11,'2026-07-26','Bassel',5,'Our default research answer; citations are what make it trustworthy.'),(22,'Gradio','Build a shareable demo UI for any model in a few lines of Python. Free and open.','https://gradio.app','','Framework','Free',4.6,'2026-08-01 05:37:04','2026-08-01 09:51:12','Turning a model into a web demo in minutes',1,'[\"Share a model demo in minutes\",\"Free and open source\",\"Beginner friendly for builders\"]','[\"Not for production apps\",\"Python required\"]','[\"Streamlit\",\"Replicate\"]','https://www.gradio.app/guides',0,1,0,'2026-07-09','Bassel',4,'Fastest way to demo a model; not for production apps.'),(23,'LangChain','The most popular framework for building LLM applications in Python and JS.','https://langchain.com','','Framework','Free',4.4,'2026-08-01 05:37:04','2026-08-01 09:51:12','Building serious AI pipelines and agents',0,'[\"Most popular LLM framework\",\"Huge ecosystem of tools\",\"Python and JS support\"]','[\"API churns quickly\",\"Overkill for simple apps\"]','[\"LlamaIndex\",\"Haystack\"]','https://python.langchain.com/docs',0,0,0,'2026-07-05','Bassel',3,'Powerful but churn-heavy; reach for it when simple orchestration is not enough.'),(24,'Suno','Generate complete songs with vocals from a text prompt. Wildly popular.','https://suno.com','','Audio','Freemium',4.4,'2026-08-01 05:37:04','2026-08-01 09:51:12','Making AI music for fun or content',1,'[\"Full songs with vocals from text\",\"Incredibly fun\",\"Quick results\"]','[\"Song quality varies\",\"Commercial terms need checking\"]','[\"Udio\",\"AIVA\"]','https://suno.com',1,0,12,'2026-07-14','Bassel',4,'Fun and surprisingly good songs; quality varies by genre.'),(25,'Gemini','Google\'s AI assistant — strong at reasoning and search, free, and works across your Google apps. Great at handling images and video too.','https://gemini.google.com','','Chatbot','Freemium',4.6,'2026-08-01 12:34:45','2026-08-01 12:34:51','Free AI assistant tied to Google apps and Gmail',1,'[\"Free and generous\",\"Deeply integrated with Google apps\",\"Handles images, video and files\"]','[\"Fewer extensions outside Google\",\"Can feel generic for creative writing\"]','[\"ChatGPT\",\"Claude\"]','https://support.google.com/gemini',0,0,0,'2026-07-29','Bassel',4,'The best free assistant if you live in Google apps; great with images and video.'),(26,'Flux','Black Forest Labs\' open image model. Top-tier quality from text prompts — free weights, pay only for the fastest API.','https://huggingface.co/black-forest-labs/FLUX.1-dev','','Image Generation','Freemium',4.7,'2026-08-01 12:34:45','2026-08-01 12:34:51','Open image model rivaling Midjourney',0,'[\"Open weights, free to run\",\"Near-Midjourney quality\",\"Fast API option\"]','[\"Top quality needs a good GPU\",\"Ecosystem smaller than Stable Diffusion\"]','[\"Stable Diffusion\",\"Midjourney\"]','https://huggingface.co/black-forest-labs/FLUX.1-dev',1,1,13,'2026-07-29','Bassel',5,'Open image model that finally rivals Midjourney — free weights, huge quality jump.'),(27,'LM Studio','A desktop app that makes running open models locally easy — download, click, chat. No command line required.','https://lmstudio.ai','','Local AI','Free',4.6,'2026-08-01 12:34:45','2026-08-01 12:34:51','Friendly app to run local models without the command line',1,'[\"Point-and-click local models\",\"No command line needed\",\"Chat and API mode built in\"]','[\"Large models need plenty of RAM\",\"Fewer advanced knobs than raw llama.cpp\"]','[\"Ollama\",\"llama.cpp\"]','https://lmstudio.ai/docs',0,1,0,'2026-07-28','Bassel',5,'The friendliest way for non-devs to run local models. No terminal needed.'),(28,'Descript','Edit video like a doc — delete words in the transcript and the footage follows. Great for podcasts and tutorials.','https://descript.com','','Video','Freemium',4.4,'2026-08-01 12:34:45','2026-08-01 17:03:04','Editing videos and podcasts by editing the transcript',0,'[\"Edit video by editing text\",\"Overdub fixes flubs instantly\",\"Great for podcasts\"]','[\"Expensive for heavy use\",\"Long videos get pricey\"]','[\"CapCut\",\"DaVinci Resolve\"]','https://help.descript.com',1,0,0,'2026-07-27','Bassel',4,'Editing video by editing the transcript is a superpower for podcasts.'),(29,'Figma','The industry-standard design tool for UI and collaboration. AI features help turn designs into editable layouts.','https://figma.com','','Design','Freemium',4.5,'2026-08-01 12:34:45','2026-08-01 12:34:51','Team design and UI prototyping, with AI assist',0,'[\"Industry-standard UI design\",\"Real-time collaboration\",\"AI helps turn designs into layouts\"]','[\"Overkill for simple graphics\",\"Pro features cost money\"]','[\"Canva Magic Studio\",\"Framer\"]','https://help.figma.com',0,0,0,'2026-07-26','Bassel',4,'Still the industry standard for UI work; AI assist is getting genuinely useful.'),(30,'LlamaIndex','The most popular framework for connecting LLMs to your own data — documents, databases, APIs. Pairs with LangChain.','https://llamaindex.ai','','Framework','Free',4.5,'2026-08-01 12:34:46','2026-08-01 12:34:51','The framework for RAG and document apps',0,'[\"Best-in-class RAG tooling\",\"Connects LLMs to your data\",\"Large ecosystem\"]','[\"Python required\",\"Steeper learning curve\"]','[\"LangChain\",\"Haystack\"]','https://docs.llamaindex.ai',0,1,0,'2026-07-24','Bassel',4,'The go-to framework for connecting models to your own documents.'),(31,'Udio','Generate full songs with vocals, then remix with detailed controls. The serious alternative to Suno.','https://udio.com','','Audio','Freemium',4.3,'2026-08-01 12:34:46','2026-08-01 12:34:51','AI songs with fine control over style and lyrics',1,'[\"Full songs with vocals\",\"Fine control over style\",\"Great remixing tools\"]','[\"Quality varies by genre\",\"Free credits run out\"]','[\"Suno\",\"AIVA\"]','https://www.udio.com/help',1,1,0,'2026-07-23','Bassel',4,'Suno\'s serious rival for songs with vocals — more control, slightly less polish.'),(32,'LanguageTool','Open-source grammar and style checker with deep multilingual support. A free alternative to Grammarly.','https://languagetool.org','','Writing','Freemium',4.3,'2026-08-01 12:34:46','2026-08-01 17:03:04','Free grammar checking that supports 30+ languages',1,'[\"Free core grammar checking\",\"Supports 30+ languages\",\"Open source\"]','[\"AI rewrite needs premium\",\"Can miss context-specific errors\"]','[\"Grammarly\",\"Hemingway\"]','https://languagetool.org/help',0,1,0,'2026-07-22','Bassel',4,'A genuinely good free Grammarly alternative that supports dozens of languages.'),(33,'Photoroom','Remove backgrounds and create studio-quality product photos from your phone in seconds. Built for sellers.','https://photoroom.com','','Design','Freemium',4.5,'2026-08-01 12:34:46','2026-08-01 17:03:04','Instant background removal and product photos',1,'[\"One-tap background removal\",\"Studio product photos from a phone\",\"Made for sellers\"]','[\"Best features need paid plan\",\"Not a full design suite\"]','[\"Canva Magic Studio\",\"Stable Diffusion\"]','https://help.photoroom.com',1,0,0,'2026-07-21','Bassel',4,'The fastest background removal and product-photo tool for sellers.');
/*!40000 ALTER TABLE `tools` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `use_cases`
--

DROP TABLE IF EXISTS `use_cases`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `use_cases` (
  `id` int NOT NULL AUTO_INCREMENT,
  `slug` varchar(60) NOT NULL,
  `title` varchar(100) NOT NULL,
  `description` varchar(300) DEFAULT NULL,
  `icon` varchar(50) DEFAULT NULL,
  `sort_order` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `use_cases`
--

LOCK TABLES `use_cases` WRITE;
/*!40000 ALTER TABLE `use_cases` DISABLE KEYS */;
INSERT INTO `use_cases` VALUES (1,'build-app','Build an App','Code assistants, app builders and full stacks to ship software','pi-code',1,'2026-08-01 05:37:03'),(2,'write','Write & Communicate','Drafts, emails, rewriting and clear communication','pi-pencil',2,'2026-08-01 05:37:03'),(3,'design','Create Images & Design','Generate images, design assets, logos and UI','pi-palette',3,'2026-08-01 05:37:03'),(4,'video','Edit & Create Video','Generate, edit and caption videos','pi-video',4,'2026-08-01 05:37:03'),(5,'study','Study & Learn','Summarize, research and learn anything faster','pi-book',5,'2026-08-01 05:37:03'),(6,'business','Run a Business','Research, sales, documents and productivity','pi-briefcase',6,'2026-08-01 05:37:03');
/*!40000 ALTER TABLE `use_cases` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `avatar` varchar(512) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `workflow_steps`
--

DROP TABLE IF EXISTS `workflow_steps`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `workflow_steps` (
  `id` int NOT NULL AUTO_INCREMENT,
  `workflow_id` int NOT NULL,
  `tool_id` int DEFAULT NULL,
  `title` varchar(120) NOT NULL,
  `note` varchar(300) DEFAULT NULL,
  `sort_order` int DEFAULT '0',
  `why` varchar(300) DEFAULT NULL,
  `alternative` varchar(200) DEFAULT NULL,
  `avoid_if` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `workflow_id` (`workflow_id`),
  KEY `tool_id` (`tool_id`),
  CONSTRAINT `workflow_steps_ibfk_1` FOREIGN KEY (`workflow_id`) REFERENCES `workflows` (`id`) ON DELETE CASCADE,
  CONSTRAINT `workflow_steps_ibfk_2` FOREIGN KEY (`tool_id`) REFERENCES `tools` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=94 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `workflow_steps`
--

LOCK TABLES `workflow_steps` WRITE;
/*!40000 ALTER TABLE `workflow_steps` DISABLE KEYS */;
INSERT INTO `workflow_steps` VALUES (63,1,NULL,'Ideogram','Generate a bold thumbnail image from a prompt. Best-in-class at text inside images.',0,'It writes clean, readable text inside the image, which most generators mangle.','DALL·E','You need a whole video, not a single image.'),(64,1,NULL,'Magnific','Upscale and enhance to crisp 1280x720 so it survives YouTube’s small preview.',1,'Upscaling keeps edges sharp at the small preview size where thumbnails live or die.','Upscayl','Your source image is already 4K.'),(65,1,15,'Canva','Overlay your title, arrows and branding using a thumbnail template.',2,'Free, familiar, and ships ready-made thumbnail templates for every format.','Figma','You need pixel-perfect print-quality design.'),(66,1,17,'CapCut','If you are cutting the video too, export the thumbnail at the right size in the same session.',3,'You are already in it for the video, so the export settings are right there.','DaVinci Resolve','You only need the thumbnail — skip this step.'),(67,1,NULL,'Upload to YouTube','Set it as the custom thumbnail and double-check it reads well at 160px wide.',4,NULL,NULL,NULL),(68,2,5,'OpenCode','Let the agent scaffold the app, tests and CI in your terminal. Free and local.',0,'Free, local, and it can use any major LLM as its brain — no subscription to start.','Cursor','You want a GUI editor with autocomplete out of the box.'),(69,2,9,'Supabase','Postgres, auth and storage in one. Your data stays yours.',1,'Postgres, auth and storage in one open-source package with a strong free tier.','Neon','Your backend is already on AWS — do not migrate for fun.'),(70,2,NULL,'Vercel','Deploy the frontend and serverless functions with a git push.',2,'One git push deploys your frontend and serverless functions with zero config.','Netlify','You need long-running server processes.'),(71,2,NULL,'Resend','Transactional email for signups and invoices, with a simple API.',3,'Simple API and excellent deliverability without a complex email setup.','Postmark','You send a handful of emails a month — use your app’s SMTP.'),(72,2,NULL,'PostHog','Product analytics, session replay and feature flags from day one.',4,'Analytics, session replay and flags in one tool with a free tier — growth and debugging in one place.','Amplitude','You already have analytics wired and do not need session replay.'),(73,2,NULL,'Stripe','Take payments. The docs are good enough that an AI agent can wire them for you.',5,'The default payments API, with docs good enough that an AI agent wires it for you.','Paddle','You sell physical goods — a simpler processor may fit.'),(74,3,1,'ChatGPT','Brainstorm topics and write the hook. Ask it to write like you speak.',0,'It turns a seed idea into a full script with a working hook in one session.','Claude','Your scripts are long-form and precise — Claude drafts those better.'),(75,3,NULL,'Ideogram','Generate the thumbnail and any on-screen graphics.',1,'Thumbnails with readable text, and text is what drives the click.','Canva Magic Studio','You want to design the thumbnail by hand in a full editor.'),(76,3,19,'ElevenLabs','Record a studio-quality AI voiceover when you cannot use your own.',2,'Studio-quality voiceovers when you cannot record — huge for talking-head channels.','Murf','You have a good mic and a natural on-camera voice — use it.'),(77,3,17,'CapCut','Cut to the voiceover, add auto-captions and tighten pacing in minutes.',3,'Free, fast, and auto-captions are the best retention hack in short-form.','DaVinci Resolve','You are editing long documentaries, not shorts.'),(78,3,NULL,'TubeBuddy','Optimize the title, tags and best upload time before hitting publish.',4,'It picks titles and tags that rank and tells you when to publish.','vidIQ','You already know your keywords cold.'),(79,4,20,'NotebookLM','Upload lecture PDFs and get answers grounded only in your sources.',0,'Answers are grounded only in your uploaded sources, so citations stay trustworthy.','ChatGPT with file upload','You need answers from the open web, not just your files.'),(80,4,18,'Whisper','Transcribe audio lectures and meetings into searchable text, free.',1,'Accurate, free transcription — ideal for audio-only lectures.','Otter.ai','You do not want a command line; Otter has a polished app.'),(81,4,21,'Perplexity','Fill the gaps in your notes with cited, up-to-date explanations.',2,'Cited answers fill the gaps your lecture notes leave open.','Google','You only need one quick fact — a normal search is faster.'),(82,4,1,'ChatGPT','Turn the notes into flashcards and practice questions.',3,'Turning notes into flashcards is where general-purpose models shine.','Anki’s AI add-ons','You already have a flashcard workflow you like.'),(83,4,NULL,'Obsidian','Keep a linked second brain so your notes compound over time.',4,'Your notes stay local and linked, so the second brain compounds.','Notion','You prefer collaborating and sharing in the cloud.'),(84,5,21,'Perplexity','Start broad — get cited answers and discover the key sources fast.',0,'Cited answers give you the map of the topic before you commit to reading.','Google Scholar','You already know the exact papers you need.'),(85,5,20,'NotebookLM','Load the best sources and ask questions grounded only in them.',1,'Deep, grounded Q&A over the sources you actually chose.','ChatGPT with file upload','All your sources are web pages — Perplexity covers them.'),(86,5,11,'Claude','Draft the synthesis. Claude is the strongest at long, careful writing.',2,'Long, careful synthesis is its strongest skill.','ChatGPT','You need every citation preserved verbatim in the draft.'),(87,5,18,'Whisper','Transcribe any interviews or videos you gathered along the way.',3,'Interviews and talks become searchable text you can quote.','Descript','The audio is short and clear — read the player’s transcript.'),(88,5,NULL,'Obsidian','File your findings with links so the research is reusable next time.',4,'Links make the research accumulate into a knowledge base over time.','Notion','Your team shares research in one shared doc.'),(89,6,1,'ChatGPT','Generate ten editions of content ideas, then draft the first issue.',0,'A week of topic ideas in one session — starting is the hardest part.','Claude','Your niche is technical writing; Claude writes longer, denser drafts.'),(90,6,11,'Claude','Rewrite the draft for flow — Claude reads long documents best.',1,'It reads and rewrites long documents with better flow than most.','QuillBot','Your draft is short — a light Grammarly pass is enough.'),(91,6,12,'Grammarly','Catch tone and grammar before it reaches thousands of inboxes.',2,'It catches the tone and grammar slips that kill credibility at scale.','LanguageTool','You write cleanly and do not want constant suggestions.'),(92,6,15,'Canva','Design a clean header and cover so the first impression counts.',3,'A clean header and cover make the first issue feel real.','Figma','You already have a designer on the team.'),(93,6,NULL,'Resend','Send it and watch deliverability. Start with a small test list.',4,'Simple sending with readable analytics while you are small.','Buttondown','You want paid subscriptions built in from day one.');
/*!40000 ALTER TABLE `workflow_steps` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `workflows`
--

DROP TABLE IF EXISTS `workflows`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `workflows` (
  `id` int NOT NULL AUTO_INCREMENT,
  `slug` varchar(80) NOT NULL,
  `title` varchar(120) NOT NULL,
  `goal` varchar(200) DEFAULT NULL,
  `summary` varchar(400) DEFAULT NULL,
  `icon` varchar(50) DEFAULT NULL,
  `color` varchar(20) DEFAULT NULL,
  `estimated_minutes` int DEFAULT NULL,
  `is_featured` tinyint(1) DEFAULT '0',
  `sort_order` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `difficulty` varchar(20) DEFAULT 'Beginner',
  `cost` varchar(40) DEFAULT 'Free',
  `time_label` varchar(60) DEFAULT NULL,
  `why` text,
  `alternative_stacks` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `workflows`
--

LOCK TABLES `workflows` WRITE;
/*!40000 ALTER TABLE `workflows` DISABLE KEYS */;
INSERT INTO `workflows` VALUES (1,'youtube-thumbnails','Make YouTube thumbnails','Eye-catching thumbnails in about 15 minutes','The exact workflow for thumbnails that read well at small sizes: generate, enhance, design, export.','pi-youtube','#ef4444',15,1,1,'2026-08-01 07:25:52','Beginner','Free to start','~15 minutes','[\"Ideogram renders text inside the image better than anything else — no manual typography needed.\",\"Magnific upscales the art so it stays crisp at YouTube’s small preview size.\",\"Canva is free and instantly familiar, so you can add the title and arrows without design skills.\"]','[\"Free stack\",\"Designer stack\"]'),(2,'build-a-saas','Build a SaaS from scratch','From idea to deployed product','The modern AI-native stack for shipping a SaaS solo: AI writes the code, you keep the data and the deploy.','pi-server','#6366f1',120,1,2,'2026-08-01 07:25:52','Intermediate','Free until launch','~3 hours','[\"Everything on this stack has a generous free tier — you can build and launch without spending a cent.\",\"OpenCode writes the code for free and locally, so there is no monthly agent bill.\",\"Supabase keeps your data and auth portable — no lock-in on the backend.\",\"Each piece is a category standard, so tutorials and docs are everywhere when you get stuck.\"]','[\"Budget stack\",\"Local stack\",\"Enterprise stack\"]'),(3,'youtube-creator','Start a YouTube channel','Script, voice, edit and ship a video a week','The content stack for solo creators: plan with AI, generate the voice, edit fast, then optimize.','pi-video','#a855f7',45,1,3,'2026-08-01 07:25:52','Intermediate','Freemium','~1 hour per video','[\"The free tiers cover a full video a week, so you can start with $0.\",\"Each tool does one job well, and the files move between them without re-recording.\",\"CapCut’s auto-captions alone are worth it for short-form retention.\"]','[\"No-voice stack\",\"Pro stack\"]'),(4,'study-smarter','Study smarter, not harder','Turn lectures and PDFs into notes you remember','Capture, understand, quiz yourself — a complete study loop from source material to long-term memory.','pi-book','#22c55e',30,1,4,'2026-08-01 07:25:52','Beginner','Free','~30 minutes per lecture','[\"Every tool on this stack is free, which matters when you are a student.\",\"The loop matches how memory works: capture, understand, then quiz yourself.\",\"You keep ownership of your notes instead of locking them into one app.\"]','[\"No-LLM stack\",\"Video-first stack\"]'),(5,'research-like-a-pro','Research any topic like a pro','From question to cited, organized answers','Find the best sources, pull out what matters, and organize it all before you write a single word.','pi-search','#0ea5e9',40,0,5,'2026-08-01 07:25:52','Intermediate','Free','~40 minutes per topic','[\"Cited sources first, synthesis second — you never build conclusions on unverified claims.\",\"Every tool is free and open to your own material.\",\"The last step files your work, so it becomes reusable research instead of a lost tab.\"]','[\"Speed stack\",\"Academic stack\"]'),(6,'launch-a-newsletter','Launch a newsletter','Write, design and ship a newsletter people open','The zero-hype starter stack: draft with AI, polish it, design the header, then send with confidence.','pi-envelope','#f59e0b',30,0,6,'2026-08-01 07:25:53','Beginner','Freemium','~30 minutes per issue','[\"You can run the whole thing on free tiers until you grow.\",\"Draft with AI, then polish by hand — the loop beats staring at a blank page.\",\"Every tool is a category standard, so it scales when you get sponsors.\"]','[\"Writer-first stack\",\"Subscriber stack\"]');
/*!40000 ALTER TABLE `workflows` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-08-05 15:06:45
