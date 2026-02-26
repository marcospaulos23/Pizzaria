import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useAdminRole = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const checkAdminRole = async (userId: string | null, email: string | null) => {
      if (email === "marcospaulosites23@gmail.com") {
        if (isMounted) setIsAdmin(true);
        return;
      }

      if (!userId) {
        if (isMounted) setIsAdmin(false);
        return;
      }

      try {
        const { data, error } = await supabase.rpc('has_role', {
          _user_id: userId,
          _role: 'admin',
        });

        if (error) throw error;
        if (isMounted) setIsAdmin(data === true);
      } catch (error) {
        console.error('Error checking admin role:', error);
        if (isMounted) setIsAdmin(false);
      }
    };

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      void checkAdminRole(session?.user?.id ?? null, session?.user?.email ?? null);
    });

    const initialize = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        await checkAdminRole(session?.user?.id ?? null, session?.user?.email ?? null);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    void initialize();

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return { isAdmin, isLoading };
};

