import React, { useState, useEffect } from 'react';
import Modal from '../../../components/ui/Modal';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const TaskModal = ({ isOpen, onClose, onSave, task = null, projects = [], teamMembers = [] }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    projectId: '',
    assigneeId: '',
    priority: 'Medium',
    status: 'todo',
    dueDate: '',
    estimatedHours: '',
    tags: []
  });

  const [errors, setErrors] = useState({});
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    if (task) {
      setFormData({
        title: task?.title || '',
        description: task?.description || '',
        projectId: task?.projectId || '',
        assigneeId: task?.assignee?.id || '',
        priority: task?.priority || 'Medium',
        status: task?.status || 'todo',
        dueDate: task?.dueDate || '',
        estimatedHours: task?.estimatedHours || '',
        tags: task?.tags || []
      });
    } else {
      setFormData({
        title: '',
        description: '',
        projectId: '',
        assigneeId: '',
        priority: 'Medium',
        status: 'todo',
        dueDate: '',
        estimatedHours: '',
        tags: []
      });
    }
    setErrors({});
    setNewTag('');
  }, [task, isOpen]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors?.[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleAddTag = () => {
    if (newTag?.trim() && !formData?.tags?.includes(newTag?.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev?.tags, newTag?.trim()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev?.tags?.filter(tag => tag !== tagToRemove)
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.title?.trim()) {
      newErrors.title = 'Task title is required';
    }

    if (!formData?.projectId) {
      newErrors.projectId = 'Project selection is required';
    }

    if (formData?.estimatedHours && (isNaN(parseFloat(formData?.estimatedHours)) || parseFloat(formData?.estimatedHours) <= 0)) {
      newErrors.estimatedHours = 'Estimated hours must be a positive number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    
    if (validateForm()) {
      const selectedProject = projects?.find(p => p?.id?.toString() === formData?.projectId);
      const selectedAssignee = teamMembers?.find(m => m?.id?.toString() === formData?.assigneeId);
      
      const taskData = {
        ...formData,
        id: task?.id || Date.now(),
        projectName: selectedProject?.name || '',
        assignee: selectedAssignee || null,
        estimatedHours: formData?.estimatedHours ? parseFloat(formData?.estimatedHours) : null,
        createdAt: task?.createdAt || new Date()?.toISOString(),
        updatedAt: new Date()?.toISOString()
      };
      
      onSave(taskData);
      onClose();
    }
  };

  const priorityOptions = [
    { value: 'Low', label: 'Low Priority' },
    { value: 'Medium', label: 'Medium Priority' },
    { value: 'High', label: 'High Priority' }
  ];

  const statusOptions = [
    { value: 'todo', label: 'To Do' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'review', label: 'Review' },
    { value: 'completed', label: 'Completed' }
  ];

  const modalFooter = (
    <div className="flex items-center justify-end space-x-3">
      <Button variant="outline" onClick={onClose}>
        Cancel
      </Button>
      <Button onClick={handleSubmit}>
        {task ? 'Update Task' : 'Create Task'}
      </Button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={task ? 'Edit Task' : 'Create New Task'}
      size="lg"
      footer={modalFooter}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Task Title */}
        <Input
          label="Task Title"
          type="text"
          placeholder="Enter task title"
          value={formData?.title}
          onChange={(e) => handleInputChange('title', e?.target?.value)}
          error={errors?.title}
          required
        />

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-card-foreground mb-2">
            Description
          </label>
          <textarea
            value={formData?.description}
            onChange={(e) => handleInputChange('description', e?.target?.value)}
            placeholder="Enter task description"
            rows={3}
            className="w-full px-3 py-2 text-sm bg-input border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring resize-none"
          />
        </div>

        {/* Project and Assignee */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-card-foreground mb-2">
              Project *
            </label>
            <select
              value={formData?.projectId}
              onChange={(e) => handleInputChange('projectId', e?.target?.value)}
              className={`w-full px-3 py-2 text-sm bg-input border rounded-md focus:outline-none focus:ring-2 focus:ring-ring ${
                errors?.projectId ? 'border-error' : 'border-border'
              }`}
              required
            >
              <option value="">Select a project</option>
              {projects?.map(project => (
                <option key={project?.id} value={project?.id}>
                  {project?.name} - {project?.client}
                </option>
              ))}
            </select>
            {errors?.projectId && (
              <p className="text-sm text-error mt-1">{errors?.projectId}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-card-foreground mb-2">
              Assignee
            </label>
            <select
              value={formData?.assigneeId}
              onChange={(e) => handleInputChange('assigneeId', e?.target?.value)}
              className="w-full px-3 py-2 text-sm bg-input border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Unassigned</option>
              {teamMembers?.map(member => (
                <option key={member?.id} value={member?.id}>
                  {member?.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Priority, Status, and Due Date */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-card-foreground mb-2">
              Priority
            </label>
            <select
              value={formData?.priority}
              onChange={(e) => handleInputChange('priority', e?.target?.value)}
              className="w-full px-3 py-2 text-sm bg-input border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {priorityOptions?.map(option => (
                <option key={option?.value} value={option?.value}>
                  {option?.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-card-foreground mb-2">
              Status
            </label>
            <select
              value={formData?.status}
              onChange={(e) => handleInputChange('status', e?.target?.value)}
              className="w-full px-3 py-2 text-sm bg-input border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {statusOptions?.map(option => (
                <option key={option?.value} value={option?.value}>
                  {option?.label}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Due Date"
            type="date"
            value={formData?.dueDate}
            onChange={(e) => handleInputChange('dueDate', e?.target?.value)}
          />
        </div>

        {/* Estimated Hours */}
        <Input
          label="Estimated Hours"
          type="number"
          placeholder="0"
          value={formData?.estimatedHours}
          onChange={(e) => handleInputChange('estimatedHours', e?.target?.value)}
          error={errors?.estimatedHours}
        />

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-card-foreground mb-2">
            Tags
          </label>
          <div className="flex items-center space-x-2 mb-3">
            <Input
              type="text"
              placeholder="Add a tag"
              value={newTag}
              onChange={(e) => setNewTag(e?.target?.value)}
              onKeyPress={(e) => e?.key === 'Enter' && (e?.preventDefault(), handleAddTag())}
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddTag}
            >
              <Icon name="Plus" size={16} />
              Add
            </Button>
          </div>
          
          {formData?.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData?.tags?.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center space-x-1 px-2 py-1 bg-accent text-accent-foreground text-xs rounded-full"
                >
                  <span>{tag}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-error transition-smooth"
                  >
                    <Icon name="X" size={12} />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </form>
    </Modal>
  );
};

export default TaskModal;