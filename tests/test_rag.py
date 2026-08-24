import os
import unittest
import tempfile
import json
import numpy as np
from knowledge.vector_store import VectorStore, SimpleTFIDFVectorizer
from knowledge.ingest import parse_and_chunk_file, run_ingestion
from knowledge.evidence_tool import retrieve_agronomic_evidence, get_vector_store

class TestAgronomicRAG(unittest.TestCase):
    
    def setUp(self):
        # Create a temporary directory for tests
        self.test_dir = tempfile.TemporaryDirectory()
        self.db_path = os.path.join(self.test_dir.name, "test_store.json")
        self.kb_dir = os.path.join(self.test_dir.name, "knowledge_base")
        os.makedirs(self.kb_dir, exist_ok=True)
        
        # Write dummy agronomic files
        self.write_dummy_docs()

    def tearDown(self):
        self.test_dir.cleanup()

    def write_dummy_docs(self):
        # Tomato document
        tomato_doc = """Source: Test University Extension
Crop: Tomato
URL: https://example.edu/tomato
Category: Temperature, Irrigation

# Test Tomato Guide
This is the main title and introduction for the tomato test document.

## Germination Conditions
Soil temperature for tomato germination should be between 15°C and 30°C. Below 10°C germination is poor.

## Heat Stress during Flowering
Temperatures exceeding 32°C during the flowering stage cause blossom drop. Night temperatures above 21°C also impair fruit set.
"""
        with open(os.path.join(self.kb_dir, "test_tomato.md"), "w", encoding="utf-8") as f:
            f.write(tomato_doc)

        # Almond document
        almond_doc = """Source: Test ANR Extension
Crop: Almond
URL: https://example.edu/almond
Category: Irrigation, Water Potential

# Test Almond Guide
Introductory text for test almond guide.

## Midday Stem Water Potential
Midday stem water potential (SWP) for almonds should be maintained between -0.6 and -1.0 MPa under no stress. Mild stress is -1.0 to -1.4 MPa.

## Deficit Irrigation hull split
Deficit irrigation during hull split requires maintaining stem water potential between -1.4 and -1.8 MPa.
"""
        with open(os.path.join(self.kb_dir, "test_almond.md"), "w", encoding="utf-8") as f:
            f.write(almond_doc)

    def test_tfidf_vectorizer(self):
        corpus = [
            "Soil temperature for tomato germination should be warm.",
            "Deficit irrigation during hull split requires maintaining stem water potential."
        ]
        vectorizer = SimpleTFIDFVectorizer()
        vectorizer.fit(corpus)
        
        self.assertEqual(len(vectorizer.vocab), len(vectorizer.idf))
        self.assertTrue("tomato" in vectorizer.vocab)
        self.assertTrue("irrigation" in vectorizer.vocab)
        
        vec = vectorizer.transform_single("tomato germination")
        self.assertEqual(vec.shape[0], len(vectorizer.vocab))
        self.assertTrue(np.linalg.norm(vec) > 0)

    def test_ingestion_and_chunking(self):
        tomato_path = os.path.join(self.kb_dir, "test_tomato.md")
        chunks = parse_and_chunk_file(tomato_path)
        
        # Verify chunks are extracted
        self.assertTrue(len(chunks) > 0)
        
        # Verify metadata extraction
        first_chunk = chunks[0]
        self.assertEqual(first_chunk["metadata"]["crop"], "Tomato")
        self.assertEqual(first_chunk["metadata"]["source"], "Test University Extension")
        self.assertEqual(first_chunk["metadata"]["url"], "https://example.edu/tomato")
        
        # Verify section title parsing
        germination_chunk = [c for c in chunks if c["metadata"]["page_or_section"] == "Germination Conditions"][0]
        self.assertEqual(germination_chunk["metadata"]["crop_stage"], "planting")
        self.assertEqual(germination_chunk["metadata"]["topic"], "planting thresholds")

    def test_vector_store_operations(self):
        store = VectorStore(db_path=self.db_path)
        
        # Add chunks manually
        store.add_chunk("Germination soil temp should be 15-30C.", {
            "crop": "Tomato", "crop_stage": "planting", "topic": "germination", "source": "Test Source"
        })
        store.add_chunk("Almond SWP is -1.4 to -1.8 MPa.", {
            "crop": "Almond", "crop_stage": "irrigation", "topic": "water stress", "source": "Test Source"
        })
        
        # Build index and save
        store.build_index()
        store.save()
        
        self.assertTrue(os.path.exists(self.db_path))
        
        # Load and verify
        new_store = VectorStore(db_path=self.db_path)
        self.assertTrue(new_store.load())
        self.assertEqual(len(new_store.chunks), 2)

    def test_search_and_filtering(self):
        store = VectorStore(db_path=self.db_path)
        store.add_chunk("Tomato seeds germinate at 20 degrees.", {
            "crop": "Tomato", "crop_stage": "planting", "topic": "germination", "source": "Source A", "chunk_id": "c1"
        })
        store.add_chunk("Tomato flowers drop above 32 degrees heat.", {
            "crop": "Tomato", "crop_stage": "flowering", "topic": "heat stress", "source": "Source B", "chunk_id": "c2"
        })
        store.add_chunk("Almond trees need water at hull split.", {
            "crop": "Almond", "crop_stage": "irrigation", "topic": "irrigation", "source": "Source C", "chunk_id": "c3"
        })
        store.build_index()
        
        # Test crop filtering
        results = store.search("degrees", crop="Tomato")
        self.assertEqual(len(results), 2)
        for r in results:
            self.assertEqual(r["chunk"]["metadata"]["crop"], "Tomato")
            
        # Test crop stage filtering
        results_flowering = store.search("degrees", crop="Tomato", crop_stage="flowering")
        self.assertEqual(len(results_flowering), 1)
        self.assertEqual(results_flowering[0]["chunk"]["metadata"]["chunk_id"], "c2")
        
        # Test topic filtering
        results_irrigation = store.search("water", topic="irrigation")
        self.assertEqual(len(results_irrigation), 1)
        self.assertEqual(results_irrigation[0]["chunk"]["metadata"]["chunk_id"], "c3")
        
        # Test top_k
        results_k = store.search("degrees", top_k=1)
        self.assertEqual(len(results_k), 1)

    def test_almond_mild_stress_regression(self):
        # Build vector store using the dummy files
        store = VectorStore(db_path=self.db_path)
        
        # Add actual dummy docs to store
        tomato_chunks = parse_and_chunk_file(os.path.join(self.kb_dir, "test_tomato.md"))
        almond_chunks = parse_and_chunk_file(os.path.join(self.kb_dir, "test_almond.md"))
        
        for c in tomato_chunks + almond_chunks:
            store.add_chunk(c["text"], c["metadata"])
            
        store.build_index()
        
        # Test Query 3 matching
        results = store.search(
            "What is the stem water potential threshold for mild stress in almond trees?",
            crop="Almond",
            crop_stage="irrigation",
            topic="irrigation",
            top_k=2
        )
        
        self.assertTrue(len(results) > 0)
        # The top result should contain the mild stress SWP range
        top_text = results[0]["chunk"]["text"]
        self.assertIn("-1.0 to -1.4 MPa", top_text)

    def test_edge_cases(self):
        store = VectorStore(db_path=self.db_path)
        store.add_chunk("Test content", {"crop": "Tomato"})
        store.build_index()
        
        # Empty query
        self.assertEqual(len(store.search("")), 0)
        self.assertEqual(len(store.search("   ")), 0)
        
        # Query with no vocabulary match
        results = store.search("xyzabc123")
        self.assertTrue(len(results) > 0) # Should still return chunks but with 0 score (or low score)
        self.assertEqual(results[0]["score"], 0.0)

    def test_crop_scope_guard_blocks_unknown_crop(self):
        """Unknown/unsupported crops must return zero evidence and zero citations.

        The Crop Scope Guard in retrieve_agronomic_evidence() must prevent
        cross-crop leakage: a pineapple query must not cite Tomato or Almond
        chunks even when those chunks have high semantic similarity scores.
        """
        # crop=None (unrecognised crop from goal parser)
        results_none_crop = retrieve_agronomic_evidence(
            query="What is the optimal temperature for growing pineapples?",
            crop=None
        )
        self.assertEqual(
            len(results_none_crop), 0,
            "crop=None must return empty — no cross-crop citations allowed."
        )

        # crop explicitly set to an unsupported crop name
        results_unknown = retrieve_agronomic_evidence(
            query="What is the optimal temperature for pineapples during flowering?",
            crop="Pineapple"
        )
        self.assertEqual(
            len(results_unknown), 0,
            "An unsupported crop must return empty — must not cite Tomato/Almond evidence."
        )

        # Verify crops returned are ONLY the requested crop (no leakage)
        results_tomato = retrieve_agronomic_evidence(
            query="What temperature causes tomato flower stress?",
            crop="Tomato"
        )
        if results_tomato:  # If knowledge base is loaded
            returned_crops = {r["crop"] for r in results_tomato}
            self.assertTrue(
                returned_crops.issubset({"Tomato"}),
                f"Tomato query returned non-Tomato chunks: {returned_crops}"
            )

if __name__ == "__main__":
    unittest.main()
