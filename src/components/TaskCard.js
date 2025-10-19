import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Edit, Trash2, GripVertical } from 'lucide-react';

function TaskCard({ task, onEdit, onDelete }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={`task-card ${isDragging ? 'dragging' : ''}`}
    >
      <div className="task-card-header">
        <div className="drag-handle" {...listeners}>
          <GripVertical size={18} />
        </div>
        <h4>{task.title}</h4>
        <div className="task-card-actions">
          <button
            className="icon-btn"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(task);
            }}
            title="Edit task"
          >
            <Edit size={16} />
          </button>
          <button
            className="icon-btn danger"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(task._id);
            }}
            title="Delete task"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      <p>{task.description}</p>
    </div>
  );
}

export default TaskCard;
