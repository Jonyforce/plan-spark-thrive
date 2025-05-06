
import { supabase } from "@/integrations/supabase/client";
import { recordUserSession, endUserSession } from "./dbSync";

// Initialize auth
export const initializeAuth = async () => {
  // Check if user is already authenticated
  const { data } = await supabase.auth.getSession();
  
  if (data.session) {
    // Record user session if authenticated
    await recordUserSession();
    return true;
  }
  
  return false;
};

// Sign in with email and password
export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  
  if (error) {
    throw error;
  }
  
  // Record user session on successful login
  if (data.session) {
    await recordUserSession();
  }
  
  return data;
};

// Sign up with email and password
export const signUp = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password
  });
  
  if (error) {
    throw error;
  }
  
  return data;
};

// Sign out
export const signOut = async () => {
  // End user sessions
  await endUserSession();
  
  // Sign out from Supabase
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    throw error;
  }
  
  return true;
};

// Get current user
export const getCurrentUser = async () => {
  const { data } = await supabase.auth.getUser();
  return data.user;
};
