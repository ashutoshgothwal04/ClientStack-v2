import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';

const RegistrationHeader = () => {
  return (
    <div className="text-center mb-8">
      {/* Logo */}
      <Link to="/dashboard" className="inline-flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
          <svg
            viewBox="0 0 24 24"
            className="w-6 h-6 text-primary-foreground"
            fill="currentColor"
          >
            <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z"/>
            <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" fill="none"/>
          </svg>
        </div>
        <div className="flex flex-col items-start">
          <span className="text-xl font-bold text-foreground">ClientStack</span>
          <span className="text-xs text-muted-foreground">Professional CRM</span>
        </div>
      </Link>

      {/* Welcome Message */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Join ClientStack</h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          Create your account and start managing clients, projects, and billing in one powerful platform
        </p>
      </div>

      {/* Features Preview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 p-6 bg-muted/30 rounded-lg">
        <div className="flex flex-col items-center space-y-2">
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name="Users" size={16} className="text-primary" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-foreground">Client Management</p>
            <p className="text-xs text-muted-foreground">Organize & track clients</p>
          </div>
        </div>

        <div className="flex flex-col items-center space-y-2">
          <div className="w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center">
            <Icon name="FolderKanban" size={16} className="text-success" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-foreground">Project Tracking</p>
            <p className="text-xs text-muted-foreground">Kanban & timelines</p>
          </div>
        </div>

        <div className="flex flex-col items-center space-y-2">
          <div className="w-8 h-8 bg-warning/10 rounded-lg flex items-center justify-center">
            <Icon name="Receipt" size={16} className="text-warning" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-foreground">Smart Billing</p>
            <p className="text-xs text-muted-foreground">Automated invoicing</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationHeader;