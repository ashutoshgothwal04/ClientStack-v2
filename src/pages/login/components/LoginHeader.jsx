import React from 'react';
import { Link } from 'react-router-dom';

const LoginHeader = () => {
  return (
    <div className="text-center mb-8">
      {/* Logo */}
      <Link to="/dashboard" className="inline-flex items-center justify-center mb-6">
        <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mr-3">
          <svg
            viewBox="0 0 24 24"
            className="w-7 h-7 text-primary-foreground"
            fill="currentColor"
          >
            <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z"/>
            <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" fill="none"/>
          </svg>
        </div>
        <div className="text-left">
          <h1 className="text-2xl font-bold text-card-foreground">ClientStack</h1>
          <p className="text-sm text-muted-foreground">Professional CRM</p>
        </div>
      </Link>

      {/* Welcome Text */}
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-card-foreground">
          Welcome back
        </h2>
        <p className="text-muted-foreground">
          Sign in to your account to continue managing your clients and projects
        </p>
      </div>
    </div>
  );
};

export default LoginHeader;