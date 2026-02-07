import React, { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Modal from '../../../components/ui/Modal';
import { updateUserProfile, uploadProfilePhoto, getProfilePhotoUrl, deleteProfilePhoto } from '../../../utils/supabase';

const PersonalInformation = ({ user, profile, onProfileUpdate, onUnsavedChanges }) => {
  const [uploading, setUploading] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const fileInputRef = useRef(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    watch
  } = useForm({
    defaultValues: {
      full_name: profile?.full_name || '',
      email: profile?.email || '',
      phone: profile?.phone || '',
      company: profile?.company || '',
      job_title: profile?.job_title || '',
      website: profile?.website || '',
      location: profile?.location || '',
      bio: profile?.bio || ''
    }
  });

  // Watch form changes to notify parent of unsaved changes
  React.useEffect(() => {
    onUnsavedChanges?.(isDirty);
  }, [isDirty, onUnsavedChanges]);

  const onSubmit = async (data) => {
    try {
      const updatedProfile = await updateUserProfile(user?.id, {
        ...data,
        updated_at: new Date()?.toISOString()
      });
      
      onProfileUpdate?.(updatedProfile);
      reset(data); // Reset form dirty state
      
      // Success notification
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  const handlePhotoUpload = async (file) => {
    if (!file || !user?.id) return;

    // Validate file type and size
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes?.includes(file?.type)) {
      alert('Please select a valid image file (JPEG, PNG, or WebP).');
      return;
    }

    if (file?.size > 5 * 1024 * 1024) { // 5MB limit
      alert('File size must be less than 5MB.');
      return;
    }

    setUploading(true);
    try {
      await uploadProfilePhoto(user?.id, file);
      
      // Update profile with new photo URL
      const photoUrl = getProfilePhotoUrl(user?.id, `profile.${file?.name?.split('.')?.pop()}`);
      const updatedProfile = await updateUserProfile(user?.id, {
        profile_photo_url: photoUrl,
        updated_at: new Date()?.toISOString()
      });
      
      onProfileUpdate?.(updatedProfile);
      setShowPhotoModal(false);
      setPhotoPreview(null);
      
      alert('Profile photo updated successfully!');
    } catch (error) {
      console.error('Error uploading photo:', error);
      alert('Failed to upload photo. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (event) => {
    const file = event?.target?.files?.[0];
    if (file) {
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e?.target?.result);
      };
      reader?.readAsDataURL(file);
      
      setShowPhotoModal(true);
    }
  };

  const handleRemovePhoto = async () => {
    if (!user?.id) return;
    
    const confirmDelete = window.confirm('Are you sure you want to remove your profile photo?');
    if (!confirmDelete) return;

    try {
      await deleteProfilePhoto(user?.id);
      
      const updatedProfile = await updateUserProfile(user?.id, {
        profile_photo_url: null,
        updated_at: new Date()?.toISOString()
      });
      
      onProfileUpdate?.(updatedProfile);
      alert('Profile photo removed successfully!');
    } catch (error) {
      console.error('Error removing photo:', error);
      alert('Failed to remove photo. Please try again.');
    }
  };

  const currentPhotoUrl = profile?.profile_photo_url || getProfilePhotoUrl(user?.id);

  return (
    <>
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-card-foreground mb-2">Personal Information</h2>
          <p className="text-muted-foreground">
            Update your personal details and profile information.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Profile Photo Section */}
          <div className="flex items-start space-x-6 pb-6 border-b border-border">
            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-muted flex items-center justify-center">
                {currentPhotoUrl ? (
                  <img 
                    src={currentPhotoUrl}
                    alt="Profile"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div 
                  className={`w-full h-full flex items-center justify-center ${currentPhotoUrl ? 'hidden' : 'flex'}`}
                >
                  <Icon name="User" size={32} className="text-muted-foreground" />
                </div>
              </div>
              
              {uploading && (
                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                </div>
              )}
            </div>
            
            <div className="flex-1">
              <h3 className="font-medium text-card-foreground mb-2">Profile Photo</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Upload a professional photo to help others recognize you. Max size: 5MB.
              </p>
              
              <div className="flex space-x-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  accept=".jpg,.jpeg,.png,.webp"
                  className="hidden"
                />
                
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef?.current?.click?.()}
                  disabled={uploading}
                >
                  <Icon name="Upload" size={16} />
                  Upload Photo
                </Button>
                
                {currentPhotoUrl && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleRemovePhoto}
                    disabled={uploading}
                  >
                    <Icon name="Trash2" size={16} />
                    Remove
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <div className="grid md:grid-cols-2 gap-6">
            <Input
              label="Full Name"
              required
              {...register('full_name', { 
                required: 'Full name is required',
                minLength: { value: 2, message: 'Name must be at least 2 characters' }
              })}
              error={errors?.full_name?.message}
            />
            
            <Input
              label="Email Address"
              type="email"
              required
              {...register('email', { 
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
              error={errors?.email?.message}
              description="This email is used for login and notifications"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Input
              label="Phone Number"
              type="tel"
              {...register('phone')}
              error={errors?.phone?.message}
              placeholder="+1 (555) 123-4567"
            />
            
            <Input
              label="Location"
              {...register('location')}
              error={errors?.location?.message}
              placeholder="San Francisco, CA"
            />
          </div>

          {/* Professional Information */}
          <div className="pt-6 border-t border-border">
            <h3 className="font-medium text-card-foreground mb-4">Professional Information</h3>
            
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <Input
                label="Company"
                {...register('company')}
                error={errors?.company?.message}
                placeholder="Your Company Name"
              />
              
              <Input
                label="Job Title"
                {...register('job_title')}
                error={errors?.job_title?.message}
                placeholder="Your Position"
              />
            </div>
            
            <div className="mb-6">
              <Input
                label="Website"
                type="url"
                {...register('website', {
                  pattern: {
                    value: /^https?:\/\/.+/,
                    message: 'Please enter a valid URL starting with http:// or https://'
                  }
                })}
                error={errors?.website?.message}
                placeholder="https://yourwebsite.com"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium leading-none text-card-foreground block mb-2">
                Bio
              </label>
              <textarea
                {...register('bio', {
                  maxLength: { value: 500, message: 'Bio must be less than 500 characters' }
                })}
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                placeholder="Tell us a bit about yourself and your professional background..."
                rows={4}
              />
              {errors?.bio && (
                <p className="text-sm text-destructive mt-1">{errors?.bio?.message}</p>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                {watch('bio')?.length || 0}/500 characters
              </p>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset();
                onUnsavedChanges?.(false);
              }}
              disabled={!isDirty}
            >
              Reset Changes
            </Button>
            
            <Button
              type="submit"
              disabled={!isDirty}
              loading={uploading}
            >
              <Icon name="Save" size={16} />
              Save Changes
            </Button>
          </div>
        </form>
      </div>

      {/* Photo Upload Modal */}
      <Modal
        isOpen={showPhotoModal}
        onClose={() => {
          setShowPhotoModal(false);
          setPhotoPreview(null);
          if (fileInputRef?.current) {
            fileInputRef.current.value = '';
          }
        }}
        title="Upload Profile Photo"
        size="default"
      >
        <div className="space-y-4">
          {photoPreview && (
            <div className="flex justify-center">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-muted">
                <img 
                  src={photoPreview}
                  alt="Photo preview"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}
          
          <p className="text-sm text-muted-foreground text-center">
            This photo will be displayed on your profile and visible to other team members.
          </p>
          
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => {
                setShowPhotoModal(false);
                setPhotoPreview(null);
                if (fileInputRef?.current) {
                  fileInputRef.current.value = '';
                }
              }}
            >
              Cancel
            </Button>
            
            <Button
              onClick={() => {
                const file = fileInputRef?.current?.files?.[0];
                if (file) {
                  handlePhotoUpload(file);
                }
              }}
              disabled={!photoPreview || uploading}
              loading={uploading}
            >
              <Icon name="Upload" size={16} />
              Upload Photo
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default PersonalInformation;