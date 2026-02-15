import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';
import { supabase } from 'lib/supabase';

const RegistrationForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    accountType: 'freelancer',
    businessName: '',
    agreeToTerms: false,
    agreeToPrivacy: false
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const accountTypes = [
    { value: 'freelancer', label: 'Freelancer', description: 'Individual service provider' },
    { value: 'agency', label: 'Agency Owner', description: 'Managing a team or agency' },
    { value: 'consultant', label: 'Consultant', description: 'Professional consulting services' }
  ];

  const validatePassword = (password) => {
    const requirements = {
      length: password?.length >= 8,
      uppercase: /[A-Z]/?.test(password),
      lowercase: /[a-z]/?.test(password),
      number: /\d/?.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/?.test(password)
    };
    
    const strength = Object.values(requirements)?.filter(Boolean)?.length;
    return { requirements, strength };
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e?.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear specific error when user starts typing
    if (errors?.[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleAccountTypeChange = (value) => {
    setFormData(prev => ({
      ...prev,
      accountType: value,
      businessName: value === 'freelancer' ? '' : prev?.businessName
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    // Full name validation
    if (!formData?.fullName?.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData?.fullName?.trim()?.length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData?.email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex?.test(formData?.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData?.password) {
      newErrors.password = 'Password is required';
    } else {
      const { requirements } = validatePassword(formData?.password);
      if (!requirements?.length) {
        newErrors.password = 'Password must be at least 8 characters long';
      } else if (!requirements?.uppercase || !requirements?.lowercase || !requirements?.number) {
        newErrors.password = 'Password must contain uppercase, lowercase, and number';
      }
    }

    // Confirm password validation
    if (!formData?.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData?.password !== formData?.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Business name validation for non-freelancers
    if (formData?.accountType !== 'freelancer' && !formData?.businessName?.trim()) {
      newErrors.businessName = 'Business name is required';
    }

    // Terms and privacy validation
    if (!formData?.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the Terms of Service';
    }

    if (!formData?.agreeToPrivacy) {
      newErrors.agreeToPrivacy = 'You must agree to the Privacy Policy';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validateForm()) return;

  setIsLoading(true);

  try {
    const { error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          full_name: formData.fullName,
          account_type: formData.accountType,
          business_name: formData.businessName || null
        }
      }
    });

    if (error) {
      setErrors({ submit: error.message });
      setIsLoading(false);
      return;
    }

    alert("Account created! Check your email for verification.");
    navigate("/login");

  } catch (error) {
    setErrors({ submit: "Registration failed. Please try again." });
  } finally {
    setIsLoading(false);
  }
};


  const passwordValidation = validatePassword(formData?.password);
  const isFormValid = formData?.fullName && 
                     formData?.email && 
                     formData?.password && 
                     formData?.confirmPassword && 
                     formData?.agreeToTerms && 
                     formData?.agreeToPrivacy &&
                     (formData?.accountType === 'freelancer' || formData?.businessName) &&
                     Object.keys(errors)?.length === 0;

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-foreground mb-2">Create Your Account</h1>
        <p className="text-muted-foreground">Join ClientStack and streamline your client management</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Full Name */}
        <Input
          label="Full Name"
          type="text"
          name="fullName"
          placeholder="Enter your full name"
          value={formData?.fullName}
          onChange={handleInputChange}
          error={errors?.fullName}
          required
        />

        {/* Email */}
        <Input
          label="Email Address"
          type="email"
          name="email"
          placeholder="Enter your email"
          value={formData?.email}
          onChange={handleInputChange}
          error={errors?.email}
          required
        />

        {/* Password */}
        <div className="space-y-2">
          <div className="relative">
            <Input
              label="Password"
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Create a strong password"
              value={formData?.password}
              onChange={handleInputChange}
              error={errors?.password}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Icon name={showPassword ? "EyeOff" : "Eye"} size={16} />
            </button>
          </div>
          
          {/* Password Strength Indicator */}
          {formData?.password && (
            <div className="space-y-2">
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5]?.map((level) => (
                  <div
                    key={level}
                    className={`h-1 flex-1 rounded-full transition-colors ${
                      level <= passwordValidation?.strength
                        ? passwordValidation?.strength <= 2
                          ? 'bg-error'
                          : passwordValidation?.strength <= 3
                          ? 'bg-warning' :'bg-success' :'bg-muted'
                    }`}
                  />
                ))}
              </div>
              <div className="text-xs space-y-1">
                <div className={`flex items-center space-x-2 ${passwordValidation?.requirements?.length ? 'text-success' : 'text-muted-foreground'}`}>
                  <Icon name={passwordValidation?.requirements?.length ? "Check" : "X"} size={12} />
                  <span>At least 8 characters</span>
                </div>
                <div className={`flex items-center space-x-2 ${passwordValidation?.requirements?.uppercase ? 'text-success' : 'text-muted-foreground'}`}>
                  <Icon name={passwordValidation?.requirements?.uppercase ? "Check" : "X"} size={12} />
                  <span>One uppercase letter</span>
                </div>
                <div className={`flex items-center space-x-2 ${passwordValidation?.requirements?.lowercase ? 'text-success' : 'text-muted-foreground'}`}>
                  <Icon name={passwordValidation?.requirements?.lowercase ? "Check" : "X"} size={12} />
                  <span>One lowercase letter</span>
                </div>
                <div className={`flex items-center space-x-2 ${passwordValidation?.requirements?.number ? 'text-success' : 'text-muted-foreground'}`}>
                  <Icon name={passwordValidation?.requirements?.number ? "Check" : "X"} size={12} />
                  <span>One number</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div className="relative">
          <Input
            label="Confirm Password"
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm your password"
            value={formData?.confirmPassword}
            onChange={handleInputChange}
            error={errors?.confirmPassword}
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-9 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Icon name={showConfirmPassword ? "EyeOff" : "Eye"} size={16} />
          </button>
        </div>

        {/* Account Type Selection */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">Account Type</label>
          <div className="space-y-2">
            {accountTypes?.map((type) => (
              <label
                key={type?.value}
                className={`flex items-start space-x-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                  formData?.accountType === type?.value
                    ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
                }`}
              >
                <input
                  type="radio"
                  name="accountType"
                  value={type?.value}
                  checked={formData?.accountType === type?.value}
                  onChange={(e) => handleAccountTypeChange(e?.target?.value)}
                  className="mt-0.5 text-primary focus:ring-primary"
                />
                <div className="flex-1">
                  <div className="font-medium text-foreground">{type?.label}</div>
                  <div className="text-sm text-muted-foreground">{type?.description}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Business Name (conditional) */}
        {formData?.accountType !== 'freelancer' && (
          <Input
            label="Business Name"
            type="text"
            name="businessName"
            placeholder="Enter your business name"
            value={formData?.businessName}
            onChange={handleInputChange}
            error={errors?.businessName}
            required
          />
        )}

        {/* Terms and Privacy Checkboxes */}
        <div className="space-y-3">
          <Checkbox
            label={
              <span className="text-sm">
                I agree to the{' '}
                <Link to="/terms" className="text-primary hover:underline">
                  Terms of Service
                </Link>
              </span>
            }
            checked={formData?.agreeToTerms}
            onChange={(e) => handleInputChange({
              target: { name: 'agreeToTerms', type: 'checkbox', checked: e?.target?.checked }
            })}
            error={errors?.agreeToTerms}
            required
          />

          <Checkbox
            label={
              <span className="text-sm">
                I agree to the{' '}
                <Link to="/privacy" className="text-primary hover:underline">
                  Privacy Policy
                </Link>
              </span>
            }
            checked={formData?.agreeToPrivacy}
            onChange={(e) => handleInputChange({
              target: { name: 'agreeToPrivacy', type: 'checkbox', checked: e?.target?.checked }
            })}
            error={errors?.agreeToPrivacy}
            required
          />
        </div>

        {/* Submit Error */}
        {errors?.submit && (
          <div className="p-3 bg-error/10 border border-error/20 rounded-lg">
            <p className="text-sm text-error">{errors?.submit}</p>
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          variant="default"
          fullWidth
          disabled={!isFormValid}
          loading={isLoading}
          className="h-12"
        >
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </Button>

        {/* Email Verification Notice */}
        <div className="p-4 bg-accent/10 border border-accent/20 rounded-lg">
          <div className="flex items-start space-x-3">
            <Icon name="Mail" size={16} className="text-accent mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-foreground mb-1">Email Verification Required</p>
              <p className="text-muted-foreground">
                After registration, you'll receive a verification email. Please check your inbox and click the verification link to activate your account.
              </p>
            </div>
          </div>
        </div>

        {/* Sign In Link */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:underline font-medium">
              Sign In
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default RegistrationForm;