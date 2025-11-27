import os
from dotenv import load_dotenv
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_pinecone import PineconeVectorStore

# Load environment variables
load_dotenv()

# Set API keys from environment
PINECONE_API_KEY = os.environ.get("PINECONE_API_KEY", "pcsk_2KWJp1_22NaMhhYhHwqSK2gy1WCMQnKaeY6yeWxKTiNx2eWGyPCu3zb2iWQmZBe2fr9P28")
HUGGINGFACEHUB_API_TOKEN = os.environ.get('HUGGINGFACEHUB_API_TOKEN')
PINECONE_ENVIRONMENT = os.environ.get("PINECONE_ENVIRONMENT", "us-east-1")

# Set in environment for langchain-pinecone
os.environ["PINECONE_API_KEY"] = PINECONE_API_KEY
os.environ["PINECONE_ENVIRONMENT"] = PINECONE_ENVIRONMENT

# Initialize embeddings
embeddings = HuggingFaceEmbeddings(model_name='sentence-transformers/all-MiniLM-L6-v2')

# Initialize Pinecone vector store
docsearch = PineconeVectorStore.from_existing_index(
    index_name="intelligent1",
    embedding=embeddings
)

# hpsBackend.py
def get_docsearch():
     
    return docsearch
