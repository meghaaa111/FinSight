import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Document ingestion
export const uploadDocument = async (file, onUploadProgress) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await api.post('/api/ingest/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress,
  });
  
  return response.data;
};

export const ingestFromURL = async (url, documentType = 'Other') => {
  const response = await api.post('/api/ingest/url', {
    url,
    document_type: documentType,
  });
  
  return response.data;
};

// Query
export const queryDocuments = async (question, filters = null) => {
  const response = await api.post('/api/query', {
    question,
    filters,
  });
  
  return response.data;
};

// Documents
export const getDocuments = async () => {
  const response = await api.get('/api/documents');
  return response.data;
};

export const deleteDocument = async (documentId) => {
  const response = await api.delete(`/api/documents/${documentId}`);
  return response.data;
};

export const getDocumentChunks = async (documentId) => {
  const response = await api.get(`/api/documents/${documentId}/chunks`);
  return response.data;
};

// Health check
export const checkHealth = async () => {
  const response = await api.get('/api/health');
  return response.data;
};

export default api;
