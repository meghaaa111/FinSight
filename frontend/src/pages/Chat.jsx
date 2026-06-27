import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import MessageBubble from '../components/MessageBubble';
import TypingIndicator from '../components/TypingIndicator';
import DocumentSidebar from '../components/DocumentSidebar';
import UploadModal from '../components/UploadModal';
import { queryDocuments, getDocuments, deleteDocument } from '../services/api';

const EXAMPLE_QUESTIONS = [
  "What are the main risk factors mentioned?",
  "Summarise the revenue performance this quarter",
  "What is the debt-to-equity ratio mentioned?",
  "How did operating expenses change year over year?"
];

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    loadDocuments();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadDocuments = async () => {
    try {
      const response = await getDocuments();
      setDocuments(response.documents);
    } catch (error) {
      console.error('Error loading documents:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    if (documents.length === 0) {
      toast.error('Please upload at least one document before asking questions');
      return;
    }

    const question = input.trim();
    setInput('');
    
    // Add user message
    const userMessage = { question, isUser: true };
    setMessages(prev => [...prev, userMessage]);
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    setIsLoading(true);

    try {
      const response = await queryDocuments(question);
      
      // Add assistant message
      const assistantMessage = {
        answer: response.answer,
        sources: response.sources,
        confidence: response.confidence,
        isUser: false
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error querying documents:', error);
      toast.error(error.response?.data?.detail || 'Failed to get answer');
      
      // Add error message
      setMessages(prev => [...prev, {
        answer: 'Sorry, I encountered an error while processing your question. Please try again.',
        sources: [],
        confidence: 'low',
        isUser: false
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExampleClick = (question) => {
    if (documents.length === 0) {
      toast.error('Please upload at least one document first');
      return;
    }
    setInput(question);
  };

  const handleDeleteDocument = async (documentId) => {
    try {
      await deleteDocument(documentId);
      toast.success('Document deleted successfully');
      loadDocuments();
    } catch (error) {
      console.error('Error deleting document:', error);
      toast.error('Failed to delete document');
    }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
    
    // Auto-resize textarea
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="flex h-[calc(100vh-64px)]">
      {/* Sidebar */}
      <DocumentSidebar
        documents={documents}
        onAddDocument={() => setShowUploadModal(true)}
        onDeleteDocument={handleDeleteDocument}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="px-8 py-6 border-b border-dark-border bg-dark-card">
          <h1 className="text-2xl font-bold text-white mb-1">
            Ask anything about your financial documents
          </h1>
          <p className="text-gray-400 text-sm">
            Get instant answers with source citations
          </p>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="max-w-2xl text-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-8"
                >
                  <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-accent-primary/10 flex items-center justify-center">
                    <svg className="w-10 h-10 text-accent-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-white mb-2">
                    Start a conversation
                  </h2>
                  <p className="text-gray-400 mb-8">
                    Try asking one of these questions:
                  </p>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {EXAMPLE_QUESTIONS.map((question, idx) => (
                    <motion.button
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      onClick={() => handleExampleClick(question)}
                      className="p-4 bg-dark-card hover:bg-dark-border border border-dark-border rounded-lg text-left transition-colors group"
                    >
                      <p className="text-sm text-gray-300 group-hover:text-white">
                        {question}
                      </p>
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto">
              {messages.map((message, idx) => (
                <MessageBubble key={idx} message={message} isUser={message.isUser} />
              ))}
              {isLoading && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t border-dark-border bg-dark-card px-8 py-4">
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSubmit} className="relative">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Ask a question about your documents..."
                disabled={isLoading}
                rows={1}
                className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-3 pr-12 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-primary resize-none disabled:opacity-50"
                style={{ minHeight: '48px', maxHeight: '120px' }}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="absolute right-2 bottom-2 p-2 bg-accent-primary hover:bg-accent-hover text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </form>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Answers are grounded in uploaded documents only.
            </p>
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      <UploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onSuccess={loadDocuments}
      />
    </div>
  );
};

export default Chat;
