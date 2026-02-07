import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const ProjectCard = ({ project, onEdit, onView }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-success text-success-foreground';
      case 'On Hold':
        return 'bg-warning text-warning-foreground';
      case 'Completed':
        return 'bg-accent text-accent-foreground';
      case 'Planning':
        return 'bg-secondary text-secondary-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High':
        return 'text-error';
      case 'Medium':
        return 'text-warning';
      case 'Low':
        return 'text-success';
      default:
        return 'text-muted-foreground';
    }
  };

  const formatDate = (date) => {
    return new Date(date)?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDaysRemaining = (deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysRemaining = getDaysRemaining(project?.deadline);

  return (
    <div className="bg-card border border-border rounded-lg p-6 hover:elevation-2 transition-smooth">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-card-foreground mb-1">
            {project?.name}
          </h3>
          <p className="text-sm text-muted-foreground mb-2">
            Client: {project?.client}
          </p>
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(project?.status)}`}>
              {project?.status}
            </span>
            <span className={`text-xs font-medium ${getPriorityColor(project?.priority)}`}>
              {project?.priority} Priority
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onView(project)}
            className="p-2 text-muted-foreground hover:text-card-foreground hover:bg-muted rounded-md transition-smooth"
            title="View Project"
          >
            <Icon name="Eye" size={16} />
          </button>
          <button
            onClick={() => onEdit(project)}
            className="p-2 text-muted-foreground hover:text-card-foreground hover:bg-muted rounded-md transition-smooth"
            title="Edit Project"
          >
            <Icon name="Edit" size={16} />
          </button>
        </div>
      </div>
      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-card-foreground">Progress</span>
          <span className="text-sm text-muted-foreground">{project?.progress}%</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${project?.progress}%` }}
          />
        </div>
      </div>
      {/* Team Members */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-card-foreground">Team</span>
          <span className="text-xs text-muted-foreground">
            {project?.teamMembers?.length} members
          </span>
        </div>
        <div className="flex -space-x-2">
          {project?.teamMembers?.slice(0, 4)?.map((member, index) => (
            <div
              key={member?.id}
              className="relative w-8 h-8 rounded-full border-2 border-card overflow-hidden"
              title={member?.name}
            >
              <Image
                src={member?.avatar}
                alt={member?.name}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
          {project?.teamMembers?.length > 4 && (
            <div className="w-8 h-8 bg-muted border-2 border-card rounded-full flex items-center justify-center">
              <span className="text-xs font-medium text-muted-foreground">
                +{project?.teamMembers?.length - 4}
              </span>
            </div>
          )}
        </div>
      </div>
      {/* Deadline */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Icon name="Calendar" size={16} className="text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            Due: {formatDate(project?.deadline)}
          </span>
        </div>
        <div className={`text-sm font-medium ${
          daysRemaining < 0 
            ? 'text-error' 
            : daysRemaining <= 3 
              ? 'text-warning' :'text-success'
        }`}>
          {daysRemaining < 0 
            ? `${Math.abs(daysRemaining)} days overdue`
            : daysRemaining === 0
              ? 'Due today'
              : `${daysRemaining} days left`
          }
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;