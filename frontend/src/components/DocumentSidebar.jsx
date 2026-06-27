import React from 'react';
import { motion } from 'framer-motion';

const documentTypeBadgeColor = {
  '10-K': 'bg-blue-500/20 text-blue-400',
  '10-Q': 'bg-green-500/20 text-green-400',
  'Earnings Call': 'bg-purple-500/20 text-purple-400',
  'News': 'bg-yellow-500/20 text-yellow-400',
  'Other': 'bg-gray-500/20 text-gray-400',
};

const DocumentSidebar = ({ documents, onAddDocument, onDeleteDocument }) => {
  const [hoveredDoc, setHoveredDoc] = React.useState(null);

  return (
    <div className="w-72 bg-dark-card border-r border-dark-border flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-dark-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Documents</h2>
          <span className="px-2 py-1 bg-accent-primary/20 text-accent-primary text-xs font-medium rounded">
            {documents.length}
          </span>
        </div>
        <button
          onClick={onAddDocument}
          className="w-full px-4 py-2 bg-accent-primary hover:bg-accent-hover text-white font-medium rounded-lg transition-colors flex items-center justify-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Add Document</span>
        </button>
      </div>

      {/* Document List */}
      <div className="flex-1 overflow-y-auto">
        {documents.length === 0 ? (
          <div className="p-4 text-center">
            <svg className="w-12 h-12 mx-auto text-gray-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-sm text-gray-400">No documents yet</p>
            <p className="text-xs text-gray-500 mt-1">Upload a document to get started</p>
          </div>
        ) : (
          <div className="p-2 space-y-1">
            {documents.map((doc) => (
              <motion.div
                key={doc.document_id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                onMouseEnter={() => setHoveredDoc(doc.document_id)}
                onMouseLeave={() => setHoveredDoc(null)}
                className="relative p-3 rounded-lg bg-dark-bg hover:bg-dark-border transition-colors cursor-pointer group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0 pr-2">
                    <p className="text-sm font-medium text-white truncate mb-1">
                      {doc.filename}
                    </p>
                    <div className="flex items-center space-x-2">
                      <span className={`text-xs px-2 py-0.5 rounded ${documentTypeBadgeColor[doc.document_type]}`}>
                        {doc.document_type}
                      </span>
                      <span className="text-xs text-gray-500">
                        {doc.chunk_count} chunks
                      </span>
                    </div>
                  </div>
                  {hoveredDoc === doc.document_id && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteDocument(doc.document_id);
                      }}
                      className="p-1 rounded hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
                {doc.date_ingested && (
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(doc.date_ingested).toLocaleDateString()}
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentSidebar;
