# 📚 BookSage

BookSage is an AI-powered book recommendation system developed as part of my final-year thesis project. It leverages **Aspect-Based Sentiment Analysis (ABSA)** and **Large Language Models (LLMs)** to provide explainable, theme-driven book suggestions by analyzing reader reviews.

Unlike traditional recommender systems that rely on ratings or metadata, BookSage extracts nuanced insights from user reviews to surface recommendations grounded in specific narrative elements such as writing style, character complexity, or thematic depth.


## ✨ Features

- 🔍 **Aspect Extraction**: Uses GPT-based models to identify fine-grained aspects from reader reviews.
- 📊 **Sentiment Analysis**: Aggregates sentiment at the aspect level across multiple reviews.
- 📖 **Book-Level Insights**: Consolidates review data into key book-wide themes.
- 💡 **Explainable Recommendations**: Suggests similar books based on selected aspects, with LLM-generated justifications.

  
## 🧱 Tech Stack

- **Frontend**: Next.js, Tailwind CSS
- **Backend**: PostgreSQL with pgvector for embedding search
- **Embedding Model:** OpenAI `text-embedding-ada-002`
- **LLM:** GPT-4o (via OpenAI API)


## 📘 About the Thesis
This project was completed as part of my undergraduate thesis, exploring the use of LLMs for Aspect-Based Sentiment Analysis in Book Recommendation Systems. The goal was to address the transparency and personalization limitations of traditional recommender systems.

## 🤝 Acknowledgements
Special thanks to my thesis advisor, Dr. Roy Ka-Wei Lee, for his guidance throughout this project, and to all participants who tested and provided feedback on BookSage.
