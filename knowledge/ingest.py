import os
import re
from knowledge.vector_store import VectorStore

def clean_text(text):
    return re.sub(r'\s+', ' ', text).strip()

def parse_metadata_header(content):
    """Parse metadata key-values from the first few lines of the file."""
    metadata = {}
    lines = content.split('\n')[:15]
    for line in lines:
        stripped = line.strip()
        if not stripped:
            continue
        if stripped.startswith('-') or stripped.startswith('*') or stripped.startswith('#'):
            stripped_clean = re.sub(r'^[#\-\*\s]+', '', stripped)
        else:
            stripped_clean = stripped
            
        match = re.match(r'^([\w\s_-]+):\s*(.*)$', stripped_clean)
        if match:
            key = match.group(1).strip().lower()
            val = match.group(2).strip()
            if key not in ['http', 'https', 'ftp'] and len(key) < 20:
                metadata[key] = val
    return metadata

def parse_and_chunk_file(file_path):
    """Parse markdown file, extract headers and content, and generate chunks with metadata."""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Extract file-level metadata
    header_metadata = parse_metadata_header(content)
    doc_content = content

    # Get source/crop details from header metadata or file name
    doc_source = header_metadata.get('source', 'Unknown Agricultural Source')
    doc_crop = header_metadata.get('crop', 'General')
    doc_url = header_metadata.get('url', '')
    doc_name = os.path.basename(file_path)

    chunks = []
    
    # Split content by markdown secondary headers (##)
    sections = re.split(r'^##\s+', doc_content, flags=re.MULTILINE)
    
    # First section contains the main title (#) and introduction
    intro = sections[0].strip()
    if intro:
        main_title_match = re.match(r'^#\s+(.*)', intro)
        main_title = main_title_match.group(1).split('\n')[0].strip() if main_title_match else "Overview"
        
        # Crop stage detection
        crop_stage = "general"
        if "seed" in intro.lower() or "germination" in intro.lower() or "planting" in intro.lower() or "transplant" in intro.lower():
            crop_stage = "planting"
            
        chunks.append({
            "text": clean_text(intro),
            "metadata": {
                "source": doc_source,
                "crop": doc_crop,
                "url": doc_url,
                "document": doc_name,
                "page_or_section": main_title,
                "crop_stage": crop_stage,
                "topic": "Overview"
            }
        })

    # Subsequent sections start with header title
    for section in sections[1:]:
        section = section.strip()
        if not section:
            continue
            
        lines = section.split('\n')
        section_title = lines[0].strip()
        section_body = '\n'.join(lines[1:]).strip()
        
        # Analyze crop stage
        crop_stage = "general"
        lower_title = section_title.lower()
        lower_body = section_body.lower()
        text_to_search = lower_title + " " + lower_body
        
        if "germination" in text_to_search or "planting" in text_to_search or "transplant" in text_to_search:
            crop_stage = "planting"
        elif "irrigation" in text_to_search or "water" in text_to_search or "deficit" in text_to_search or "swp" in text_to_search:
            crop_stage = "irrigation"
        elif "flower" in text_to_search or "fruit" in text_to_search or "pollination" in text_to_search or "blossom" in text_to_search:
            crop_stage = "flowering"

        # Topic tagging
        topic = "general"
        if "germination" in text_to_search or "planting" in text_to_search or "transplant" in text_to_search:
            topic = "planting thresholds"
        elif "irrigation" in text_to_search or "water" in text_to_search or "moisture" in text_to_search or "swp" in text_to_search:
            topic = "irrigation"
        elif "stress" in text_to_search or "heat" in text_to_search or "extreme" in text_to_search or "temperature" in text_to_search:
            topic = "heat stress"

        # Chunk the section body if it is too large, otherwise keep it whole
        paragraphs = [p.strip() for p in section_body.split('\n\n') if p.strip()]
        
        current_chunk_text = f"Section: {section_title}\n"
        chunk_idx = 0
        
        for p in paragraphs:
            if len(current_chunk_text) + len(p) < 1000:
                current_chunk_text += "\n" + p
            else:
                chunks.append({
                    "text": clean_text(current_chunk_text),
                    "metadata": {
                        "source": doc_source,
                        "crop": doc_crop,
                        "url": doc_url,
                        "document": doc_name,
                        "page_or_section": section_title,
                        "crop_stage": crop_stage,
                        "topic": topic
                    }
                })
                current_chunk_text = f"Section: {section_title}\n{p}"
                chunk_idx += 1
                
        if current_chunk_text:
            chunks.append({
                "text": clean_text(current_chunk_text),
                "metadata": {
                    "source": doc_source,
                    "crop": doc_crop,
                    "url": doc_url,
                    "document": doc_name,
                    "page_or_section": section_title,
                    "crop_stage": crop_stage,
                    "topic": topic
                }
            })

    return chunks

def run_ingestion():
    kb_dir = "data/knowledge_base"
    if not os.path.exists(kb_dir):
        print(f"Error: Knowledge base directory {kb_dir} does not exist.")
        return False
        
    store = VectorStore()
    doc_files = [f for f in os.listdir(kb_dir) if f.endswith('.md')]
    
    if not doc_files:
        print("No documents found in knowledge base.")
        return False
        
    print(f"Found {len(doc_files)} documents to ingest.")
    
    total_chunks = 0
    for doc in doc_files:
        path = os.path.join(kb_dir, doc)
        print(f"Parsing {doc}...")
        chunks = parse_and_chunk_file(path)
        for idx, chunk in enumerate(chunks):
            # Assign unique chunk ID
            chunk["metadata"]["chunk_id"] = f"{doc.replace('.md', '')}_chunk_{idx}"
            store.add_chunk(chunk["text"], chunk["metadata"])
            total_chunks += 1
            
    print(f"Total chunks extracted: {total_chunks}")
    print("Building index embeddings...")
    store.build_index()
    print("Saving database to knowledge_store.json...")
    store.save()
    print("Ingestion complete!")
    return True

if __name__ == "__main__":
    run_ingestion()
