import React, { useState } from 'react';

function StartScreen({ onCreateProject }) {
  const [projectName, setProjectName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (projectName.trim()) {
      onCreateProject(projectName.trim());
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">FounderLab</h1>
          <p className="text-xl text-gray-600">
            Transform your startup idea into a polished, AI-ready PRD
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Start Your Journey
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="projectName" className="block text-sm font-medium text-gray-700 mb-2">
                What's your project name?
              </label>
              <input
                type="text"
                id="projectName"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="e.g., TaskMaster AI"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                autoFocus
              />
            </div>
            
            <button
              type="submit"
              disabled={!projectName.trim()}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Begin Ideation
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-900 mb-3">What to expect:</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">1.</span>
                <span><strong>Ideation</strong> - Refine your core concept with AI guidance</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">2.</span>
                <span><strong>Research</strong> - Define features with visual mind mapping</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">3.</span>
                <span><strong>Tech Stack</strong> - Get optimal technology recommendations</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">4.</span>
                <span><strong>PRD Generation</strong> - Receive comprehensive documentation</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">5.</span>
                <span><strong>Export</strong> - Download MD/PDF for implementation</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StartScreen;