import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Calendar, Activity, Sparkles, FolderOpen } from 'lucide-react';

function Dashboard({ projects, onCreateProject, onRefresh }) {
  const [showModal, setShowModal] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const handleCreateProject = (e) => {
    e.preventDefault();
    if (projectName.trim()) {
      onCreateProject(projectName.trim());
      setProjectName('');
      setShowModal(false);
    }
  };

  const getPhaseColor = (phase) => {
    const colors = {
      1: 'bg-blue-100 text-blue-700',
      2: 'bg-purple-100 text-purple-700',
      3: 'bg-indigo-100 text-indigo-700',
      4: 'bg-violet-100 text-violet-700',
      5: 'bg-green-100 text-green-700',
    };
    return colors[phase] || colors[1];
  };

  const getPhaseName = (phase) => {
    const names = {
      1: 'Ideation',
      2: 'Research',
      3: 'Tech Stack',
      4: 'PRD Generation',
      5: 'Export',
    };
    return names[phase] || 'Ideation';
  };

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white border-r border-gray-200 transition-all duration-300 flex flex-col`}>
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#5b0e14] rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">F</span>
            </div>
            {sidebarOpen && (
              <h1 className="text-xl font-bold text-[#5b0e14]">FounderLab</h1>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 p-4">
          <button
            onClick={onRefresh}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-[#5b0e14] text-white hover:bg-[#7a1219] transition ${!sidebarOpen && 'justify-center'}`}
          >
            <FolderOpen className="w-5 h-5" />
            {sidebarOpen && <span className="font-medium">Projects</span>}
          </button>
        </div>

        {/* Toggle Sidebar */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-4 border-t border-gray-200 text-gray-500 hover:text-gray-700 text-sm"
        >
          {sidebarOpen ? '←' : '→'}
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Your Projects</h2>
              <p className="text-gray-500 mt-1">Transform your ideas into polished PRDs</p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-[#5b0e14] text-white rounded-xl font-semibold hover:bg-[#7a1219] transition shadow-lg hover:shadow-xl"
            >
              <Plus className="w-5 h-5" />
              <span>New Project</span>
            </button>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="p-8">
          {projects.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-96">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <Sparkles className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">No projects yet</h3>
              <p className="text-gray-500 mb-6">Create your first project to get started</p>
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-2 px-6 py-3 bg-[#5b0e14] text-white rounded-xl font-semibold hover:bg-[#7a1219] transition"
              >
                <Plus className="w-5 h-5" />
                <span>Create Project</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <div
                  key={project.id}
                  onClick={() => navigate(`/project/${project.id}`)}
                  className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-xl transition-all cursor-pointer group"
                >
                  {/* Canvas Preview */}
                  <div className="bg-gradient-to-br from-gray-50 to-[#5b0e14]/5 rounded-xl h-32 mb-4 flex items-center justify-center border border-gray-100">
                    <Activity className="w-12 h-12 text-[#5b0e14] opacity-50" />
                  </div>

                  {/* Project Info */}
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#5b0e14] transition">
                    {project.name}
                  </h3>

                  {/* Metadata */}
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(project.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Phase Badge */}
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-semibold ${getPhaseColor(project.phase)}`}>
                    <span>Phase {project.phase}: {getPhaseName(project.phase)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Project Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Create New Project</h3>
            <p className="text-gray-500 mb-6">Give your project a name to get started</p>

            <form onSubmit={handleCreateProject}>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="e.g., TaskMaster AI"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#5b0e14] focus:border-transparent outline-none mb-6"
                autoFocus
              />

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setProjectName('');
                  }}
                  className="flex-1 px-6 py-3 border border-gray-200 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!projectName.trim()}
                  className="flex-1 px-6 py-3 bg-[#5b0e14] text-white rounded-xl font-semibold hover:bg-[#7a1219] transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
