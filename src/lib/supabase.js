import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env?.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Auth helper functions
export const getCurrentUser = async () => {
  const { data: { user } } = await supabase?.auth?.getUser();
  return user;
};

export const getCurrentSession = async () => {
  const { data: { session } } = await supabase?.auth?.getSession();
  return session;
};

// Profile helper functions
export const getUserProfile = async (userId) => {
  const { data, error } = await supabase?.from('user_profiles')?.select('*')?.eq('id', userId)?.single();
  
  if (error) throw error;
  return data;
};

export const updateUserProfile = async (userId, updates) => {
  const { data, error } = await supabase?.from('user_profiles')?.update(updates)?.eq('id', userId)?.select()?.single();
  
  if (error) throw error;
  return data;
};

// Storage helper functions  
export const uploadProfilePhoto = async (userId, file) => {
  const fileExt = file?.name?.split('.')?.pop();
  const fileName = `${userId}/profile.${fileExt}`;
  
  const { data, error } = await supabase?.storage?.from('profile-images')?.upload(fileName, file, { upsert: true });
  
  if (error) throw error;
  return data;
};

export const getProfilePhotoUrl = (userId, fileName = 'profile') => {
  if (!userId) return null;
  
  const { data } = supabase?.storage?.from('profile-images')?.getPublicUrl(`${userId}/${fileName}`);
    
  return data?.publicUrl;
};

export const deleteProfilePhoto = async (userId, fileName = 'profile') => {
  const { data, error } = await supabase?.storage?.from('profile-images')?.remove([`${userId}/${fileName}`]);
    
  if (error) throw error;
  return data;
};