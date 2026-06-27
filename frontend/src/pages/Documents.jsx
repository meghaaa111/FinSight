import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';
import {
  getDocuments,
  deleteDocument,
  uploadDocument,
  ingestFromURL,
  getDocumentChunks
} from '../services/api';

const documentTypeBadgeColor = {
  '10-K': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  '10-Q': 'bg-green-500/20 text-green-400 border-green-500/30',
  'Earnings Call': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  'News': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  'Other': 'bg-gray-500/20 text-gray-400 border-gray-500/30',
};

const ChunksDrawer = ({ isOpen, onClose, document, chunks }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/70 flex items-end justify-end z-50">
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          className="w-full md:w-2/3 lg:w-1/2 h-full bg-dark-card border-l border-dark-border flex flex-col"
        >
          <div className="p-6 border-b border-dark-border flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white">{document?.filename}</h2>
              <p className="text-sm text-gray-400 mt-1">{chunks.length} chunks</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-dark-border transition-colors text-gray-400 hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {chunks.map((chunk, idx) => (
              <div key={idx} className="bg-dark-bg border border-dark-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-400">
                    Chunk {chunk.chunk_index + 1}
                  </span>
                  {chunk.page_number && (
                    <span className="text-xs text-gray-500">Page {chunk.page_number}</span>
                  )}
                </div>
                <p className="text-sm text-gray-300 font-mono leading-relaxed whitespace-pre-wrap">
                  {chunk.text}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

const Documents = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [urlInput, setUrlInput] = useState('');
  const [urlIngesting, setUrlIngesting] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [chunks, setChunks] = useState([]);
  const [showChunks, setShowChunks] = useState(false);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      const response = await getDocuments();
      setDocuments(response.documents);
    } catch (error) {
      console.error('Error loading documents:', error);
      toast.error('Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  const onDrop = async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      toast.error('Only PDF files are supported');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const result = await uploadDocument(file, (progressEvent) => {
        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setUploadProgress(progress);
      });

      toast.success(`Successfully uploaded ${result.filename}`);
      loadDocuments();
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.response?.data?.detail || 'Failed to upload document');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: false,
    disabled: uploading
  });

  const handleUrlIngest = async (e) => {
    e.preventDefault();
    
    if (!urlInput.trim()) {
      toast.error('Please enter a URL');
      return;
    }

    setUrlIngesting(true);

    try {
      const result = await ingestFromURL(urlInput);
      toast.success('Successfully ingested content from URL');
      setUrlInput('');
      loadDocuments();
    } catch (error) {
      console.error('URL ingest error:', error);
      toast.error(error.response?.data?.detail || 'Failed to ingest from URL');
    } finally {
      setUrlIngesting(false);
    }
  };

  const handleDelete = async (documentId) => {
    if (!window.confirm('Are you sure you want to delete this document?')) {
      return;
    }

    try {
      await deleteDocument(documentId);
      toast.success('Document deleted successfully');
      loadDocuments();
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete document');
    }
  };

  const handleViewChunks = async (document) => {
    try {
      const response = await getDocumentChunks(document.document_id);
      setChunks(response.chunks);
      setSelectedDocument(document);
      setShowChunks(true);
    } catch (error) {
      console.error('Error loading chunks:', error);
      toast.error('Failed to load document chunks');
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-dark-bg">
      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Document Library</h1>
          <p className="text-gray-400">Manage your financial documents</p>
        </div>

        {/* Upload Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* File Upload */}
          <div className="bg-dark-card border border-dark-border rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Upload PDF</h2>
            {uploading ? (
              <div className="space-y-4">
                <div className="text-center py-8">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-accent-primary/20 flex items-center justify-center">
                    <svg className="w-6 h-6 text-accent-primary animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <p className="text-white font-medium">Uploading...</p>
                </div>
                <div className="w-full bg-dark-bg rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${uploadProgress}%` }}
                    className="h-full bg-accent-primary rounded-full"
                  />
                </div>
                <p className="text-center text-sm text-gray-400">{uploadProgress}%</p>
              </div>
            ) : (
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  isDragActive
                    ? 'border-accent-primary bg-accent-primary/10'
                    : 'border-dark-border hover:border-accent-primary/50 hover:bg-dark-bg'
                }`}
              >
                <input {...getInputProps()} />
                <svg className="w-12 h-12 mx-auto mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                {isDragActive ? (
                  <p className="text-accent-primary font-medium">Drop the PDF here</p>
                ) : (
                  <>
                    <p className="text-white font-medium mb-1">Drop PDF or click to browse</p>
                    <p className="text-sm text-gray-400">SEC filings, reports, transcripts</p>
                  </>
                )}
              </div>
            )}
          </div>

          {/* URL Ingest */}
          <div className="bg-dark-card border border-dark-border rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Ingest from URL</h2>
            <p className="text-sm text-gray-400 mb-4">
              Enter a URL to a SEC EDGAR filing or financial article
            </p>
            <form onSubmit={handleUrlIngest} className="space-y-3">
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://www.sec.gov/..."
                disabled={urlIngesting}
                className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-primary disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={urlIngesting || !urlInput.trim()}
                className="w-full px-4 py-3 bg-accent-primary hover:bg-accent-hover text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {urlIngesting ? (
                  <>
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Ingesting...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                    <span>Ingest from URL</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Documents Table */}
        <div className="bg-dark-card border border-dark-border rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-dark-border">
            <h2 className="text-lg font-semibold text-white">
              All Documents ({documents.length})
            </h2>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <svg className="animate-spin h-8 w-8 mx-auto text-accent-primary" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="text-gray-400 mt-3">Loading documents...</p>
            </div>
          ) : documents.length === 0 ? (
            <div className="p-12 text-center">
              <svg className="w-16 h-16 mx-auto text-gray-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-gray-400 mb-1">No documents yet</p>
              <p className="text-sm text-gray-500">Upload a document to get started</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-dark-bg border-b border-dark-border">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Pages</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Chunks</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date Added</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-border">
                  {documents.map((doc) => (
                    <motion.tr
                      key={doc.document_id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-dark-bg transition-colors"
                    >
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-white">{doc.filename}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex text-xs px-2 py-1 rounded border ${documentTypeBadgeColor[doc.document_type]}`}>
                          {doc.document_type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400">
                        {doc.page_count || '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400">
                        {doc.chunk_count}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400">
                        {new Date(doc.date_ingested).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleViewChunks(doc)}
                            className="px-3 py-1.5 bg-accent-primary/20 hover:bg-accent-primary/30 text-accent-primary text-sm font-medium rounded transition-colors"
                          >
                            View Chunks
                          </button>
                          <button
                            onClick={() => handleDelete(doc.document_id)}
                            className="p-1.5 hover:bg-red-500/20 text-gray-400 hover:text-red-400 rounded transition-colors"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Chunks Drawer */}
      <ChunksDrawer
        isOpen={showChunks}
        onClose={() => setShowChunks(false)}
        document={selectedDocument}
        chunks={chunks}
      />
    </div>
  );
};

export default Documents;
