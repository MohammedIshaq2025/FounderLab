import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Home, FileText, Download, X, File, Loader2 } from 'lucide-react';

const API_URL = import.meta.env.VITE_BACKEND_URL || '';

function WorkspaceSidebar({ onNavigateHome, onToggleFiles, showFiles, projectId }) {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(null);

  useEffect(() => {
    if (showFiles && projectId) {
      loadDocuments();
    }
  }, [showFiles, projectId]);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/documents/${projectId}`);
      setDocuments(response.data.documents || []);
    } catch (error) {
      console.error('Error loading documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateDocument = async (docType) => {
    try {
      setGenerating(docType);
      await axios.post(`${API_URL}/api/documents/generate`, {
        project_id: projectId,
        doc_type: docType,
      });
      await loadDocuments();
    } catch (error) {
      console.error('Error generating document:', error);
    } finally {
      setGenerating(null);
    }
  };

  const downloadDocument = (filePath) => {
    window.open(`${API_URL}/api/documents/download/${encodeURIComponent(filePath)}`, '_blank');
  };

  const getDocTypeLabel = (type) => {
    const labels = {
      'features': 'Features',
      'tech_stack': 'Tech Stack',
      'prd': 'PRD'
    };
    return labels[type] || type;
  };

  return (
    <div className="w-16 bg-white border-r border-gray-200 flex flex-col items-center py-4 gap-3">
      {/* Logo - Home */}
      <button
        onClick={onNavigateHome}
        className="w-10 h-10 bg-[#5b0e14] rounded-xl flex items-center justify-center shadow-md hover:bg-[#7a1219] transition group relative"
        title="Home"
      >
        <Home className="w-5 h-5 text-white" />
      </button>

      <div className="w-6 h-px bg-gray-200 my-1" />

      {/* Files */}
      <button
        onClick={onToggleFiles}
        className={`w-10 h-10 rounded-xl flex items-center justify-center transition shadow-sm ${
          showFiles 
            ? 'bg-[#5b0e14] text-white shadow-md' 
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
        title="Files"
      >
        <FileText className="w-5 h-5" />
      </button>

      {/* Files Panel */}
      {showFiles && (
        <div className="fixed left-16 top-0 h-full w-72 bg-white border-r border-gray-200 shadow-2xl z-50 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <File className="w-4 h-4 text-[#5b0e14]" />
              <h3 className="text-sm font-semibold text-gray-900">Documents</h3>
            </div>
            <button
              onClick={onToggleFiles}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-5 py-4">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-[#5b0e14]" />
              </div>
            ) : (
              <div className="space-y-6">
                {/* Generated Documents */}
                {documents.length > 0 ? (
                  <div className="space-y-2">
                    {documents.map((doc, index) => (
                      <div
                        key={index}
                        className="p-3 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 hover:border-[#5b0e14]/30 transition group"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <FileText className="w-4 h-4 text-[#5b0e14]" />
                          <span className="text-sm font-medium text-gray-900 flex-1">
                            {getDocTypeLabel(doc.doc_type)}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => downloadDocument(doc.md_path)}
                            className="flex-1 px-3 py-1.5 text-xs bg-white border border-gray-200 rounded-lg hover:border-[#5b0e14] hover:text-[#5b0e14] transition flex items-center justify-center gap-1.5 font-medium"
                          >
                            <Download className="w-3 h-3" />
                            Markdown
                          </button>
                          <button
                            onClick={() => downloadDocument(doc.pdf_path)}
                            className="flex-1 px-3 py-1.5 text-xs bg-[#5b0e14] text-white rounded-lg hover:bg-[#7a1219] transition flex items-center justify-center gap-1.5 font-medium"
                          >
                            <Download className="w-3 h-3" />
                            PDF
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <FileText className="w-6 h-6 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-500">No documents yet</p>
                    <p className="text-xs text-gray-400 mt-1">Complete phases to generate</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default WorkspaceSidebar;
