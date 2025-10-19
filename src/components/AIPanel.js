import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { aiAPI } from '../services/api';
import { Sparkles, MessageSquare, Send, Brain } from 'lucide-react';

function AIPanel({ projectId, tasks }) {
  const [summary, setSummary] = useState('');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('summary');

  const handleSummarize = async () => {
    if (tasks.length === 0) {
      toast.error('No tasks to summarize');
      return;
    }

    setLoading(true);
    setActiveTab('summary');
    toast.loading('AI is analyzing your tasks...', { id: 'ai-summary' });
    try {
      const response = await aiAPI.summarize(projectId);
      setSummary(response.data.summary);
      toast.success('Summary generated!', { id: 'ai-summary' });
    } catch (error) {
      console.error('Error getting summary:', error);
      toast.error('Failed to generate summary. Check your API key.', { id: 'ai-summary' });
    } finally {
      setLoading(false);
    }
  };

  const handleAskQuestion = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;
    if (tasks.length === 0) {
      toast.error('No tasks to ask about');
      return;
    }

    setLoading(true);
    setActiveTab('qa');
    toast.loading('AI is thinking...', { id: 'ai-question' });
    try {
      const response = await aiAPI.ask(projectId, question);
      setAnswer(response.data.answer);
      toast.success('Answer ready!', { id: 'ai-question' });
    } catch (error) {
      console.error('Error asking question:', error);
      toast.error('Failed to get answer. Check your API key.', { id: 'ai-question' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-panel">
      <div className="ai-panel-header">
        <div className="ai-icon">
          <Brain size={24} />
        </div>
        <h3>AI Assistant</h3>
      </div>

      <div className="ai-actions">
        <button
          className="btn btn-primary"
          onClick={handleSummarize}
          disabled={loading || tasks.length === 0}
        >
          <Sparkles size={18} />
          {loading && activeTab === 'summary' ? 'Generating...' : 'Summarize Tasks'}
        </button>
      </div>

      {summary && activeTab === 'summary' && (
        <div className="ai-result">
          <h4>Task Summary</h4>
          <p>{summary}</p>
        </div>
      )}

      <div className="ai-input-group">
        <input
          type="text"
          className="ai-input"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask a question about your tasks..."
          disabled={loading || tasks.length === 0}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleAskQuestion(e);
            }
          }}
        />
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleAskQuestion}
          disabled={loading || !question.trim() || tasks.length === 0}
        >
          {loading && activeTab === 'qa' ? (
            'Thinking...'
          ) : (
            <>
              <Send size={18} />
              Ask
            </>
          )}
        </button>
      </div>

      {answer && activeTab === 'qa' && (
        <div className="ai-result">
          <h4>
            <MessageSquare size={18} />
            Answer
          </h4>
          <p>{answer}</p>
        </div>
      )}

      {tasks.length === 0 && (
        <div style={{ textAlign: 'center', color: '#9ca3af', marginTop: '20px' }}>
          <p>Add some tasks to use AI features</p>
        </div>
      )}
    </div>
  );
}

export default AIPanel;
