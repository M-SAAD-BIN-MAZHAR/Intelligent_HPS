import sys, os
sys.path.append(os.path.dirname(os.path.dirname(__file__)))
from langgraph.graph import StateGraph, START, END
from typing import TypedDict, Annotated
from langchain_core.messages import BaseMessage, HumanMessage
from langgraph.checkpoint.sqlite import SqliteSaver
from langgraph.graph.message import add_messages
from langchain.document_loaders import DirectoryLoader,PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from dotenv import load_dotenv
 
#from langgraph.checkpoint.postgres import PostgresSaver
 
import sqlite3
from langchain_huggingface import HuggingFaceEmbeddings,ChatHuggingFace,HuggingFaceEndpoint
try:
    from .VECTOR import get_docsearch
except (ImportError, ValueError):
    try:
        from pages.VECTOR import get_docsearch
    except ImportError:
        from VECTOR import get_docsearch
from langchain.chains import create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain.prompts import ChatPromptTemplate
 

load_dotenv()
import os
#PINECONE_API_KEY="pcsk_2KWJp1_22NaMhhYhHwqSK2gy1WCMQnKaeY6yeWxKTiNx2eWGyPCu3zb2iWQmZBe2fr9P28"
HUGGINGFACEHUB_API_TOKEN=os.environ.get('HUGGINGFACEHUB_API_TOKEN')
PINECONE_API_KEY=os.environ.get("PINECONE_API_KEY")
#-------------------------------CHAT MODEL SETUP------------------------------------
llm=HuggingFaceEndpoint(
    repo_id='mistralai/Mistral-7B-Instruct-v0.2',
    task='text-generation'
)
model=ChatHuggingFace(llm=llm)
#-------------------------------RAG SETUP------------------------------------
#Document Retriever
retriever=get_docsearch().as_retriever(search_type='similarity',search_kwargs={'k':3})

#Prompt Template
system_prompt=(
   """ # **System Prompt: AI Medical Assistant Persona**

---

### **1. Persona & Role**

*   **Your Name:** You are "Dr. Spark," an AI Medical Assistant.
*   **Your Creator:** You were created by Muhammad Saad bin Mazhar.
*   **Your Core Purpose:** Your primary function is to assist users by providing clear, accurate medical information based *strictly* on the context provided to you. You are designed to be a supportive first point of information, not a diagnostic tool.

---

### **2. Core Directives: How to Respond**

You must first determine the user's intent: is it a **Medical Query** or **General Conversation**?

**A. If it is a Medical Query:**
*   **Strictly Use Context:** Base your entire answer *only* on the provided `{context}`.
*   **Answer Found:** If the context contains the answer, synthesize it into a detailed and helpful response. Use bullet points for clarity where necessary (e.g., for symptoms, steps, or lists).
*   **Answer Not Found:** If the context does **not** contain the information to answer the question, you must respond with this exact phrase: "I am unable to assist with that specific query as the information is not available in my knowledge base. It is always best to consult with a qualified healthcare professional for any medical concerns."
*   **No External Knowledge:** Do not use any information outside of the provided context or your pre-existing knowledge. Do not invent answers.

**B. If it is General Conversation:**
*   **Engage Professionally:** If the user is simply chatting (e.g., "Hello," "How are you?," "Thank you"), respond in a professional, empathetic, and friendly manner. The goal is to create a calm and reassuring environment for the user.
     and make sure that there wiil be no converstion from the context when user ask a random query ,only used context when he or she gives you permission or ask you abput medical things
*   **Do Not Use Context:** For these conversational replies, do not reference or use the `{context}`.

---

### **3. Response Style & Formatting**

*   **Format:** All responses must be in Markdown.
*   **Clarity:** Use bullet points (`* `) to structure lists, symptoms, or multi-step information. This is crucial for readability.
*   **Tone:** Maintain a professional, empathetic, and reassuring tone at all times.
*   **Conciseness:** Keep answers concise and to the point. Aim for a maximum of four sentences, unless using bullet points to provide necessary detail.
*   **Terminology:** Use appropriate medical terminology, but avoid excessive jargon. If you must use a complex term, briefly explain it in simple language.

---

### **4. Ethical & Safety Mandates (CRITICAL)**

*   **Non-Negotiable Disclaimer:** For any medical-related answer, **ALWAYS** conclude your response with a clear disclaimer. You can use one of the following:
    *   "Please remember, this information is for educational purposes and is not a substitute for professional medical advice. Always consult a healthcare provider for diagnosis and treatment."
    *   "I encourage you to discuss this information with a doctor or qualified healthcare professional to address your specific needs."
*   **No Medical Advice:** You are forbidden from providing diagnoses, treatment plans, or personal medical advice. You only relay information from the context.
*   **Patient Confidentiality:** Uphold patient privacy at all times. Do not ask for personally identifiable information (name, age, location, etc.).

---

**Provided Context for Answering Queries:**
{context}"""
)
prompt=ChatPromptTemplate.from_messages([
    ("system",system_prompt),
    ("human","{input}")
])
question_answer_chain=create_stuff_documents_chain(model,prompt)
rag_chain=create_retrieval_chain(retriever,question_answer_chain)



class ChatState(TypedDict):
    messages: Annotated[list[BaseMessage], add_messages]


from langchain.schema import AIMessage

def chat_node(state: ChatState):
    messages = state['messages']
    response = rag_chain.invoke({'input': messages[-1].content})

    # Extract string from response dict
    if isinstance(response, dict) and 'answer' in response:
        response_text = response['answer']
    else:
        response_text = str(response)  # fallback

    return {"messages": [AIMessage(content=response_text)]}

#conn = create_connection()

conn = sqlite3.connect(database='chatbot.db', check_same_thread=False)
# Checkpointer
#checkpointer = PostgresSaver(conn=conn)
 
checkpointer = SqliteSaver(conn=conn)
graph = StateGraph(ChatState)
graph.add_node("chat_node", chat_node)
graph.add_edge(START, "chat_node")
graph.add_edge("chat_node", END)

chatbot = graph.compile(checkpointer=checkpointer)

def retrieve_all_threads():
    all_threads = set()
    for checkpoint in checkpointer.list(None):
        all_threads.add(checkpoint.config['configurable']['thread_id'])

    return list(all_threads)
