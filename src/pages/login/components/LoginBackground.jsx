import React from 'react';

const LoginBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5"></div>
      
      {/* Geometric Patterns */}
      <div className="absolute inset-0">
        {/* Top Right Circle */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl"></div>
        
        {/* Bottom Left Circle */}
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>
        
        {/* Center Accent */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-secondary/5 rounded-full blur-2xl"></div>
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="h-full w-full" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(30, 41, 59, 0.3) 1px, transparent 0)`,
          backgroundSize: '20px 20px'
        }}></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-20 w-2 h-2 bg-primary/20 rounded-full animate-pulse"></div>
      <div className="absolute top-40 right-32 w-1 h-1 bg-accent/30 rounded-full animate-pulse delay-1000"></div>
      <div className="absolute bottom-32 left-40 w-1.5 h-1.5 bg-secondary/20 rounded-full animate-pulse delay-2000"></div>
      <div className="absolute bottom-20 right-20 w-1 h-1 bg-primary/25 rounded-full animate-pulse delay-3000"></div>
    </div>
  );
};

export default LoginBackground;