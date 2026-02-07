import React, { useState, useEffect } from 'react';
import Modal from '../../../components/ui/Modal';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const ProjectModal = ({ isOpen, onClose, onSave, project = null, clients = [] }) => {
  const [formData, setFormData] = useState({
    name: '',
    client: '',
    description: '',
    startDate: '',
    deadline: '',
    priority: 'Medium',
    status: 'Planning',
    budget: '',
    teamMembers: [],
    deliverables: ['']
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (project) {
      setFormData({
        name: project?.name || '',
        client: project?.client || '',
        description: project?.description || '',
        startDate: project?.startDate || '',
        deadline: project?.deadline || '',
        priority: project?.priority || 'Medium',
        status: project?.status || 'Planning',
        budget: project?.budget || '',
        teamMembers: project?.teamMembers || [],
        deliverables: project?.deliverables || ['']
      });
    } else {
      setFormData({
        name: '',
        client: '',
        description: '',
        startDate: '',
        deadline: '',
        priority: 'Medium',
        status: 'Planning',
        budget: '',
        teamMembers: [],
        deliverables: ['']
      });
    }
    setErrors({});
  }, [project, isOpen]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors?.[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleDeliverableChange = (index, value) => {
    const newDeliverables = [...formData?.deliverables];
    newDeliverables[index] = value;
    setFormData(prev => ({
      ...prev,
      deliverables: newDeliverables
    }));
  };

  const addDeliverable = () => {
    setFormData(prev => ({
      ...prev,
      deliverables: [...prev?.deliverables, '']
    }));
  };

  const removeDeliverable = (index) => {
    if (formData?.deliverables?.length > 1) {
      const newDeliverables = formData?.deliverables?.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        deliverables: newDeliverables
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.name?.trim()) {
      newErrors.name = 'Project name is required';
    }

    if (!formData?.client?.trim()) {
      newErrors.client = 'Client selection is required';
    }

    if (!formData?.deadline) {
      newErrors.deadline = 'Deadline is required';
    }

    if (formData?.startDate && formData?.deadline) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.deadline);
      if (start >= end) {
        newErrors.deadline = 'Deadline must be after start date';
      }
    }

    if (formData?.budget && isNaN(parseFloat(formData?.budget))) {
      newErrors.budget = 'Budget must be a valid number';
    }

    const validDeliverables = formData?.deliverables?.filter(d => d?.trim());
    if (validDeliverables?.length === 0) {
      newErrors.deliverables = 'At least one deliverable is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    
    if (validateForm()) {
      const projectData = {
        ...formData,
        deliverables: formData?.deliverables?.filter(d => d?.trim()),
        budget: formData?.budget ? parseFloat(formData?.budget) : null,
        id: project?.id || Date.now(),
        progress: project?.progress || 0,
        createdAt: project?.createdAt || new Date()?.toISOString()
      };
      
      onSave(projectData);
      onClose();
    }
  };

  const priorityOptions = [
    { value: 'Low', label: 'Low Priority' },
    { value: 'Medium', label: 'Medium Priority' },
    { value: 'High', label: 'High Priority' }
  ];

  const statusOptions = [
    { value: 'Planning', label: 'Planning' },
    { value: 'Active', label: 'Active' },
    { value: 'On Hold', label: 'On Hold' },
    { value: 'Completed', label: 'Completed' }
  ];

  const modalFooter = (
    <div className="flex items-center justify-end space-x-3">
      <Button variant="outline" onClick={onClose}>
        Cancel
      </Button>
      <Button onClick={handleSubmit}>
        {project ? 'Update Project' : 'Create Project'}
      </Button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={project ? 'Edit Project' : 'Create New Project'}
      size="lg"
      footer={modalFooter}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Project Name"
            type="text"
            placeholder="Enter project name"
            value={formData?.name}
            onChange={(e) => handleInputChange('name', e?.target?.value)}
            error={errors?.name}
            required
          />

          <div>
            <label className="block text-sm font-medium text-card-foreground mb-2">
              Client *
            </label>
            <select
              value={formData?.client}
              onChange={(e) => handleInputChange('client', e?.target?.value)}
              className={`w-full px-3 py-2 text-sm bg-input border rounded-md focus:outline-none focus:ring-2 focus:ring-ring ${
                errors?.client ? 'border-error' : 'border-border'
              }`}
              required
            >
              <option value="">Select a client</option>
              {clients?.map(client => (
                <option key={client?.id} value={client?.name}>
                  {client?.name}
                </option>
              ))}
            </select>
            {errors?.client && (
              <p className="text-sm text-error mt-1">{errors?.client}</p>
            )}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-card-foreground mb-2">
            Description
          </label>
          <textarea
            value={formData?.description}
            onChange={(e) => handleInputChange('description', e?.target?.value)}
            placeholder="Enter project description"
            rows={3}
            className="w-full px-3 py-2 text-sm bg-input border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring resize-none"
          />
        </div>

        {/* Dates and Priority */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="Start Date"
            type="date"
            value={formData?.startDate}
            onChange={(e) => handleInputChange('startDate', e?.target?.value)}
          />

          <Input
            label="Deadline"
            type="date"
            value={formData?.deadline}
            onChange={(e) => handleInputChange('deadline', e?.target?.value)}
            error={errors?.deadline}
            required
          />

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
        </div>

        {/* Status and Budget */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            label="Budget (USD)"
            type="number"
            placeholder="0.00"
            value={formData?.budget}
            onChange={(e) => handleInputChange('budget', e?.target?.value)}
            error={errors?.budget}
          />
        </div>

        {/* Deliverables */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-card-foreground">
              Deliverables
            </label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addDeliverable}
            >
              <Icon name="Plus" size={16} />
              Add Deliverable
            </Button>
          </div>
          
          <div className="space-y-2">
            {formData?.deliverables?.map((deliverable, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Input
                  type="text"
                  placeholder={`Deliverable ${index + 1}`}
                  value={deliverable}
                  onChange={(e) => handleDeliverableChange(index, e?.target?.value)}
                  className="flex-1"
                />
                {formData?.deliverables?.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeDeliverable(index)}
                    className="text-error hover:text-error"
                  >
                    <Icon name="Trash2" size={16} />
                  </Button>
                )}
              </div>
            ))}
          </div>
          {errors?.deliverables && (
            <p className="text-sm text-error mt-1">{errors?.deliverables}</p>
          )}
        </div>
      </form>
    </Modal>
  );
};

export default ProjectModal;