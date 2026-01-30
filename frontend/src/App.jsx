import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import ChatWorkspace from './components/ChatWorkspace';
import ErrorBoundary from './components/ErrorBoundary';
import Onboarding from './components/Onboarding';
import AuthPage from './components/AuthPage';
import Settings from './components/Settings';
import Landing from './components/landing/Landing';
import Pricing from './components/landing/Pricing';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsConditions from './components/TermsConditions';
import { useAuth } from './context/AuthContext';
import api from './lib/api';
import { applyTheme, watchSystemTheme } from './theme';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

// Apply theme immediately on load (before React renders)
applyTheme();

function AppContent() {
  const [projects, setProjects] = useState([]);
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (loading) return;

    // Allow public routes without auth
    const publicRoutes = ['/auth', '/landing', '/pricing', '/privacy', '/terms'];

    if (!user) {
      // Not logged in - redirect to landing unless on public route
      if (!publicRoutes.includes(location.pathname)) {
        navigate('/landing', { replace: true });
      }
      return;
    }

    // User is logged in
    const onboarded = user.user_metadata?.onboarding_completed;

    if (!onboarded) {
      // User hasn't completed onboarding - redirect to onboarding
      // unless they're already there or on a public route
      if (location.pathname !== '/onboarding' && !publicRoutes.includes(location.pathname)) {
        navigate('/onboarding', { replace: true });
      }
    } else {
      // User is onboarded - if they're on auth page, redirect to dashboard
      if (location.pathname === '/auth') {
        navigate('/', { replace: true });
      }
    }
  }, [user, loading, location.pathname]);

  useEffect(() => {
    if (user) {
      loadProjects();
    }
  }, [user]);

  // Watch for system theme changes
  useEffect(() => {
    return watchSystemTheme();
  }, []);

  const loadProjects = async () => {
    try {
      const response = await api.get('/api/projects');
      const backendProjects = response.data.projects || [];
      setProjects(backendProjects);
      localStorage.setItem('founderlab_projects', JSON.stringify(backendProjects));
    } catch (error) {
      console.error('Error loading projects from API, falling back to localStorage:', error);
      const savedProjects = JSON.parse(localStorage.getItem('founderlab_projects') || '[]');
      setProjects(savedProjects);
    }
  };

  const createProject = async (name) => {
    try {
      const response = await api.post('/api/projects', { name });
      const newProject = {
        id: response.data.project_id,
        name: name,
        phase: 1,
        created_at: new Date().toISOString(),
        last_updated: new Date().toISOString(),
      };

      const savedProjects = JSON.parse(localStorage.getItem('founderlab_projects') || '[]');
      savedProjects.push(newProject);
      localStorage.setItem('founderlab_projects', JSON.stringify(savedProjects));

      setProjects(savedProjects);
      navigate(`/project/${newProject.id}`);
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  const deleteProject = async (projectId) => {
    try {
      await api.delete(`/api/projects/${projectId}`);
      const updated = projects.filter((p) => p.id !== projectId);
      setProjects(updated);
      localStorage.setItem('founderlab_projects', JSON.stringify(updated));
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const updateProjectMetadata = (projectId, updates) => {
    const savedProjects = JSON.parse(localStorage.getItem('founderlab_projects') || '[]');
    const updatedProjects = savedProjects.map((p) =>
      p.id === projectId ? { ...p, ...updates, last_updated: new Date().toISOString() } : p
    );
    localStorage.setItem('founderlab_projects', JSON.stringify(updatedProjects));
    setProjects(updatedProjects);
  };

  // Show loading spinner while auth state initializes
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50 dark:bg-stone-950">
        <Loader2 className="w-6 h-6 animate-spin text-terra-500" />
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/landing" element={<Landing />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />
      <Route path="/terms" element={<TermsConditions />} />
      <Route path="/auth" element={user ? <Navigate to="/" replace /> : <AuthPage />} />
      <Route
        path="/"
        element={
          user ? (
            <Dashboard
              projects={projects}
              onCreateProject={createProject}
              onDeleteProject={deleteProject}
              onRefresh={loadProjects}
            />
          ) : (
            <Navigate to="/landing" replace />
          )
        }
      />
      <Route path="/onboarding" element={user ? <Onboarding /> : <Navigate to="/auth" replace />} />
      <Route path="/settings" element={user ? <Settings /> : <Navigate to="/auth" replace />} />
      <Route
        path="/project/:projectId"
        element={
          user ? (
            <ChatWorkspace
              projects={projects}
              onUpdateProject={updateProjectMetadata}
            />
          ) : (
            <Navigate to="/auth" replace />
          )
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AppContent />
      </Router>
    </ErrorBoundary>
  );
}

export default App;
