import os
from knowledge.vector_store import VectorStore

# Global vector store instance for caching loaded data
_vector_store_instance = None

def get_vector_store():
    global _vector_store_instance
    if _vector_store_instance is None:
        # Resolve path relative to the repository root
        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        db_path = os.path.join(base_dir, "data", "knowledge_store.json")
        store = VectorStore(db_path=db_path)
        if store.load():
            _vector_store_instance = store
        else:
            # If not yet ingested, return an empty store instance
            _vector_store_instance = store
    return _vector_store_instance

def retrieve_agronomic_evidence(
    query: str,
    crop: str = None,
    crop_stage: str = None,
    topic: str = None,
    top_k: int = 3
) -> list[dict]:
    """Retrieve structured agronomic evidence from the RAG store.
    
    Args:
        query: The natural language search query.
        crop: Optional crop filter (e.g. 'tomato').
        crop_stage: Optional crop growth stage filter (e.g. 'flowering', 'planting').
        topic: Optional topic filter (e.g. 'heat stress', 'irrigation').
        top_k: The maximum number of results to return.
        
    Returns:
        A list of dictionaries containing structured, source-cited evidence chunks.
    """
    if not query or not query.strip():
        return []

    store = get_vector_store()
    
    # If the store has no chunks loaded, return empty list
    if not store.chunks:
        return []

    results = store.search(
        query=query,
        crop=crop,
        crop_stage=crop_stage,
        topic=topic,
        top_k=top_k
    )

    formatted_results = []
    for match in results:
        chunk = match["chunk"]
        metadata = chunk["metadata"]
        formatted_results.append({
            "evidence_text": chunk["text"],
            "source": metadata.get("source", "Unknown Source"),
            "document": metadata.get("document", ""),
            "page_or_section": metadata.get("page_or_section", "General Section"),
            "chunk_id": metadata.get("chunk_id", ""),
            "crop": metadata.get("crop", "General"),
            "crop_stage": metadata.get("crop_stage", "general"),
            "topic": metadata.get("topic", "general"),
            "score": round(match["score"], 4)
        })

    return formatted_results
