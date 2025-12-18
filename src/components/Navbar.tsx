import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Search, Home, LogOut, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Navbar = () => {
  const [user, setUser] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // 🔐 Get logged-in Supabase user
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // 🔄 Sync user → profiles table
  useEffect(() => {
    if (!user) return;

    (async () => {
      await supabase.from("profiles").upsert({
        id: user.id,
        email: user.email,
        name:
          user.user_metadata?.full_name ||
          user.user_metadata?.name ||
          user.email,
        avatar_url: user.user_metadata?.avatar_url || null,
      });
    })();
  }, [user]);

  // ❌ Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // 🔤 Initials fallback
  const getInitials = (name?: string, email?: string) => {
    if (name) return name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
    if (email) return email[0].toUpperCase();
    return "U";
  };

  // 🔐 Google Login
  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });
  };

  // 🔓 Logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setOpen(false);
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-primary">
            Unstoppable Threads
          </Link>

          {/* Search */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search products..." className="pl-10" />
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="icon">
                <Home className="h-5 w-5" />
              </Button>
            </Link>

            <Link to="/custom-design">
              <Button variant="ghost">Custom Design</Button>
            </Link>

            <Link to="/seed-lookup">
              <Button variant="ghost">Seed Info</Button>
            </Link>

            <Link to="/size-guide">
              <Button variant="ghost">Size Guide</Button>
            </Link>

            {user ? (
              <>
                <Link to="/cart">
                  <Button variant="ghost" size="icon">
                    <ShoppingCart className="h-5 w-5" />
                  </Button>
                </Link>

                {/* Profile */}
                <div className="relative" ref={menuRef}>
                  <div
                    onClick={() => setOpen(!open)}
                    className="cursor-pointer"
                  >
                    {user.user_metadata?.avatar_url ? (
                      <img
                        src={user.user_metadata.avatar_url}
                        alt="profile"
                        className="w-9 h-9 rounded-full border"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center font-semibold">
                        {getInitials(
                          user.user_metadata?.full_name,
                          user.email
                        )}
                      </div>
                    )}
                  </div>

                  {open && (
                    <div className="absolute right-0 mt-2 w-64 bg-white border rounded-xl shadow-lg overflow-hidden">
                      {/* User info */}
                      <div className="flex items-center gap-3 p-4 border-b">
                        {user.user_metadata?.avatar_url ? (
                          <img
                            src={user.user_metadata.avatar_url}
                            className="w-10 h-10 rounded-full"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-semibold">
                            {getInitials(
                              user.user_metadata?.full_name,
                              user.email
                            )}
                          </div>
                        )}

                        <div className="min-w-0">
                          <p className="font-semibold text-sm truncate">
                            {user.user_metadata?.full_name || "User"}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {user.email}
                          </p>
                        </div>
                      </div>

                      {/* Orders */}
                      <Link
                        to="/orders"
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-2 px-4 py-3 text-sm hover:bg-gray-100"
                      >
                        <Package size={16} />
                        My Orders
                      </Link>

                      {/* Logout */}
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 w-full px-4 py-3 text-sm hover:bg-gray-100 border-t"
                      >
                        <LogOut size={16} />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Button onClick={handleLogin}>Login</Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
