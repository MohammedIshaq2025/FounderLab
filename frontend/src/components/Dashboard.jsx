import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Sparkles,
  Trash2,
  PanelLeftClose,
  PanelLeftOpen,
  Clock,
  Calendar,
  ChevronRight,
  User,
  Settings,
  LogOut,
  Folder,
  Star,
  Search,
} from 'lucide-react';
import ConfirmationModal from './ConfirmationModal';
import { useAuth } from '../context/AuthContext';

function Dashboard({ projects, onCreateProject, onDeleteProject, onRefresh }) {
  const [showModal, setShowModal] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarFilter, setSidebarFilter] = useState('all');
  const [starredIds, setStarredIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('founderlab_starred') || '[]');
    } catch { return []; }
  });
  const [showAccountPopup, setShowAccountPopup] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const accountRef = useRef(null);
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (accountRef.current && !accountRef.current.contains(e.target)) {
        setShowAccountPopup(false);
      }
    };
    if (showAccountPopup) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showAccountPopup]);

  const handleCreateProject = (e) => {
    e.preventDefault();
    if (projectName.trim()) {
      onCreateProject(projectName.trim());
      setProjectName('');
      setShowModal(false);
    }
  };

  const handleDeleteProject = () => {
    if (projectToDelete) {
      onDeleteProject(projectToDelete.id);
      setProjectToDelete(null);
    }
  };

  const getPhaseColor = (phase) => {
    const colors = {
      1: 'bg-phase-1-bg dark:bg-phase-1-bg-dark text-[#E8613C]',
      2: 'bg-phase-2-bg dark:bg-phase-2-bg-dark text-[#D97706]',
      3: 'bg-phase-3-bg dark:bg-phase-3-bg-dark text-[#7C3AED]',
      4: 'bg-phase-4-bg dark:bg-phase-4-bg-dark text-[#BE123C] dark:text-[#F43F5E]',
      5: 'bg-phase-5-bg dark:bg-phase-5-bg-dark text-[#0D9488]',
    };
    return colors[phase] || colors[1];
  };

  const getPhaseAccent = (phase) => {
    const colors = {
      1: '#E8613C',
      2: '#D97706',
      3: '#7C3AED',
      4: '#BE123C',
      5: '#0D9488',
    };
    return colors[phase] || colors[1];
  };

  const getPhaseName = (phase) => {
    const names = {
      1: 'Ideation',
      2: 'Feature Mapping',
      3: 'Architecture',
      4: 'PRD Generation',
      5: 'Export',
    };
    return names[phase] || 'Ideation';
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatRelativeTime = (dateStr) => {
    if (!dateStr) return '—';
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return formatDate(dateStr);
  };

  const toggleStar = (projectId) => {
    setStarredIds((prev) => {
      const next = prev.includes(projectId)
        ? prev.filter((id) => id !== projectId)
        : [...prev, projectId];
      localStorage.setItem('founderlab_starred', JSON.stringify(next));
      return next;
    });
  };

  const filteredProjects = (
    sidebarFilter === 'starred'
      ? projects.filter((p) => starredIds.includes(p.id))
      : [...projects]
  )
    .filter((p) =>
      searchQuery.trim() === '' ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      const dateA = new Date(a.updated_at || a.last_updated || a.created_at || 0);
      const dateB = new Date(b.updated_at || b.last_updated || b.created_at || 0);
      return dateB - dateA;
    });

  const handleLogout = async () => {
    await signOut();
    navigate('/landing', { replace: true });
  };

  const techLevel = user?.user_metadata?.tech_level || '';
  const techLabels = {
    none: 'Non-technical',
    basic: 'Basic',
    intermediate: 'Intermediate',
    senior: 'Advanced',
  };

  return (
    <div className="h-screen flex flex-col bg-stone-50 dark:bg-stone-950 overflow-hidden">
      {/* Top Header Bar */}
      <header className="bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 flex-shrink-0 z-20">
        <div className="px-5 h-14 flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
          >
            <img src="/logo-black.svg" alt="FounderLab" className="h-12 dark:hidden" />
            <img src="/logo-white.svg" alt="FounderLab" className="h-12 hidden dark:block" />
          </button>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search projects..."
                className="w-full pl-10 pr-4 py-2 bg-stone-100 dark:bg-stone-800 border border-transparent focus:border-stone-300 dark:focus:border-stone-600 rounded-lg text-sm text-stone-800 dark:text-stone-200 placeholder:text-stone-400 dark:placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-stone-200 dark:focus:ring-stone-700 transition-all"
              />
            </div>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="btn-primary flex items-center gap-2 px-4 py-2.5 bg-[#842F36] dark:bg-[#963B43] text-white rounded-lg text-[13px] font-semibold hover:bg-[#6E272D] dark:hover:bg-[#7D323A]"
          >
            <Plus className="w-4 h-4" />
            New Project
          </button>
        </div>
      </header>

      {/* Body: Sidebar + Main */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`flex-shrink-0 bg-white dark:bg-stone-900 border-r border-stone-200 dark:border-stone-800 flex flex-col transition-all duration-300 ease-in-out overflow-hidden ${
            sidebarOpen ? 'w-64' : 'w-0'
          }`}
        >
          <div className="flex flex-col h-full w-64">
            <div className="px-4 pt-5 pb-1 flex items-center justify-between">
              <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-widest">
                Projects
              </span>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-1 rounded-md text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-all"
                title="Collapse sidebar"
              >
                <PanelLeftClose className="w-4 h-4" />
              </button>
            </div>

            {/* Filter Nav */}
            <div className="px-2 pb-2 space-y-0.5">
              <button
                onClick={() => setSidebarFilter('all')}
                className={`sidebar-btn w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left ${
                  sidebarFilter === 'all'
                    ? 'bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-100'
                    : 'text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800/60 hover:text-stone-800 dark:hover:text-stone-200'
                }`}
              >
                <Folder className={`w-4 h-4 transition-colors ${sidebarFilter === 'all' ? 'text-stone-700 dark:text-stone-300' : 'text-stone-400'}`} />
                <span className="text-[13px] font-medium">All Projects</span>
                <span className={`ml-auto text-[11px] font-medium ${sidebarFilter === 'all' ? 'text-stone-500 dark:text-stone-400' : 'text-stone-400'}`}>
                  {projects.length}
                </span>
              </button>
              <button
                onClick={() => setSidebarFilter('starred')}
                className={`sidebar-btn w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left ${
                  sidebarFilter === 'starred'
                    ? 'bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-100'
                    : 'text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800/60 hover:text-stone-800 dark:hover:text-stone-200'
                }`}
              >
                <Star className={`w-4 h-4 transition-colors ${sidebarFilter === 'starred' ? 'text-amber-500' : 'text-stone-400'}`} />
                <span className="text-[13px] font-medium">Starred</span>
                <span className={`ml-auto text-[11px] font-medium ${sidebarFilter === 'starred' ? 'text-stone-500 dark:text-stone-400' : 'text-stone-400'}`}>
                  {starredIds.filter((id) => projects.some((p) => p.id === id)).length}
                </span>
              </button>
            </div>

            <div className="flex-1" />

            {/* Sidebar Footer — User Account */}
            <div className="border-t border-stone-200 dark:border-stone-800 px-3 py-3 relative" ref={accountRef}>
              <button
                onClick={() => setShowAccountPopup((prev) => !prev)}
                className="w-full flex items-center gap-2.5 rounded-lg hover:bg-stone-50 dark:hover:bg-stone-800 p-1 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-stone-200 dark:bg-stone-700 flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-stone-500 dark:text-stone-400" />
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-[13px] font-medium text-stone-800 dark:text-stone-200 truncate">
                    {user?.user_metadata?.full_name || 'Founder'}
                  </p>
                  <p className="text-[11px] text-stone-400 truncate">
                    {user?.email || techLabels[techLevel] || 'FounderLab User'}
                  </p>
                </div>
              </button>

              {showAccountPopup && (
                <div className="absolute bottom-full left-3 right-3 mb-2 bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 shadow-lg dark:shadow-2xl dark:shadow-black/30 overflow-hidden animate-scale-in origin-bottom">
                  <button
                    onClick={() => {
                      setShowAccountPopup(false);
                      navigate('/settings');
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-stone-50 dark:hover:bg-stone-700 transition-colors"
                  >
                    <Settings className="w-4 h-4 text-stone-500 dark:text-stone-400" />
                    <span className="text-[13px] font-medium text-stone-700 dark:text-stone-300">Settings</span>
                  </button>
                  <div className="border-t border-stone-100 dark:border-stone-700" />
                  <button
                    onClick={() => {
                      setShowAccountPopup(false);
                      handleLogout();
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                  >
                    <LogOut className="w-4 h-4 text-red-400" />
                    <span className="text-[13px] font-medium text-red-500">Log Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto">
          {!sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(true)}
              className="fixed left-3 top-[72px] z-10 p-1.5 rounded-lg bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 hover:border-stone-300 dark:hover:border-stone-600 shadow-sm transition-all"
              title="Expand sidebar"
            >
              <PanelLeftOpen className="w-4 h-4" />
            </button>
          )}

          <div className={`px-8 py-10 ${projects.length > 0 ? 'max-w-4xl mx-auto' : ''}`}>
            <div className="mb-8">
              <h1 className="text-[28px] font-bold tracking-tight text-stone-950 dark:text-stone-100">
                {sidebarFilter === 'starred' ? 'Starred Projects' : 'Your Projects'}
              </h1>
              <p className="text-[14px] text-stone-500 dark:text-stone-400 mt-1">
                {sidebarFilter === 'starred'
                  ? 'Your bookmarked projects for quick access'
                  : 'Transform your ideas into polished PRDs'}
              </p>
            </div>

            {filteredProjects.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24">
                <div className="w-16 h-16 bg-stone-100 dark:bg-stone-800 rounded-2xl flex items-center justify-center mb-5">
                  {searchQuery.trim() !== '' ? (
                    <Search className="w-8 h-8 text-stone-400" />
                  ) : sidebarFilter === 'starred' ? (
                    <Star className="w-8 h-8 text-stone-400" />
                  ) : (
                    <Sparkles className="w-8 h-8 text-stone-400" />
                  )}
                </div>
                <h3 className="text-lg font-semibold text-stone-950 dark:text-stone-100 mb-1">
                  {searchQuery.trim() !== ''
                    ? 'No matching projects'
                    : sidebarFilter === 'starred'
                    ? 'No starred projects'
                    : 'No projects yet'}
                </h3>
                <p className="text-sm text-stone-500 dark:text-stone-400">
                  {searchQuery.trim() !== ''
                    ? `No projects found for "${searchQuery}"`
                    : sidebarFilter === 'starred'
                    ? 'Star a project to bookmark it here'
                    : 'Create your first project to get started'}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredProjects.map((project, index) => (
                  <div
                    key={project.id}
                    onClick={() => navigate(`/project/${project.id}`)}
                    className="project-card bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-5 cursor-pointer group"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-[15px] font-semibold text-stone-950 dark:text-stone-100 truncate group-hover:text-[#842F36] dark:group-hover:text-[#963B43] transition-colors duration-200">
                            {project.name}
                          </h3>
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold flex-shrink-0 transition-transform duration-200 group-hover:scale-105 ${getPhaseColor(project.phase)}`}
                          >
                            {getPhaseName(project.phase)}
                          </span>
                        </div>

                        <div className="flex items-center gap-5 text-[13px] text-stone-400 dark:text-stone-500">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>Created {formatDate(project.created_at)}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            <span>
                              Edited{' '}
                              {formatRelativeTime(
                                project.last_updated || project.updated_at || project.created_at
                              )}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 flex-shrink-0 pt-0.5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleStar(project.id);
                          }}
                          className={`star-btn p-1.5 rounded-lg ${
                            starredIds.includes(project.id)
                              ? 'text-amber-500 hover:text-amber-600 starred'
                              : 'opacity-0 group-hover:opacity-100 text-stone-400 hover:text-amber-500'
                          }`}
                          title={starredIds.includes(project.id) ? 'Unstar' : 'Star'}
                        >
                          <Star
                            className="w-4 h-4"
                            fill={starredIds.includes(project.id) ? 'currentColor' : 'none'}
                          />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setProjectToDelete(project);
                          }}
                          className="delete-btn p-1.5 rounded-lg opacity-0 group-hover:opacity-100 text-stone-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
                          title="Delete project"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <ChevronRight className="chevron-icon w-4 h-4 text-stone-300 dark:text-stone-600 ml-0.5" />
                      </div>
                    </div>

                    {/* Phase Progress Bar */}
                    <div className="mt-4 flex gap-1">
                      {[1, 2, 3, 4, 5].map((p) => {
                        const isActive = p <= (project.phase || 1);
                        return (
                          <div
                            key={p}
                            className={`progress-segment h-1 flex-1 rounded-full ${isActive ? 'active' : ''}`}
                            style={{
                              backgroundColor: isActive
                                ? getPhaseAccent(project.phase)
                                : 'var(--stone-200)',
                              opacity: isActive ? 1 : 0.3,
                            }}
                          />
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Create Project Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-stone-950/50 dark:bg-black/60 flex items-center justify-center z-50 p-4"
          onClick={() => {
            setShowModal(false);
            setProjectName('');
          }}
        >
          <div
            className="bg-white dark:bg-stone-800 rounded-xl shadow-xl dark:shadow-2xl dark:shadow-black/30 max-w-md w-full p-6 animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-stone-950 dark:text-stone-100 mb-1">Create New Project</h3>
            <p className="text-sm text-stone-500 dark:text-stone-400 mb-5">Give your project a name to get started</p>

            <form onSubmit={handleCreateProject}>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="e.g., TaskMaster AI"
                className="w-full px-4 py-2.5 border border-stone-300 dark:border-stone-600 rounded-lg focus:ring-2 focus:ring-stone-400 dark:focus:ring-stone-500 focus:border-transparent outline-none text-sm mb-5 bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-200 placeholder:text-stone-400"
                autoFocus
              />

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setProjectName('');
                  }}
                  className="btn-secondary flex-1 px-4 py-2.5 border border-stone-200 dark:border-stone-600 rounded-lg text-sm font-medium text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!projectName.trim()}
                  className="btn-primary flex-1 px-4 py-2.5 bg-[#842F36] dark:bg-[#963B43] text-white rounded-lg text-sm font-semibold hover:bg-[#6E272D] dark:hover:bg-[#7D323A] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Project Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!projectToDelete}
        onClose={() => setProjectToDelete(null)}
        onConfirm={handleDeleteProject}
        title="Delete Project"
        message={
          <>
            Are you sure you want to delete{' '}
            <span className="font-semibold text-stone-700 dark:text-stone-300">{projectToDelete?.name}</span>? This
            cannot be undone.
          </>
        }
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
        icon="trash"
      />
    </div>
  );
}

export default Dashboard;
