import React from 'react';

const TypingIndicator = () => {
  return (
    <div className="flex justify-start mb-4">
      <div className="bg-dark-card rounded-2xl rounded-tl-sm border border-dark-border px-4 py-3">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-gray-400 rounded-full loading-dot"></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full loading-dot"></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full loading-dot"></div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
