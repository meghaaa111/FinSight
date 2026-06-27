import React, { useState } from 'react';
import { motion } from 'framer-motion';

const SourceCard = ({ source }) => {
  return (
    <div className="bg-dark-bg border border-dark-border rounded-lg p-3 space-y-2">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-white">{source.document_name}</p>
          {source.page_number && (
            <p className="text-xs text-gray-400">Page {source.page_number}</p>
          )}
        </div>
        <div className="text-xs font-medium text-accent-primary">
          {(source.relevance_score * 100).toFixed(0)}%
        </div>
      </div>
      <div className="bg-dark-card border border-dark-border rounded p-2">
        <p className="text-xs font-mono text-gray-300 leading-relaxed">
          {source.excerpt}
        </p>
      </div>
    </div>
  );
};

const MessageBubble = ({ message, isUser }) => {
  const [showSources, setShowSources] = useState(true);
  
  const isUnanswered = message.answer && (
    message.answer.toLowerCase().includes('could not find') ||
    message.answer.toLowerCase().includes("don't have")
  );

  if (isUser) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-end mb-4"
      >
        <div className="max-w-2xl bg-accent-primary rounded-2xl rounded-tr-sm px-4 py-3">
          <p className="text-white">{message.question}</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex justify-start mb-4"
    >
      <div className="max-w-3xl bg-dark-card rounded-2xl rounded-tl-sm border border-dark-border overflow-hidden">
        <div className="px-4 py-3">
          <div className={`prose prose-invert max-w-none ${isUnanswered ? 'text-warning' : 'text-gray-100'}`}>
            <p className="whitespace-pre-wrap leading-relaxed">{message.answer}</p>
          </div>
        </div>

        {message.sources && message.sources.length > 0 && (
          <div className="border-t border-dark-border px-4 py-3">
            <button
              onClick={() => setShowSources(!showSources)}
              className="flex items-center justify-between w-full text-left"
            >
              <span className="text-sm font-medium text-gray-300">
                Sources ({message.sources.length})
              </span>
              <svg
                className={`w-4 h-4 text-gray-400 transition-transform ${showSources ? 'transform rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showSources && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 space-y-2"
              >
                {message.sources.map((source, idx) => (
                  <SourceCard key={idx} source={source} />
                ))}
              </motion.div>
            )}
          </div>
        )}

        {message.confidence && (
          <div className="px-4 py-2 bg-dark-bg border-t border-dark-border">
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-400">Confidence:</span>
              <span className={`text-xs font-medium ${
                message.confidence === 'high' ? 'text-success' :
                message.confidence === 'medium' ? 'text-yellow-500' :
                'text-gray-400'
              }`}>
                {message.confidence.toUpperCase()}
              </span>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default MessageBubble;
