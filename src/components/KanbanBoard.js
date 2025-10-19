import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { DndContext, DragOverlay, closestCorners, PointerSensor, useSensor, useSensors, useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { projectAPI, taskAPI } from '../services/api';
import { ArrowLeft, Plus } from 'lucide-react';
import TaskCard from './TaskCard';
import TaskModal from './TaskModal';
import AIPanel from './AIPanel';

// Droppable Column Component
function DroppableColumn({ column, children }) {
  const { setNodeRef } = useDroppable({
    id: column,
  });

  return (
    <div ref={setNodeRef} className="board-column">
      {children}
    </div>
  );
}

function KanbanBoard() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [newTaskStatus, setNewTaskStatus] = useState('To Do');
  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const columns = ['To Do', 'In Progress', 'Done'];

  useEffect(() => {
    fetchProjectAndTasks();
  }, [projectId]);

  const fetchProjectAndTasks = async () => {
    try {
      const [projectRes, tasksRes] = await Promise.all([
        projectAPI.getById(projectId),
        taskAPI.getByProject(projectId)
      ]);
      setProject(projectRes.data);
      setTasks(tasksRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const handleCreateTask = (status) => {
    setEditingTask(null);
    setNewTaskStatus(status);
    setShowTaskModal(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowTaskModal(true);
  };

  const handleDeleteTask = async (taskId) => {
    // Show custom toast confirmation
    toast((t) => (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <span style={{ fontWeight: '600' }}>Delete this task?</span>
        <span style={{ fontSize: '14px', color: '#6b7280' }}>This action cannot be undone.</span>
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
                await taskAPI.delete(taskId);
                toast.success('Task deleted successfully!');
                fetchProjectAndTasks();
              } catch (error) {
                console.error('Error deleting task:', error);
                toast.error('Failed to delete task');
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

  const handleModalClose = () => {
    setShowTaskModal(false);
    setEditingTask(null);
    fetchProjectAndTasks();
  };

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeTask = tasks.find(t => t._id === active.id);
    const overColumn = over.id;

    if (activeTask && columns.includes(overColumn) && activeTask.status !== overColumn) {
      // Update task status
      const updatedTasks = tasks.map(task =>
        task._id === activeTask._id ? { ...task, status: overColumn } : task
      );
      setTasks(updatedTasks);

      try {
        await taskAPI.update(activeTask._id, { status: overColumn });
        toast.success(`Task moved to ${overColumn}!`);
      } catch (error) {
        console.error('Error updating task:', error);
        toast.error('Failed to update task');
        fetchProjectAndTasks(); // Revert on error
      }
    }
  };

  const getTasksByStatus = (status) => {
    return tasks.filter(task => task.status === status);
  };

  const activeTask = tasks.find(t => t._id === activeId);

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading project...</p>
      </div>
    );
  }

  if (!project) {
    return <div className="loading">Project not found</div>;
  }

  return (
    <div className="kanban-container">
      <div className="board-header-section">
        <div className="board-header-top">
          <button className="btn btn-secondary" onClick={() => navigate('/projects')}>
            <ArrowLeft size={20} />
            Back to Projects
          </button>
        </div>
        <h2 className="board-title">{project.name}</h2>
        <p className="board-description">{project.description}</p>
      </div>

      <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="board-columns">
            {columns.map((column) => {
              const columnTasks = getTasksByStatus(column);
              return (
                <DroppableColumn key={column} column={column}>
                  <div className="column-header">
                    <h3>
                      {column}
                      <span className="task-count">{columnTasks.length}</span>
                    </h3>
                    <button
                      className="icon-btn"
                      onClick={() => handleCreateTask(column)}
                      title="Add task"
                    >
                      <Plus size={20} />
                    </button>
                  </div>

                  <SortableContext
                    id={column}
                    items={columnTasks.map(t => t._id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div style={{ minHeight: '400px' }}>
                      {columnTasks.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '40px 20px', color: '#9ca3af' }}>
                          <p>No tasks yet</p>
                          <p style={{ fontSize: '13px', marginTop: '8px' }}>Click + to add a task</p>
                        </div>
                      ) : (
                        columnTasks.map((task) => (
                          <TaskCard
                            key={task._id}
                            task={task}
                            onEdit={handleEditTask}
                            onDelete={handleDeleteTask}
                          />
                        ))
                      )}
                    </div>
                  </SortableContext>
                </DroppableColumn>
              );
            })}
          </div>

          <DragOverlay>
            {activeTask ? (
              <div className="drag-overlay">
                <h4>{activeTask.title}</h4>
                <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '8px' }}>{activeTask.description}</p>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>

      <AIPanel projectId={projectId} tasks={tasks} />

      {showTaskModal && (
        <TaskModal
          task={editingTask}
          projectId={projectId}
          defaultStatus={newTaskStatus}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
}

export default KanbanBoard;
