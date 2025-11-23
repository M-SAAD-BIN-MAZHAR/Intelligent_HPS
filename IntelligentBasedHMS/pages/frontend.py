import sys, os
sys.path.append(os.path.dirname(__file__))

import streamlit as st
from backEnd import chatbot, retrieve_all_threads
from langchain_core.messages import HumanMessage
from langchain.schema import AIMessage
from dotenv import load_dotenv
import uuid
load_dotenv()
# **************************************** utility functions *************************

def generate_thread_id():
    thread_id = uuid.uuid4()
    return thread_id

def reset_chat():
    thread_id = generate_thread_id()
    st.session_state['thread_id'] = thread_id
    add_thread(st.session_state['thread_id'])
    st.session_state['message_history'] = []

def add_thread(thread_id):
    if thread_id not in st.session_state['chat_threads']:
        st.session_state['chat_threads'].append(thread_id)

def load_conversation(thread_id):
    state = chatbot.get_state(config={'configurable': {'thread_id': thread_id}})
    messages = state.values.get('messages', [])
    
    # Convert BaseMessage to dicts for Streamlit
    message_history = []
    for msg in messages:
        if hasattr(msg, 'content'):
            role = 'user' if isinstance(msg, HumanMessage) else 'assistant'
            message_history.append({'role': role, 'content': msg.content})
    return message_history


# **************************************** Session Setup ******************************
if 'message_history' not in st.session_state:
    st.session_state['message_history'] = []

if 'thread_id' not in st.session_state:
    st.session_state['thread_id'] = generate_thread_id()

if 'chat_threads' not in st.session_state:
    st.session_state['chat_threads'] = retrieve_all_threads()

add_thread(st.session_state['thread_id'])


# **************************************** Sidebar UI *********************************

st.sidebar.title("Medical Assistant Chatbot")

if st.sidebar.button('New Chat'):
    reset_chat()

st.sidebar.header('My Conversations')

for thread_id in st.session_state['chat_threads'][::-1]:
    if st.sidebar.button(str(thread_id), key=f"thread_btn_{thread_id}"): # Added a unique key
        st.session_state['thread_id'] = thread_id
        # load_conversation already returns the history in the correct dictionary format.
        # Just assign it directly to the session state.
        st.session_state['message_history'] = load_conversation(thread_id)


# **************************************** Main UI ************************************

# loading the conversation history
for message in st.session_state['message_history']:
    with st.chat_message(message['role']):
        st.text(message['content'])

user_input = st.chat_input('Type here')

if user_input:
    from langchain_core.messages import HumanMessage, AIMessage

    # Add user message to LangGraph state and Streamlit session
    human_msg = HumanMessage(content=user_input)
    st.session_state['message_history'].append({'role': 'user', 'content': user_input})

    with st.chat_message('user'):
        st.text(user_input)

    CONFIG = {
        "configurable": {"thread_id": st.session_state["thread_id"]},
        "metadata": {"thread_id": st.session_state["thread_id"]},
        "run_name": "chat_turn",
    }

    # Define a generator for the streaming response
    def stream_generator():
        for message_chunk, metadata in chatbot.stream(
            {'messages': [human_msg]},
            config=CONFIG,
            stream_mode='messages'
        ):
            yield message_chunk.content

    # Use st.write_stream to display the response
    with st.chat_message('assistant'):
        full_ai_message = st.write_stream(stream_generator)

    # Store the complete message in history
    st.session_state['message_history'].append({'role': 'assistant', 'content': full_ai_message})

