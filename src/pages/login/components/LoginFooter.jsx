import React from 'react';
import { Link } from 'react-router-dom';

const LoginFooter = () => {
  const currentYear = new Date()?.getFullYear();

  return (
    <div className="mt-8 space-y-6">
      {/* Create Account Link */}
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Don't have an account?{' '}
          <Link 
            to="/register" 
            className="font-medium text-primary hover:text-primary/80 transition-smooth"
          >
            Create account
          </Link>
        </p>
      </div>

      {/* Footer Links */}
      <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-6 text-xs text-muted-foreground">
        <button className="hover:text-card-foreground transition-smooth">
          Terms of Service
        </button>
        <span className="hidden sm:inline">•</span>
        <button className="hover:text-card-foreground transition-smooth">
          Privacy Policy
        </button>
        <span className="hidden sm:inline">•</span>
        <button className="hover:text-card-foreground transition-smooth">
          Help & Support
        </button>
      </div>

      {/* Copyright */}
      <div className="text-center">
        <p className="text-xs text-muted-foreground">
          © {currentYear} ClientStack. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default LoginFooter;