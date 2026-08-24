import os
import json
import re
import math
import numpy as np
import requests

class SimpleTFIDFVectorizer:
    """A lightweight, pure-Python TF-IDF vectorizer to run offline without external API dependencies."""
    def __init__(self):
        self.vocab = {}
        self.idf = {}
        self.doc_count = 0

    def _tokenize(self, text):
        return re.findall(r'\b\w+\b', text.lower())

    def fit(self, corpus):
        self.doc_count = len(corpus)
        if self.doc_count == 0:
            return

        # Compute document frequencies
        doc_freqs = {}
        tokenized_corpus = [self._tokenize(doc) for doc in corpus]
        
        # Build vocabulary
        vocab_set = set()
        for tokens in tokenized_corpus:
            unique_tokens = set(tokens)
            vocab_set.update(unique_tokens)
            for token in unique_tokens:
                doc_freqs[token] = doc_freqs.get(token, 0) + 1

        self.vocab = {word: idx for idx, word in enumerate(sorted(vocab_set))}
        
        # Compute IDF
        for word, idx in self.vocab.items():
            # Standard smooth IDF formula
            self.idf[idx] = math.log((1 + self.doc_count) / (1 + doc_freqs[word])) + 1

    def transform_single(self, text):
        if not self.vocab:
            return np.array([])
        
        tokens = self._tokenize(text)
        vector = np.zeros(len(self.vocab))
        if not tokens:
            return vector

        # Term frequency
        tf = {}
        for token in tokens:
            if token in self.vocab:
                idx = self.vocab[token]
                tf[idx] = tf.get(idx, 0) + 1

        # Calculate TF-IDF
        for idx, count in tf.items():
            term_freq = count / len(tokens)
            vector[idx] = term_freq * self.idf[idx]
        
        # Normalize
        norm = np.linalg.norm(vector)
        if norm > 0:
            vector = vector / norm
            
        return vector


class EmbeddingProvider:
    """Provides vector embeddings using API clients or a local fallback."""
    def __init__(self, use_fallback=True):
        self.gemini_key = os.environ.get("GEMINI_API_KEY")
        self.openai_key = os.environ.get("OPENAI_API_KEY")
        self.use_fallback = use_fallback
        self.vectorizer = None

    def initialize_local_vectorizer(self, corpus):
        self.vectorizer = SimpleTFIDFVectorizer()
        self.vectorizer.fit(corpus)

    def get_embedding(self, text):
        # Gemini API
        if self.gemini_key and not self.use_fallback:
            try:
                url = f"https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key={self.gemini_key}"
                headers = {"Content-Type": "application/json"}
                payload = {
                    "model": "models/text-embedding-004",
                    "content": {"parts": [{"text": text}]}
                }
                response = requests.post(url, headers=headers, json=payload, timeout=5)
                if response.status_code == 200:
                    return response.json()["embedding"]["values"]
            except Exception:
                pass  # Fall back to local on error

        # OpenAI API
        if self.openai_key and not self.use_fallback:
            try:
                url = "https://api.openai.com/v1/embeddings"
                headers = {
                    "Content-Type": "application/json",
                    "Authorization": f"Bearer {self.openai_key}"
                }
                payload = {
                    "model": "text-embedding-3-small",
                    "input": text
                }
                response = requests.post(url, headers=headers, json=payload, timeout=5)
                if response.status_code == 200:
                    return response.json()["data"][0]["embedding"]
            except Exception:
                pass  # Fall back to local on error

        # Keyless Fallback (Local Vectorizer)
        if self.vectorizer:
            return self.vectorizer.transform_single(text).tolist()
        
        return []


class VectorStore:
    """Lightweight vector and metadata store using JSON serialization."""
    def __init__(self, db_path="data/knowledge_store.json"):
        self.db_path = db_path
        self.chunks = []  # List of dicts containing text, metadata, etc.
        self.embeddings = []  # List of lists/arrays (raw vector values)
        self.provider = EmbeddingProvider(use_fallback=True)

    def add_chunk(self, text, metadata):
        self.chunks.append({
            "text": text,
            "metadata": metadata
        })

    def build_index(self):
        """Build/rebuild the search index (especially for the TF-IDF vectorizer)."""
        corpus = [chunk["text"] for chunk in self.chunks]
        self.provider.initialize_local_vectorizer(corpus)
        
        self.embeddings = []
        for chunk in self.chunks:
            vector = self.provider.get_embedding(chunk["text"])
            self.embeddings.append(vector)

    def save(self):
        os.makedirs(os.path.dirname(self.db_path), exist_ok=True)
        data = {
            "chunks": self.chunks,
            # Embeddings will be re-computed on load/build to ensure compatibility with index vocabulary
        }
        with open(self.db_path, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)

    def load(self):
        if not os.path.exists(self.db_path):
            return False
        
        with open(self.db_path, "r", encoding="utf-8") as f:
            data = json.load(f)
            self.chunks = data.get("chunks", [])
            
        if self.chunks:
            self.build_index()
        return True

    def search(self, query, crop=None, crop_stage=None, topic=None, top_k=3):
        """Search query with cosine similarity and metadata filtering."""
        if not self.chunks or not query or not query.strip():
            return []

        # Get query embedding
        query_vector = self.provider.get_embedding(query)
        if not query_vector or len(query_vector) == 0:
            return []

        query_vector = np.array(query_vector)
        query_norm = np.linalg.norm(query_vector)

        matches = []
        for idx, chunk in enumerate(self.chunks):
            metadata = chunk["metadata"]
            
            # Apply crop filter (case-insensitive)
            if crop and metadata.get("crop", "").lower() != crop.lower():
                continue
                
            # Apply crop stage filter (case-insensitive substring check)
            if crop_stage and crop_stage.lower() not in metadata.get("crop_stage", "").lower():
                continue
                
            # Apply topic/category filter (case-insensitive substring check)
            if topic and topic.lower() not in metadata.get("topic", "").lower():
                continue

            # Calculate cosine similarity
            chunk_vector = np.array(self.embeddings[idx])
            chunk_norm = np.linalg.norm(chunk_vector)
            
            if query_norm > 0 and chunk_norm > 0:
                score = float(np.dot(query_vector, chunk_vector) / (query_norm * chunk_norm))
            else:
                score = 0.0

            matches.append({
                "chunk": chunk,
                "score": score
            })

        # Sort by similarity score descending
        matches.sort(key=lambda x: x["score"], reverse=True)
        return matches[:top_k]
