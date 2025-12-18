import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

export default function Auth() {
  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Button size="lg" onClick={handleGoogleLogin}>
        Continue with Google
      </Button>
    </div>
  );
}
