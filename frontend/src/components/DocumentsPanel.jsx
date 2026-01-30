import React, { useState, useEffect } from 'react';
import api from '../lib/api';
import { FileText, Download, Loader2, File } from 'lucide-react';

const API_URL = import.meta.env.VITE_BACKEND_URL || '';

function DocumentsPanel({ projectId, refreshTrigger }) {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (projectId) {
      loadDocuments();
    }
  }, [projectId, refreshTrigger]);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/documents/${projectId}`);
      setDocuments(response.data.documents || []);
    } catch (error) {
      console.error('Error loading documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadDocument = (filePath) => {
    window.open(`${API_URL}/api/documents/download/${encodeURIComponent(filePath)}`, '_blank');
  };

  const getDocTypeLabel = (type) => {
    const labels = {
      features: 'Features',
      tech_stack: 'Tech Stack',
      prd: 'Product Requirements Document',
    };
    return labels[type] || type;
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-stone-900">
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-5 h-5 animate-spin text-terra-500" />
          </div>
        ) : documents.length > 0 ? (
          <div className="space-y-3">
            {documents.map((doc, index) => (
              <div
                key={index}
                className="p-4 bg-stone-50 dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 hover:border-terra-400/40 transition"
              >
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="w-4 h-4 text-terra-500" />
                  <span className="text-sm font-semibold text-stone-800 dark:text-stone-200">
                    {getDocTypeLabel(doc.doc_type)}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => downloadDocument(doc.md_path)}
                    className={`${doc.pdf_path ? 'flex-1' : 'w-full'} px-3 py-2 text-xs bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-600 rounded-lg hover:border-terra-500 hover:text-terra-500 transition flex items-center justify-center gap-1.5 font-medium text-stone-700 dark:text-stone-300`}
                  >
                    <Download className="w-3 h-3" />
                    Markdown
                  </button>
                  {doc.pdf_path && (
                    <button
                      onClick={() => downloadDocument(doc.pdf_path)}
                      className="flex-1 px-3 py-2 text-xs bg-terra-500 text-white rounded-lg hover:bg-terra-600 transition flex items-center justify-center gap-1.5 font-medium"
                    >
                      <Download className="w-3 h-3" />
                      PDF
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-14 h-14 bg-[#8D323A]/10 dark:bg-[#8D323A]/20 rounded-2xl flex items-center justify-center mb-4">
              <File className="w-7 h-7 text-[#8D323A]" />
            </div>
            <p className="text-sm font-semibold text-stone-700 dark:text-stone-300">No documents yet</p>
            <p className="text-[13px] text-stone-500 dark:text-stone-400 mt-1.5 text-center max-w-[260px]">
              Documents will appear here as you complete phases
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default DocumentsPanel;
