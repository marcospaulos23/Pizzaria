import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  phone: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const applySession = async (session: any) => {
      if (!isMounted) return;

      if (!session?.user) {
        setUser(null);
        return;
      }

      try {
        const profileData = await getUserProfile(session.user.id, session.user.email);
        if (!isMounted) return;
        setUser(profileData);
      } catch (error) {
        // Nunca deixe a UI presa em loading por erro de profile
        if (!isMounted) return;
        setUser({
          id: session.user.id,
          email: session.user.email ?? "",
          full_name: "",
          phone: "",
        });
      }
    };

    // Listener para mudanças contínuas (não controla isLoading principal)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      void applySession(session);
    });

    // Carregamento inicial (controla isLoading)
    const initializeAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        await applySession(session);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    void initializeAuth();

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const getUserProfile = async (userId: string, email?: string | null): Promise<UserProfile> => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return {
      id: userId,
      email: email ?? "",
      full_name: data?.full_name || '',
      phone: data?.phone || '',
    };
  };

  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    if (data.user) {
      const profileData = await getUserProfile(data.user.id, data.user.email);
      setUser(profileData);
    }

    return data;
  };

  const register = async (email: string, password: string, fullName: string, phone: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone: phone,
        },
      },
    });

    if (error) {
      throw error;
    }

    if (data.user) {
      // Create profile record
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          full_name: fullName,
          phone: phone,
          user_id: data.user.id,
        });

      if (profileError) {
        throw profileError;
      }

      setUser({
        id: data.user.id,
        email: data.user.email!,
        full_name: fullName,
        phone: phone,
      });
    }

    return data;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return {
    user,
    isLoading,
    login,
    register,
    logout,
  };
};
