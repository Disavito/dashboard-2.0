import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabaseClient';

interface UserContextType {
  user: User | null;
  roles: string[] | null;
  loading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [roles, setRoles] = useState<string[] | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserAndRoles = async (currentUser: User | null) => {
    if (currentUser) {
      const { data, error } = await supabase
        .from('user_roles')
        .select(`
          roles (
            role_name
          )
        `)
        .eq('user_id', currentUser.id);

      if (error) {
        console.error('Error fetching user roles:', error);
        setRoles([]);
      } else if (data) {
        // FIX: Supabase returns the joined 'roles' as an array.
        // We need to access the first element of that array to get the role object.
        const roleNames = data
          .map(item => item.roles?.[0]?.role_name)
          .filter((roleName): roleName is string => !!roleName);
        setRoles(roleNames);
      }
    } else {
      setRoles(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    const getSession = async () => {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      await fetchUserAndRoles(currentUser);
    };

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      setLoading(true);
      fetchUserAndRoles(currentUser);
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  return (
    <UserContext.Provider value={{ user, roles, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
