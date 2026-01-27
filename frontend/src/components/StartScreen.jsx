import React, { useState } from 'react';
import { Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';

function StartScreen({ onCreateProject }) {
  const [projectName, setProjectName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (projectName.trim()) {
      onCreateProject(projectName.trim());
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center px-4">
      <div className="max-w-3xl w-full">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-indigo-100 mb-6">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span className="text-sm font-medium text-indigo-600">AI-Powered PRD Generation</span>
          </div>
          
          <h1 className="text-6xl font-bold text-gray-900 mb-4 tracking-tight">
            FounderLab
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Transform your startup idea into a polished, AI-ready PRD through intelligent conversation and visual mind mapping
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
          <div className="p-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-8">
              Start Your Journey
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="projectName" className="block text-sm font-medium text-gray-700 mb-3">
                  What's your project name?
                </label>
                <input
                  type="text"
                  id="projectName"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="e.g., TaskMaster AI"
                  className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition text-base shadow-sm"
                  autoFocus
                />
              </div>
              
              <button
                type="submit"
                disabled={!projectName.trim()}
                className="group w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <span>Begin Ideation</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          </div>

          {/* Features Section */}
          <div className="bg-gradient-to-br from-gray-50 to-indigo-50/30 px-10 py-8 border-t border-gray-100">
            <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">Your 5-Phase Journey</h3>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <span className="text-sm font-bold text-indigo-600">1</span>
                </div>
                <div>
                  <div className="font-semibold text-sm text-gray-900">Ideation</div>
                  <div className="text-xs text-gray-500 mt-0.5">Refine your concept</div>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-sm font-bold text-purple-600">2</span>
                </div>
                <div>
                  <div className="font-semibold text-sm text-gray-900">Research</div>
                  <div className="text-xs text-gray-500 mt-0.5">Visual mind mapping</div>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-sm font-bold text-blue-600">3</span>
                </div>
                <div>
                  <div className="font-semibold text-sm text-gray-900">Tech Stack</div>
                  <div className="text-xs text-gray-500 mt-0.5">Optimal recommendations</div>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-violet-100 rounded-lg flex items-center justify-center">
                  <span className="text-sm font-bold text-violet-600">4</span>
                </div>
                <div>
                  <div className="font-semibold text-sm text-gray-900">PRD</div>
                  <div className="text-xs text-gray-500 mt-0.5">Comprehensive docs</div>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-sm font-bold text-green-600">5</span>
                </div>
                <div>
                  <div className="font-semibold text-sm text-gray-900">Export</div>
                  <div className="text-xs text-gray-500 mt-0.5">Download MD/PDF</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-8 flex items-center justify-center gap-8 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-500" />
            <span>OpenAI GPT-4o</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-500" />
            <span>Web Research</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-500" />
            <span>Export Ready</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StartScreen;