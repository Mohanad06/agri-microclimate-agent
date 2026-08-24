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


def get_known_crops(store) -> set:
    """Return the set of crop names (lowercase) that exist in the loaded knowledge base."""
    return {
        chunk["metadata"].get("crop", "").lower()
        for chunk in store.chunks
        if chunk.get("metadata") and chunk["metadata"].get("crop")
    }


def retrieve_agronomic_evidence(
    query: str,
    crop: str = None,
    crop_stage: str = None,
    topic: str = None,
    top_k: int = 3
) -> list[dict]:
    """Retrieve structured agronomic evidence from the RAG store.

    Args:
        query:      The natural language search query.
        crop:       Mandatory crop filter (e.g. 'Tomato').
                    If None, retrieval is blocked — an unrecognised crop must
                    never produce cross-crop citations.
        crop_stage: Optional crop growth stage filter.
        topic:      Optional topic filter.
        top_k:      Maximum number of results to return.

    Returns:
        A list of structured, source-cited evidence dicts, or [] when the
        crop is unknown/unsupported or not present in the knowledge base.
    """
    if not query or not query.strip():
        return []

    store = get_vector_store()

    # If the store has no chunks loaded, return empty list
    if not store.chunks:
        return []

    # ── Crop Scope Guard ──────────────────────────────────────────────────────
    # Without an explicit, recognised crop filter we cannot guarantee that
    # retrieved chunks are relevant to the user's query.  An unfiltered
    # semantic search returns the closest-matching tomato/almond chunks even
    # for an unknown crop (e.g. pineapple), creating false cross-crop citations.
    #
    # Policy:
    #   • crop=None  → caller could not identify a supported crop.
    #                  Return [] immediately to prevent any citation leakage.
    #   • crop given → verify it exists in the knowledge base.
    #                  If not present, return [] rather than citing unrelated
    #                  evidence from another crop.
    if crop is None:
        return []

    known_crops = get_known_crops(store)
    if crop.lower() not in known_crops:
        # Requested crop is not present in the knowledge base.
        return []
    # ─────────────────────────────────────────────────────────────────────────

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
