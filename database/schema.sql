CREATE DATABASE IF NOT EXISTS ai_compass;
USE ai_compass;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  avatar VARCHAR(512) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  icon VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS news (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  summary TEXT,
  content TEXT,
  url VARCHAR(1024) NOT NULL,
  image_url VARCHAR(1024),
  source VARCHAR(255),
  author VARCHAR(255),
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ai_models (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  provider VARCHAR(255),
  description TEXT,
  url VARCHAR(1024),
  image_url VARCHAR(1024),
  framework VARCHAR(100),
  license VARCHAR(100),
  parameters VARCHAR(100),
  downloads INT DEFAULT 0,
  likes INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tools (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  url VARCHAR(1024),
  image_url VARCHAR(1024),
  category VARCHAR(100),
  pricing VARCHAR(50),
  rating DECIMAL(2,1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS follows (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  category_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
  UNIQUE KEY unique_follow (user_id, category_id)
);

INSERT INTO categories (name, slug, description, icon) VALUES
  ('AI News', 'ai-news', 'Latest news and developments in artificial intelligence', 'pi pi-calendar'),
  ('AI Models', 'ai-models', 'New and trending AI models from various providers', 'pi pi-database'),
  ('AI Tools', 'ai-tools', 'Software tools powered by artificial intelligence', 'pi pi-wrench'),
  ('GitHub Repos', 'github-repos', 'Popular AI-related GitHub repositories', 'pi pi-github'),
  ('Tutorials', 'tutorials', 'Guides and tutorials for learning AI', 'pi pi-book'),
  ('AI Videos', 'ai-videos', 'Video content about artificial intelligence', 'pi pi-video');

INSERT INTO news (title, summary, url, source, author, published_at) VALUES
  ('GPT-5 Release Date Announced', 'OpenAI confirms GPT-5 launch timeline for 2026', 'https://example.com/gpt5', 'AI Weekly', 'John Doe', NOW()),
  ('New Open Source LLM Beats GPT-4', 'A new open source model achieves state-of-the-art results', 'https://example.com/open-source-llm', 'TechCrunch', 'Jane Smith', NOW()),
  ('AI Regulation Update', 'EU passes new AI safety legislation', 'https://example.com/ai-regulation', 'Reuters', 'Bob Wilson', NOW());

INSERT INTO ai_models (name, provider, description, url, framework, license, parameters, downloads, likes) VALUES
  ('Llama 3.1 405B', 'Meta', 'Meta largest open source language model', 'https://huggingface.co/meta-llama', 'PyTorch', 'Llama 3.1', '405B', 150000, 12000),
  ('Mistral Large 2', 'Mistral AI', 'High performance multilingual model', 'https://huggingface.co/mistralai', 'PyTorch', 'Apache 2.0', '123B', 80000, 8500),
  ('Gemma 2 27B', 'Google', 'Lightweight open model from Google', 'https://huggingface.co/google', 'JAX', 'Gemma', '27B', 200000, 15000);

INSERT INTO tools (name, description, url, category, pricing, rating) VALUES
  ('ChatGPT', 'AI chatbot by OpenAI for conversations and content', 'https://chat.openai.com', 'Chatbot', 'Freemium', 4.5),
  ('Midjourney', 'AI image generation from text prompts', 'https://midjourney.com', 'Image Generation', 'Paid', 4.7),
  ('GitHub Copilot', 'AI pair programmer integrated in VS Code', 'https://github.com/features/copilot', 'Code Assistant', 'Paid', 4.4),
  ('Hugging Face', 'Platform for sharing and deploying ML models', 'https://huggingface.co', 'Model Hub', 'Freemium', 4.8);
