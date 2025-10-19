import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { projectAPI } from '../services/api';
import { X } from 'lucide-react';
import VoiceInput from './VoiceInput';

function ProjectModal({ project, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name,
        description: project.description
      });
    }
  }, [project]);

  const handleChange = (e) => {
    console.log('ProjectModal handleChange:', e.target.name, '=', e.target.value);
    setFormData((prevFormData) => ({
      ...prevFormData,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (project) {
        await projectAPI.update(project._id, formData);
        toast.success('Project updated successfully!');
      } else {
        await projectAPI.create(formData);
        toast.success('Project created successfully!');
      }
      onClose();
    } catch (error) {
      console.error('Error saving project:', error);
      toast.error('Failed to save project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2>{project ? 'Edit Project' : 'Create New Project'}</h2>
          <button className="icon-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Project Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter project name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description * (Type or use voice 🎤)</label>
            <VoiceInput
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter project description or click the microphone to speak..."
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : project ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProjectModal;
