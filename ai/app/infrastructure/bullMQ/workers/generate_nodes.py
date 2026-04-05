from llama_index.core.schema import TextNode, RelatedNodeInfo, NodeRelationship
from langchain_core.documents import Document

def generate_text_nodes(
    text_chunks: list[Document],
    syllabus_id: str,
    canvas_course_id: int,
    school_id: int,
    course_id: int,
    doc_type: str = "syllabus",
) -> list[TextNode]:
    ref_doc_id = f"syllabus:{syllabus_id}"
    nodes: list[TextNode] = []

    for i, chunk in enumerate(text_chunks):
        metadata = {
            **chunk.metadata,
            "section": chunk.metadata.get("section", "Overview") ,
            "syllabus_id": syllabus_id,
            "canvas_course_id": canvas_course_id,
            "course_id": course_id,
            "school_id": school_id,
            "document_type": doc_type,
            "chunk_index": i,
        }

        node = TextNode(
            id_=f"{ref_doc_id}:chunk:{i}",
            text=chunk.page_content,
            metadata=metadata,
            relationships={
                NodeRelationship.SOURCE: RelatedNodeInfo(node_id=ref_doc_id)
            },
        )
        nodes.append(node)

    return nodes