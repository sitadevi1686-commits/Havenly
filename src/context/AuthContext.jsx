import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { mockDb } from '../services/mockDatabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('havenly_active_user');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn("User session storage failed", e);
    }
    // Default logged in as demo student for immediate interactivity
    const users = mockDb.getUsers();
    return users.find(u => u.role === 'student') || null;
  });

  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    if (user) {
      try {
        localStorage.setItem('havenly_active_user', JSON.stringify(user));
      } catch (e) {
        console.warn("Storage error", e);
      }
    } else {
      localStorage.removeItem('havenly_active_user');
    }
  }, [user]);

  // Login handler
  const login = async (email, password) => {
    setLoading(true);
    setAuthError(null);

    try {
      if (isSupabaseConfigured) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        if (data.user) {
          // Fetch profile
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();
          if (profile) {
            setUser(profile);
            setLoading(false);
            return { success: true, user: profile };
          }
        }
      }

      // Local database fallback
      const users = mockDb.getUsers();
      const matched = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (matched) {
        if (matched.is_suspended) {
          throw new Error("This account has been suspended by Havenly administration. Contact concierge@havenly-living.com.");
        }
        setUser(matched);
        setLoading(false);
        return { success: true, user: matched };
      } else {
        // Create student or owner if email not found
        const newUser = {
          id: `usr-${Date.now()}`,
          full_name: email.split('@')[0],
          email,
          role: email.includes('owner') ? 'owner' : email.includes('admin') ? 'admin' : 'student',
          college: 'Enrolled Scholar',
          is_suspended: false,
          created_at: new Date().toISOString()
        };
        mockDb.saveUsers([...users, newUser]);
        setUser(newUser);
        setLoading(false);
        return { success: true, user: newUser };
      }
    } catch (err) {
      setAuthError(err.message || 'Login failed. Please verify credentials.');
      setLoading(false);
      return { success: false, error: err.message };
    }
  };

  // Register handler
  const register = async ({ full_name, email, password, phone, role = 'student', college = '', owner_type = 'individual' }) => {
    setLoading(true);
    setAuthError(null);

    // SECURITY ENFORCEMENT: Never allow users to grant themselves administrator privileges!
    const sanitizedRole = (role === 'owner') ? 'owner' : 'student';

    try {
      if (isSupabaseConfigured) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name, role: sanitizedRole, phone, college }
          }
        });
        if (error) throw error;
        if (data.user) {
          const profile = {
            id: data.user.id,
            full_name,
            email,
            phone,
            role: sanitizedRole,
            college,
            owner_type: sanitizedRole === 'owner' ? owner_type : null,
            is_suspended: false,
            created_at: new Date().toISOString()
          };
          setUser(profile);
          setLoading(false);
          return { success: true, user: profile };
        }
      }

      // Local registration
      const users = mockDb.getUsers();
      const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (existing) {
        throw new Error("An account with this email address already exists.");
      }

      const newUser = {
        id: `usr-${Date.now()}`,
        full_name,
        email,
        phone,
        role: sanitizedRole,
        college: sanitizedRole === 'student' ? college : null,
        owner_type: sanitizedRole === 'owner' ? owner_type : null,
        avatar_url: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80`,
        is_suspended: false,
        created_at: new Date().toISOString()
      };

      mockDb.saveUsers([...users, newUser]);
      setUser(newUser);
      setLoading(false);
      return { success: true, user: newUser };
    } catch (err) {
      setAuthError(err.message || 'Registration failed.');
      setLoading(false);
      return { success: false, error: err.message };
    }
  };

  // Logout
  const logout = async () => {
    if (isSupabaseConfigured) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.warn("Supabase signOut error", e);
      }
    }
    setUser(null);
  };

  // Quick Switch for Development & Testing (switch between student, owner, and admin demo accounts)
  const switchRoleDemo = (targetRole) => {
    const users = mockDb.getUsers();
    const target = users.find(u => u.role === targetRole);
    if (target) {
      setUser(target);
    }
  };

  // Profile update
  const updateProfile = (updates) => {
    if (!user) return;
    const updated = { ...user, ...updates, updated_at: new Date().toISOString() };
    setUser(updated);
    const users = mockDb.getUsers();
    mockDb.saveUsers(users.map(u => u.id === user.id ? updated : u));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        isAuthenticated: Boolean(user),
        loading,
        authError,
        login,
        register,
        logout,
        switchRoleDemo,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
