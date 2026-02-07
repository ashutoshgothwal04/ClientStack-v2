import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const ProjectTable = ({ projects, onEdit, onView, onDelete }) => {
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

  if (projects?.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-8 text-center">
        <Icon name="FolderOpen" size={48} className="text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium text-card-foreground mb-2">No projects found</h3>
        <p className="text-muted-foreground mb-4">
          Get started by creating your first project or adjust your filters.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted border-b border-border">
            <tr>
              <th className="text-left py-3 px-4 font-medium text-card-foreground">
                Project
              </th>
              <th className="text-left py-3 px-4 font-medium text-card-foreground">
                Client
              </th>
              <th className="text-left py-3 px-4 font-medium text-card-foreground">
                Status
              </th>
              <th className="text-left py-3 px-4 font-medium text-card-foreground">
                Progress
              </th>
              <th className="text-left py-3 px-4 font-medium text-card-foreground">
                Priority
              </th>
              <th className="text-left py-3 px-4 font-medium text-card-foreground">
                Deadline
              </th>
              <th className="text-left py-3 px-4 font-medium text-card-foreground">
                Team
              </th>
              <th className="text-right py-3 px-4 font-medium text-card-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {projects?.map((project, index) => {
              const daysRemaining = getDaysRemaining(project?.deadline);
              
              return (
                <tr
                  key={project?.id}
                  className={`border-b border-border hover:bg-muted/50 transition-smooth ${
                    index % 2 === 0 ? 'bg-background' : 'bg-card'
                  }`}
                >
                  {/* Project Name */}
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Icon name="FolderKanban" size={20} className="text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium text-card-foreground">
                          {project?.name}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Created {formatDate(project?.createdAt)}
                        </p>
                      </div>
                    </div>
                  </td>
                  {/* Client */}
                  <td className="py-4 px-4">
                    <span className="text-sm text-card-foreground">
                      {project?.client}
                    </span>
                  </td>
                  {/* Status */}
                  <td className="py-4 px-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(project?.status)}`}>
                      {project?.status}
                    </span>
                  </td>
                  {/* Progress */}
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${project?.progress}%` }}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {project?.progress}%
                      </span>
                    </div>
                  </td>
                  {/* Priority */}
                  <td className="py-4 px-4">
                    <span className={`text-sm font-medium ${getPriorityColor(project?.priority)}`}>
                      {project?.priority}
                    </span>
                  </td>
                  {/* Deadline */}
                  <td className="py-4 px-4">
                    <div className="flex flex-col">
                      <span className="text-sm text-card-foreground">
                        {formatDate(project?.deadline)}
                      </span>
                      <span className={`text-xs ${
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
                      </span>
                    </div>
                  </td>
                  {/* Team */}
                  <td className="py-4 px-4">
                    <div className="flex -space-x-2">
                      {project?.teamMembers?.slice(0, 3)?.map((member, memberIndex) => (
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
                      {project?.teamMembers?.length > 3 && (
                        <div className="w-8 h-8 bg-muted border-2 border-card rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-muted-foreground">
                            +{project?.teamMembers?.length - 3}
                          </span>
                        </div>
                      )}
                    </div>
                  </td>
                  {/* Actions */}
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-end space-x-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onView(project)}
                        title="View Project"
                        className="w-8 h-8"
                      >
                        <Icon name="Eye" size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(project)}
                        title="Edit Project"
                        className="w-8 h-8"
                      >
                        <Icon name="Edit" size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(project)}
                        title="Delete Project"
                        className="w-8 h-8 text-error hover:text-error"
                      >
                        <Icon name="Trash2" size={16} />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProjectTable;