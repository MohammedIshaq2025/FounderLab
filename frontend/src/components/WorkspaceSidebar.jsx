import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Home, FileText, Download, X } from 'lucide-react';

const API_URL = import.meta.env.VITE_BACKEND_URL || '';

function WorkspaceSidebar({ onNavigateHome, onToggleFiles, showFiles, projectId }) {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);

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
      await axios.post(`${API_URL}/api/documents/generate`, {
        project_id: projectId,
        doc_type: docType,
      });
      await loadDocuments();
    } catch (error) {
      console.error('Error generating document:', error);
    }
  };

  const downloadDocument = (filePath) => {
    window.open(`${API_URL}/api/documents/download/${encodeURIComponent(filePath)}`, '_blank');
  };

  return (
    <div className="w-16 bg-white border-r border-gray-200 flex flex-col items-center py-6 gap-4">
      {/* Logo - Home */}
      <button
        onClick={onNavigateHome}
        className="w-12 h-12 bg-[#5b0e14] rounded-xl flex items-center justify-center shadow-lg hover:bg-[#7a1219] transition group relative"
        title="Home"
      >
        <Home className="w-6 h-6 text-white" />
      </button>

      <div className="w-8 h-px bg-gray-200 my-2" />

      {/* Files */}
      <button
        onClick={onToggleFiles}
        className={`w-12 h-12 rounded-xl flex items-center justify-center transition ${
          showFiles 
            ? 'bg-[#5b0e14] text-white' 
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
        title="Files"
      >
        <FileText className="w-5 h-5" />
      </button>

      {/* Files Panel */}
      {showFiles && (
        <div className="fixed left-16 top-0 h-full w-80 bg-white border-r border-gray-200 shadow-xl z-50 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Files</h3>
            <button
              onClick={onToggleFiles}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {loading ? (
              <div className="text-center text-gray-500 py-8">Loading...</div>
            ) : (
              <div className="space-y-6">
                {/* Generate Documents Section */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Generate Documents</h4>
                  <div className="space-y-2">
                    <button
                      onClick={() => generateDocument('features')}
                      className="w-full px-4 py-2.5 text-sm text-left bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition font-medium"
                    >
                      Feature Documentation
                    </button>
                    <button
                      onClick={() => generateDocument('tech_stack')}
                      className="w-full px-4 py-2.5 text-sm text-left bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition font-medium"
                    >
                      Tech Stack Documentation
                    </button>
                    <button
                      onClick={() => generateDocument('prd')}
                      className="w-full px-4 py-2.5 text-sm text-left bg-[#5b0e14]/10 text-[#5b0e14] rounded-lg hover:bg-[#5b0e14]/20 transition font-medium"
                    >
                      Complete PRD
                    </button>
                  </div>
                </div>

                {/* Generated Documents Section */}
                {documents.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Generated Documents</h4>
                    <div className="space-y-2">
                      {documents.map((doc, index) => (
                        <div
                          key={index}
                          className="p-3 bg-gray-50 rounded-lg border border-gray-200"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4 text-gray-500" />
                              <span className="text-sm font-medium text-gray-900 capitalize">
                                {doc.doc_type.replace('_', ' ')}
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => downloadDocument(doc.md_path)}
                              className="flex-1 px-3 py-1.5 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50 transition flex items-center justify-center gap-1"
                            >
                              <Download className="w-3 h-3" />
                              MD
                            </button>
                            <button
                              onClick={() => downloadDocument(doc.pdf_path)}
                              className="flex-1 px-3 py-1.5 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50 transition flex items-center justify-center gap-1"
                            >
                              <Download className="w-3 h-3" />
                              PDF
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {documents.length === 0 && !loading && (
                  <div className="text-center text-gray-400 py-8 text-sm">
                    No documents generated yet.
                    <br />
                    Use the buttons above to generate.
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
