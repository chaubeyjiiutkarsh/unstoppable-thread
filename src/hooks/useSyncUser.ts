import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { supabase } from "@/integrations/supabase/client";

export const useSyncUser = () => {
  const { user, isAuthenticated } = useAuth0();

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const syncUser = async () => {
      const { error } = await supabase
        .from("users")
        .upsert({
          id: user.sub,          // 🔑 Auth0 user id
          email: user.email,
          name: user.name,
          picture: user.picture,
        });

      if (error) {
        console.error("Failed to sync user:", error);
      }
    };

    syncUser();
  }, [isAuthenticated, user]);
};
