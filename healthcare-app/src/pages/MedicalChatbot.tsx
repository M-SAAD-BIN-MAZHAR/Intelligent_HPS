import {
  Box,
  Container,
  Typography,
  TextField,
  IconButton,
  Stack,
  Paper,
  Avatar,
  Divider,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, ArrowLeft, Send, Plus, Trash2 } from 'lucide-react';
import { GlassCard } from '../components';
import { useState, useRef, useEffect } from 'react';
import { useStore } from '../store/useStore';
import apiClient from '../services/api';
import type { Message, ChatThread } from '../types';

const MotionBox = motion(Box);

export const MedicalChatbot = () => {
  const navigate = useNavigate();
  const user = useStore((state) => state.user);
  const threads = useStore((state) => state.threads);
  const currentThreadId = useStore((state) => state.currentThreadId);
  const setCurrentThread = useStore((state) => state.setCurrentThread);
  const addThread = useStore((state) => state.addThread);

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Load messages from current thread
  useEffect(() => {
    if (currentThreadId) {
      const thread = threads.find((t) => t.id === currentThreadId);
      if (thread) {
        setMessages(thread.messages);
      }
    }
  }, [currentThreadId, threads]);

  const handleCreateNewThread = () => {
    const newThread: ChatThread = {
      id: `thread_${Date.now()}`,
      messages: [],
      createdAt: new Date(),
    };
    addThread(newThread);
    setCurrentThread(newThread.id);
    setMessages([]);
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      // Call the chatbot API
      const response = await apiClient.post('/chat', {
        message: userMessage.content,
        thread_id: currentThreadId || undefined,
      });

      const aiMessage: Message = {
        id: `msg_${Date.now() + 1}`,
        role: 'assistant',
        content: response.data.assistant,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);

      // Update thread ID if it's a new conversation
      if (!currentThreadId && response.data.thread_id) {
        setCurrentThread(response.data.thread_id);
      }
    } catch (error) {
      const errorMessage: Message = {
        id: `msg_${Date.now() + 1}`,
        role: 'assistant',
        content:
          'Sorry, I encountered an error processing your message. Please ensure the backend API is running and try again.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleDeleteThread = (threadId: string) => {
    // Implementation for deleting thread
    if (currentThreadId === threadId) {
      setCurrentThread('');
      setMessages([]);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        py: 4,
      }}
    >
      <Container maxWidth="xl">
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton
              onClick={() => navigate('/patient/dashboard')}
              sx={{ color: 'text.secondary' }}
            >
              <ArrowLeft size={24} />
            </IconButton>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h4" fontWeight={700}>
                Medical Chatbot
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Get instant answers to your health questions
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 3, height: 'calc(100vh - 200px)' }}>
            {/* Sidebar - Conversation History */}
            <GlassCard
              sx={{
                width: 280,
                p: 2,
                display: { xs: 'none', md: 'flex' },
                flexDirection: 'column',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6" fontWeight={600}>
                  Conversations
                </Typography>
                <IconButton
                  size="small"
                  onClick={handleCreateNewThread}
                  sx={{
                    background: 'rgba(139, 92, 246, 0.1)',
                    '&:hover': {
                      background: 'rgba(139, 92, 246, 0.2)',
                    },
                  }}
                >
                  <Plus size={20} color="#8b5cf6" />
                </IconButton>
              </Box>

              <Divider sx={{ mb: 2 }} />

              <Box sx={{ flex: 1, overflow: 'auto' }}>
                {threads.length === 0 ? (
                  <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
                    No conversations yet
                  </Typography>
                ) : (
                  <Stack spacing={1}>
                    {threads.map((thread) => (
                      <Paper
                        key={thread.id}
                        sx={{
                          p: 1.5,
                          cursor: 'pointer',
                          background:
                            currentThreadId === thread.id
                              ? 'rgba(139, 92, 246, 0.1)'
                              : 'rgba(148, 163, 184, 0.05)',
                          border:
                            currentThreadId === thread.id
                              ? '1px solid rgba(139, 92, 246, 0.3)'
                              : '1px solid transparent',
                          '&:hover': {
                            background: 'rgba(139, 92, 246, 0.1)',
                          },
                        }}
                        onClick={() => setCurrentThread(thread.id)}
                      >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography variant="body2" fontWeight={600} noWrap>
                              {thread.messages[0]?.content.slice(0, 30) || 'New conversation'}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {new Date(thread.createdAt).toLocaleDateString()}
                            </Typography>
                          </Box>
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteThread(thread.id);
                            }}
                            sx={{ ml: 1 }}
                          >
                            <Trash2 size={16} />
                          </IconButton>
                        </Box>
                      </Paper>
                    ))}
                  </Stack>
                )}
              </Box>
            </GlassCard>

            {/* Main Chat Area */}
            <GlassCard sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: 0, overflow: 'hidden' }}>
              {/* Chat Header */}
              <Box sx={{ p: 3, borderBottom: '1px solid rgba(148, 163, 184, 0.1)' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box
                    sx={{
                      display: 'inline-flex',
                      p: 1.5,
                      borderRadius: 2,
                      background: 'rgba(139, 92, 246, 0.1)',
                    }}
                  >
                    <MessageCircle size={24} color="#8b5cf6" />
                  </Box>
                  <Box>
                    <Typography variant="h6" fontWeight={600}>
                      Medical Assistant
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Always available to help
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* Messages Area */}
              <Box
                sx={{
                  flex: 1,
                  overflow: 'auto',
                  p: 3,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                }}
              >
                {messages.length === 0 ? (
                  <Box
                    sx={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection: 'column',
                      gap: 2,
                    }}
                  >
                    <MessageCircle size={64} color="#8b5cf6" style={{ opacity: 0.3 }} />
                    <Typography variant="h6" color="text.secondary">
                      Start a conversation
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', maxWidth: 400 }}>
                      Ask me anything about your health, symptoms, medications, or general wellness questions.
                    </Typography>
                  </Box>
                ) : (
                  <>
                    <AnimatePresence>
                      {messages.map((message) => (
                        <MotionBox
                          key={message.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          sx={{
                            display: 'flex',
                            gap: 2,
                            alignItems: 'flex-start',
                            flexDirection: message.role === 'user' ? 'row-reverse' : 'row',
                          }}
                        >
                          <Avatar
                            sx={{
                              width: 36,
                              height: 36,
                              background:
                                message.role === 'user'
                                  ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                                  : 'rgba(139, 92, 246, 0.1)',
                              color: message.role === 'user' ? 'white' : '#8b5cf6',
                            }}
                          >
                            {message.role === 'user' ? user?.firstName?.[0] || 'U' : 'AI'}
                          </Avatar>
                          <Paper
                            sx={{
                              p: 2,
                              maxWidth: '70%',
                              background:
                                message.role === 'user'
                                  ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                                  : 'rgba(148, 163, 184, 0.05)',
                              color: message.role === 'user' ? 'white' : 'text.primary',
                            }}
                          >
                            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                              {message.content}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{
                                mt: 1,
                                display: 'block',
                                opacity: 0.7,
                              }}
                            >
                              {new Date(message.timestamp).toLocaleTimeString()}
                            </Typography>
                          </Paper>
                        </MotionBox>
                      ))}
                    </AnimatePresence>

                    {isTyping && (
                      <MotionBox
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}
                      >
                        <Avatar
                          sx={{
                            width: 36,
                            height: 36,
                            background: 'rgba(139, 92, 246, 0.1)',
                            color: '#8b5cf6',
                          }}
                        >
                          AI
                        </Avatar>
                        <Paper sx={{ p: 2, background: 'rgba(148, 163, 184, 0.05)' }}>
                          <Typography variant="body2" color="text.secondary">
                            Typing...
                          </Typography>
                        </Paper>
                      </MotionBox>
                    )}

                    <div ref={messagesEndRef} />
                  </>
                )}
              </Box>

              {/* Input Area */}
              <Box sx={{ p: 3, borderTop: '1px solid rgba(148, 163, 184, 0.1)' }}>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-end' }}>
                  <TextField
                    fullWidth
                    multiline
                    maxRows={4}
                    placeholder="Type your message here..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={isTyping}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        background: 'rgba(148, 163, 184, 0.05)',
                      },
                    }}
                  />
                  <IconButton
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isTyping}
                    sx={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)',
                      },
                      '&:disabled': {
                        background: 'rgba(148, 163, 184, 0.2)',
                        color: 'rgba(148, 163, 184, 0.5)',
                      },
                    }}
                  >
                    <Send size={20} />
                  </IconButton>
                </Box>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  Press Enter to send, Shift+Enter for new line
                </Typography>
              </Box>
            </GlassCard>
          </Box>

          {/* Disclaimer */}
          <Box sx={{ mt: 3, p: 2, background: 'rgba(148, 163, 184, 0.1)', borderRadius: 2 }}>
            <Typography variant="caption" color="text.secondary">
              <strong>Important:</strong> This chatbot provides general health information only and is not a
              substitute for professional medical advice, diagnosis, or treatment. Always consult with a
              qualified healthcare provider for medical concerns.
            </Typography>
          </Box>
        </MotionBox>
      </Container>
    </Box>
  );
};
