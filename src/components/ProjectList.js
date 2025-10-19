import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { projectAPI } from '../services/api';
import { Plus, Trash2, Edit, FolderOpen, Calendar, ArrowLeft } from 'lucide-react';
import ProjectModal from './ProjectModal';

function ProjectList() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await projectAPI.getAll();
      setProjects(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setLoading(false);
    }
  };

  const handleCreateProject = () => {
    setEditingProject(null);
    setShowModal(true);
  };

  const handleEditProject = (e, project) => {
    e.stopPropagation();
    setEditingProject(project);
    setShowModal(true);
  };

  const handleDeleteProject = async (e, projectId) => {
    e.stopPropagation();
    // Show custom toast confirmation
    toast((t) => (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <span style={{ fontWeight: '600' }}>Delete this project?</span>
        <span style={{ fontSize: '14px', color: '#6b7280' }}>All tasks will be permanently deleted.</span>
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
          <button
            onClick={() => toast.dismiss(t.id)}
            style={{
              padding: '8px 16px',
              background: '#f3f4f6',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            Cancel
          </button>
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                await projectAPI.delete(projectId);
                toast.success('Project deleted successfully!');
                fetchProjects();
              } catch (error) {
                console.error('Error deleting project:', error);
                toast.error('Failed to delete project');
              }
            }}
            style={{
              padding: '8px 16px',
              background: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            Delete
          </button>
        </div>
      </div>
    ), {
      duration: Infinity,
      style: { minWidth: '300px' }
    });
  };

  const handleProjectClick = (projectId) => {
    navigate(`/project/${projectId}`);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingProject(null);
    fetchProjects();
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading projects...</p>
      </div>
    );
  }

  return (
    <div className="projects-container">
      <div className="projects-header">
        <div>
          <button className="btn btn-secondary" onClick={() => navigate('/')} style={{ marginBottom: '12px' }}>
            <ArrowLeft size={20} />
            Back to Home
          </button>
          <h1>My Projects</h1>
        </div>
        <div className="header-actions">
          <button className="btn btn-primary" onClick={handleCreateProject}>
            <Plus size={20} />
            New Project
          </button>
        </div>
      </div>

      {projects.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <FolderOpen size={48} />
          </div>
          <h3>No projects yet</h3>
          <p>Create your first project to start managing tasks with AI-powered insights</p>
          <button className="btn btn-primary" onClick={handleCreateProject}>
            <Plus size={20} />
            Create Your First Project
          </button>
        </div>
      ) : (
        <div className="project-grid">
          {projects.map((project) => (
            <div key={project._id} className="project-card" onClick={() => handleProjectClick(project._id)}>
              <div className="project-card-header">
                <div>
                  <h3>{project.name}</h3>
                </div>
                <div className="project-card-actions">
                  <button
                    className="icon-btn"
                    onClick={(e) => handleEditProject(e, project)}
                    title="Edit project"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    className="icon-btn danger"
                    onClick={(e) => handleDeleteProject(e, project._id)}
                    title="Delete project"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <p>{project.description}</p>
              <div className="project-date">
                <Calendar size={14} />
                <span>{new Date(project.createdDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <ProjectModal
          project={editingProject}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
}

export default ProjectList;
