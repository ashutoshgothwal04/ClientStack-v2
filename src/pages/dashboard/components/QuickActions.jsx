import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const QuickActions = ({ onActionClick }) => {
  const navigate = useNavigate();

  const quickActions = [
    {
      id: 'add-client',
      title: 'Add Client',
      description: 'Onboard a new client',
      icon: 'UserPlus',
      color: 'bg-primary text-primary-foreground',
      action: () => {
        onActionClick?.('add-client');
        navigate('/clients', {
          state: { openCreateClient: true }
        });
        toast.success('Ready to add a new client');
      }
    },
    {
      id: 'create-project',
      title: 'Create Project',
      description: 'Start a new project',
      icon: 'FolderPlus',
      color: 'bg-success text-success-foreground',
      action: () => {
        onActionClick?.('create-project');
        navigate('/project-management', {
          state: { openNewProject: true }
        });
        toast.success('Create a new project');
      }
    },
    {
      id: 'generate-invoice',
      title: 'Generate Invoice',
      description: 'Create new invoice',
      icon: 'Receipt',
      color: 'bg-accent text-accent-foreground',
      action: () => {
        onActionClick?.('generate-invoice');
        navigate('/billing-invoices', {
          state: { openCreateInvoice: true }
        });
        toast.success('Generate a new invoice');
      }
    },
    {
      id: 'upload-contract',
      title: 'Upload Contract',
      description: 'Add contract document',
      icon: 'Upload',
      color: 'bg-warning text-warning-foreground',
      action: () => {
        onActionClick?.('upload-contract');
        navigate('/contracts', {
          state: { openUploadContract: true }
        });
        toast.success('Upload a contract');
      }
    }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-6 elevation-2">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-card-foreground">
          Quick Actions
        </h3>
        <Icon name="Zap" size={20} className="text-primary" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {quickActions.map(action => (
          <button
            key={action.id}
            onClick={action.action}
            className="group flex items-center space-x-4 p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-muted/30 transition-smooth text-left"
          >
            <div className={`p-3 rounded-lg ${action.color} group-hover:scale-105 transition-transform`}>
              <Icon name={action.icon} size={20} />
            </div>

            <div className="flex-1">
              <h4 className="text-sm font-medium text-card-foreground group-hover:text-primary">
                {action.title}
              </h4>
              <p className="text-xs text-muted-foreground mt-1">
                {action.description}
              </p>
            </div>

            <Icon
              name="ArrowRight"
              size={16}
              className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all"
            />
          </button>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-border">
        <div className="grid grid-cols-2 gap-4">
          <Button
            variant="outline"
            size="sm"
            iconName="Calendar"
            iconPosition="left"
            className="w-full"
            onClick={() => {
              navigate('/calendar');
              toast.info('Opening calendar');
            }}
          >
            Schedule Meeting
          </Button>

          <Button
            variant="outline"
            size="sm"
            iconName="FileText"
            iconPosition="left"
            className="w-full"
            onClick={() => navigate('/reports')}
          >
            View Reports
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;
