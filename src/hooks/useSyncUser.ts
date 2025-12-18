import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { supabase } from "@/integrations/supabase/client";

export const useSyncUser = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();

  useEffect(() => {
    if (!isAuthenticated || !user || isLoading) return;

    const syncUser = async () => {
      const userId = user.sub; // 🔥 auth0|xxxx

      const { data: existingUser, error } = await supabase
        .from("users")
        .select("id")
        .eq("id", userId)
        .single();

      if (!existingUser) {
        await supabase.from("users").insert({
          id: userId,
          email: user.email,
          name: user.name,
          picture: user.picture,
        });
      }

      if (error && error.code !== "PGRST116") {
        console.error("User sync error:", error);
      }
    };

    syncUser();
  }, [isAuthenticated, user, isLoading]);
};
