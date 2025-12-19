import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const AdminRoute = ({ children }: { children: JSX.Element }) => {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: auth } = await supabase.auth.getUser();

      if (!auth.user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", auth.user.id)
        .single();

      if (error) {
        console.error("Admin check error:", error);
      }

      setIsAdmin(data?.is_admin === true);
      setLoading(false);
    };

    checkAdmin();
  }, []);

  if (loading) return null;
  if (!isAdmin) return <Navigate to="/" replace />;

  return children;
};

export default AdminRoute;
