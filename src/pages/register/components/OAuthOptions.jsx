import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const OAuthOptions = () => {
  const [loadingProvider, setLoadingProvider] = useState(null);

  const oauthProviders = [
    {
      id: 'google',
      name: 'Google',
      icon: 'Chrome',
      bgColor: 'bg-white hover:bg-gray-50',
      textColor: 'text-gray-700',
      borderColor: 'border-gray-300'
    },
    {
      id: 'github',
      name: 'GitHub',
      icon: 'Github',
      bgColor: 'bg-gray-900 hover:bg-gray-800',
      textColor: 'text-white',
      borderColor: 'border-gray-900'
    },
    {
      id: 'microsoft',
      name: 'Microsoft',
      icon: 'Square',
      bgColor: 'bg-blue-600 hover:bg-blue-700',
      textColor: 'text-white',
      borderColor: 'border-blue-600'
    }
  ];

  const handleOAuthSignup = async (provider) => {
    setLoadingProvider(provider?.id);
    
    try {
      // Simulate OAuth flow
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock OAuth registration
      console.log(`OAuth signup with ${provider?.name}`);
      
      // In real implementation, this would redirect to OAuth provider
      alert(`OAuth signup with ${provider?.name} would be initiated here`);
      
    } catch (error) {
      console.error(`OAuth signup failed for ${provider?.name}:`, error);
      alert(`Failed to sign up with ${provider?.name}. Please try again.`);
    } finally {
      setLoadingProvider(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-background text-muted-foreground">Or continue with</span>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-3">
        {oauthProviders?.map((provider) => (
          <Button
            key={provider?.id}
            variant="outline"
            onClick={() => handleOAuthSignup(provider)}
            disabled={loadingProvider !== null}
            loading={loadingProvider === provider?.id}
            className={`
              h-12 justify-center space-x-3 transition-all duration-200
              ${provider?.bgColor} ${provider?.textColor} ${provider?.borderColor}
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
          >
            {loadingProvider === provider?.id ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                <span>Connecting...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Icon name={provider?.icon} size={18} />
                <span className="font-medium">Continue with {provider?.name}</span>
              </div>
            )}
          </Button>
        ))}
      </div>
      <div className="text-center">
        <p className="text-xs text-muted-foreground">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default OAuthOptions;