import sys
from dotenv import load_dotenv
import os
import warnings
from langchain_postgres import PGVector
from langchain_openai import OpenAIEmbeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain.document_loaders import PyPDFLoader
warnings.filterwarnings("ignore")  # Ignore warnings.
load_dotenv()

CONNECTION_STRING = os.getenv('CONSTR')
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
COLLECTION_NAME = sys.argv[1]
embedding_schema = OpenAIEmbeddings(
    api_key=OPENAI_API_KEY, model="text-embedding-3-small")


def load_document(doc_path: str):
    loader = PyPDFLoader(doc_path)
    doc = loader.load()
    return doc


def createIndex(doc_paths: list[str] = None, chunk_size: int = 1000):
    if not doc_paths or len(doc_paths) < 1:
        raise ValueError("Need atleast one document")

    text_splitter = RecursiveCharacterTextSplitter(chunk_size=chunk_size)

    # Extract all the names
    all_texts = []

    for index, doc_path in enumerate(doc_paths):
        doc = load_document(doc_path)
        texts = text_splitter.split_documents(doc)
        all_texts.extend(texts)

    db = PGVector.from_documents(
        embedding=embedding_schema, documents=all_texts, collection_name=COLLECTION_NAME, connection=CONNECTION_STRING)


if __name__ == "__main__":
    doc_paths = sys.argv[2:]
    createIndex(doc_paths)
