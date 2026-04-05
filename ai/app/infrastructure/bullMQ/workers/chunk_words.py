from langchain_text_splitters import HTMLSemanticPreservingSplitter


def chunk_syllabus(html: str):
    splitter = HTMLSemanticPreservingSplitter(headers_to_split_on=[("h1", "section"), ("h2", "section"), ("h3", "section")], elements_to_preserve=["table", "ul", "ol"])
    chunked = splitter.split_text(html)
    return chunked