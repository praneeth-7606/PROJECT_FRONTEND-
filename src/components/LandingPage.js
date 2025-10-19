import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Zap, Target, TrendingUp, CheckCircle, ArrowRight, Layers, Brain } from 'lucide-react';

function LandingPage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Layers size={32} />,
      title: 'Kanban Boards',
      description: 'Visualize your workflow with intuitive drag-and-drop boards'
    },
    {
      icon: <Brain size={32} />,
      title: 'AI-Powered',
      description: 'Get intelligent insights and summaries powered by Gemini AI'
    },
    {
      icon: <Zap size={32} />,
      title: 'Lightning Fast',
      description: 'Real-time updates and seamless performance'
    },
    {
      icon: <Target size={32} />,
      title: 'Goal Tracking',
      description: 'Track progress and achieve your project milestones'
    }
  ];

  const stats = [
    { number: '100%', label: 'Productivity Boost' },
    { number: 'AI', label: 'Powered Insights' },
    { number: '∞', label: 'Projects & Tasks' },
    { number: '24/7', label: 'Always Available' }
  ];

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">
            <Sparkles size={16} />
            <span>AI-Powered Project Management</span>
          </div>
          
          <h1 className="hero-title">
            Manage Projects with
            <span className="gradient-text"> Intelligence</span>
          </h1>
          
          <p className="hero-description">
            Transform the way you work with AI-powered task management, 
            intuitive Kanban boards, and real-time collaboration. 
            Built for teams that move fast.
          </p>

          <div className="hero-buttons">
            <button 
              className="btn-hero-primary"
              onClick={() => navigate('/projects')}
            >
              Get Started Free
              <ArrowRight size={20} />
            </button>
            <button className="btn-hero-secondary">
              Watch Demo
            </button>
          </div>

          <div className="hero-stats">
            {stats.map((stat, index) => (
              <div key={index} className="stat-item">
                <div className="stat-number">{stat.number}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="hero-visual">
          <div className="floating-card card-1">
            <CheckCircle size={20} color="#10b981" />
            <span>Task Completed</span>
          </div>
          <div className="floating-card card-2">
            <TrendingUp size={20} color="#3b82f6" />
            <span>Progress: 85%</span>
          </div>
          <div className="floating-card card-3">
            <Brain size={20} color="#8b5cf6" />
            <span>AI Analyzing...</span>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="features-section">
        <div className="section-header">
          <h2 className="section-title">Everything you need to succeed</h2>
          <p className="section-description">
            Powerful features designed to help you manage projects effortlessly
          </p>
        </div>

        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">
                {feature.icon}
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">Ready to boost your productivity?</h2>
          <p className="cta-description">
            Join thousands of teams already using our platform
          </p>
          <button 
            className="btn-cta"
            onClick={() => navigate('/projects')}
          >
            Start Managing Projects
            <ArrowRight size={20} />
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="landing-footer">
        <p>© 2025 TaskFlow AI. Built with React, Node.js & Gemini AI</p>
      </div>
    </div>
  );
}

export default LandingPage;
