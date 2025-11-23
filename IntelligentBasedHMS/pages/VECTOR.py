from pinecone import Pinecone
from pinecone.models import ServerlessSpec
import os
from dotenv import load_dotenv
from langchain_huggingface import HuggingFaceEmbeddings


load_dotenv()
import os
PINECONE_API_KEY="pcsk_2KWJp1_22NaMhhYhHwqSK2gy1WCMQnKaeY6yeWxKTiNx2eWGyPCu3zb2iWQmZBe2fr9P28"
HUGGINGFACEHUB_API_TOKEN=os.environ.get('HUGGINGFACEHUB_API_TOKEN')
embeddings=HuggingFaceEmbeddings(model_name='sentence-transformers/all-MiniLM-L6-v2')

 
import os
from langchain_pinecone.vectorstores import PineconeVectorStore

# Set API key in environment
os.environ["PINECONE_API_KEY"] = "pcsk_2KWJp1_22NaMhhYhHwqSK2gy1WCMQnKaeY6yeWxKTiNx2eWGyPCu3zb2iWQmZBe2fr9P28"
os.environ["PINECONE_ENVIRONMENT"] = "us-east-1"

 
docsearch=PineconeVectorStore.from_existing_index(
    index_name="intelligent1",
    embedding=embeddings
)

# hpsBackend.py
def get_docsearch():
     
    return docsearch
