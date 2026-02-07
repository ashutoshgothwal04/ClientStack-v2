import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const KanbanBoard = ({ projects, onTaskUpdate, onTaskCreate }) => {
  const [draggedTask, setDraggedTask] = useState(null);

  const columns = [
    { id: 'todo', title: 'To Do', color: 'bg-muted' },
    { id: 'in-progress', title: 'In Progress', color: 'bg-accent' },
    { id: 'review', title: 'Review', color: 'bg-warning' },
    { id: 'completed', title: 'Completed', color: 'bg-success' }
  ];

  // Convert projects to tasks for Kanban view
  const tasks = projects?.flatMap(project => 
    project?.tasks?.map(task => ({
      ...task,
      projectName: project?.name,
      projectClient: project?.client
    })) || []
  );

  const getTasksByColumn = (columnId) => {
    return tasks?.filter(task => task?.status === columnId);
  };

  const handleDragStart = (e, task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e?.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, columnId) => {
    e?.preventDefault();
    if (draggedTask && draggedTask?.status !== columnId) {
      onTaskUpdate(draggedTask?.id, { status: columnId });
    }
    setDraggedTask(null);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High':
        return 'border-l-error';
      case 'Medium':
        return 'border-l-warning';
      case 'Low':
        return 'border-l-success';
      default:
        return 'border-l-muted';
    }
  };

  const formatDate = (date) => {
    return new Date(date)?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const TaskCard = ({ task }) => (
    <div
      draggable
      onDragStart={(e) => handleDragStart(e, task)}
      className={`bg-card border border-border rounded-lg p-4 mb-3 cursor-move hover:elevation-2 transition-smooth border-l-4 ${getPriorityColor(task?.priority)}`}
    >
      <div className="flex items-start justify-between mb-2">
        <h4 className="text-sm font-medium text-card-foreground line-clamp-2">
          {task?.title}
        </h4>
        <div className="flex items-center space-x-1 ml-2">
          <Icon name="MoreHorizontal" size={14} className="text-muted-foreground" />
        </div>
      </div>

      <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
        {task?.description}
      </p>

      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-muted-foreground">
          {task?.projectName}
        </span>
        <span className="text-xs font-medium text-card-foreground">
          {task?.priority}
        </span>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {task?.assignee && (
            <div className="w-6 h-6 rounded-full overflow-hidden" title={task?.assignee?.name}>
              <Image
                src={task?.assignee?.avatar}
                alt={task?.assignee?.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <span className="text-xs text-muted-foreground">
            {task?.assignee?.name}
          </span>
        </div>
        
        {task?.dueDate && (
          <div className="flex items-center space-x-1">
            <Icon name="Calendar" size={12} className="text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              {formatDate(task?.dueDate)}
            </span>
          </div>
        )}
      </div>

      {task?.attachments && task?.attachments?.length > 0 && (
        <div className="flex items-center space-x-1 mt-2">
          <Icon name="Paperclip" size={12} className="text-muted-foreground" />
          <span className="text-xs text-muted-foreground">
            {task?.attachments?.length} files
          </span>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex space-x-6 overflow-x-auto pb-4">
      {columns?.map((column) => {
        const columnTasks = getTasksByColumn(column?.id);
        
        return (
          <div
            key={column?.id}
            className="flex-shrink-0 w-80"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column?.id)}
          >
            <div className="bg-muted rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${column?.color}`} />
                  <h3 className="font-medium text-card-foreground">
                    {column?.title}
                  </h3>
                  <span className="bg-card text-muted-foreground text-xs px-2 py-1 rounded-full">
                    {columnTasks?.length}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onTaskCreate(column?.id)}
                  className="w-6 h-6"
                >
                  <Icon name="Plus" size={14} />
                </Button>
              </div>

              <div className="space-y-3 min-h-[200px]">
                {columnTasks?.map((task) => (
                  <TaskCard key={task?.id} task={task} />
                ))}
                
                {columnTasks?.length === 0 && (
                  <div className="text-center py-8">
                    <Icon name="Package" size={32} className="text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">No tasks</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default KanbanBoard;