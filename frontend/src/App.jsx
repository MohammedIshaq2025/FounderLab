import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Dashboard from './components/Dashboard';
import ChatWorkspace from './components/ChatWorkspace';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_BACKEND_URL || '';

function AppContent() {
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      // For now, we'll load projects from localStorage since we need a list endpoint
      const savedProjects = JSON.parse(localStorage.getItem('founderlab_projects') || '[]');
      setProjects(savedProjects);
    } catch (error) {
      console.error('Error loading projects:', error);
    }
  };

  const createProject = async (name) => {
    try {
      const response = await axios.post(`${API_URL}/api/projects`, { name });
      const newProject = {
        id: response.data.project_id,
        name: name,
        phase: 1,
        created_at: new Date().toISOString(),
        last_updated: new Date().toISOString(),
      };
      
      // Save to localStorage
      const savedProjects = JSON.parse(localStorage.getItem('founderlab_projects') || '[]');
      savedProjects.push(newProject);
      localStorage.setItem('founderlab_projects', JSON.stringify(savedProjects));
      
      setProjects(savedProjects);
      
      // Navigate to the project
      navigate(`/project/${newProject.id}`);
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  const updateProjectMetadata = (projectId, updates) => {
    const savedProjects = JSON.parse(localStorage.getItem('founderlab_projects') || '[]');
    const updatedProjects = savedProjects.map(p => 
      p.id === projectId ? { ...p, ...updates, last_updated: new Date().toISOString() } : p
    );
    localStorage.setItem('founderlab_projects', JSON.stringify(updatedProjects));
    setProjects(updatedProjects);
  };

  return (
    <Routes>
      <Route path="/" element={
        <Dashboard 
          projects={projects} 
          onCreateProject={createProject}
          onRefresh={loadProjects}
        />
      } />
      <Route path="/project/:projectId" element={
        <ChatWorkspace 
          projects={projects}
          onUpdateProject={updateProjectMetadata}
        />
      } />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;