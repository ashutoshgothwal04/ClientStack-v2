import React from 'react';
import { Helmet } from 'react-helmet';
import RegistrationHeader from './components/RegistrationHeader';
import RegistrationForm from './components/RegistrationForm';
import OAuthOptions from './components/OAuthOptions';
import { toast } from "sonner";

const RegisterPage = () => {
  React.useEffect(() => {
    toast.info("Welcome! Create your ClientStack account to unlock powerful CRM features.");
  }, []);
  return (
    <>
      <Helmet>
        <title>Register - ClientStack | Professional CRM Platform</title>
        <meta name="description" content="Create your ClientStack account and start managing clients, projects, contracts, and billing in one powerful platform. Join thousands of freelancers and agencies." />
        <meta name="keywords" content="register, signup, client management, CRM, project management, billing, freelancer, agency" />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.05)_1px,transparent_0)] bg-[size:20px_20px]"></div>

        <div className="relative min-h-screen flex">
          {/* Left Side - Registration Form */}
          <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
            <div className="w-full max-w-lg">
              <div className="bg-card border border-border rounded-xl elevation-3 p-8">
                <RegistrationHeader />
                
                {/* OAuth Options */}
                <div className="mb-8">
                  <OAuthOptions />
                </div>

                {/* Registration Form */}
                <RegistrationForm />
              </div>
            </div>
          </div>

          {/* Right Side - Feature Showcase (Desktop Only) */}
          <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-primary to-accent p-12 items-center justify-center">
            <div className="max-w-md text-center text-white">
              <div className="mb-8">
                <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <svg
                    viewBox="0 0 24 24"
                    className="w-10 h-10 text-white"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z"/>
                    <path d="M9 12l2 2 4-4"/>
                  </svg>
                </div>
                <h2 className="text-3xl font-bold mb-4">
                  Streamline Your Business
                </h2>
                <p className="text-white/90 text-lg leading-relaxed">
                  Join thousands of professionals who trust ClientStack to manage their client relationships, projects, and billing efficiently.
                </p>
              </div>

              {/* Feature List */}
              <div className="space-y-4 text-left">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-white/90">Centralized client database with interaction history</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-white/90">Project management with Kanban boards</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-white/90">Automated invoicing and payment tracking</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-white/90">Contract management with e-signatures</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-white/90">Analytics dashboard with insights</span>
                </div>
              </div>

              {/* Testimonial */}
              <div className="mt-8 p-6 bg-white/10 rounded-lg backdrop-blur-sm">
                <p className="text-white/90 italic mb-3">
                  "ClientStack transformed how I manage my freelance business. Everything I need is in one place."
                </p>
                <div className="flex items-center justify-center space-x-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-white">SJ</span>
                  </div>
                  <div className="text-left">
                    <p className="text-white font-medium text-sm">Sarah Johnson</p>
                    <p className="text-white/70 text-xs">Freelance Designer</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;