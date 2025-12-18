import { Link } from "react-router-dom";
import { ShoppingCart, Search, Home, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useRef, useState } from "react";

export const Navbar = () => {
  const { user, isAuthenticated, loginWithRedirect, logout } = useAuth0();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // 🔹 Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 🔹 Initials fallback
  const getInitials = (name?: string, email?: string) => {
    if (name) {
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    if (email) return email[0].toUpperCase();
    return "U";
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-primary">
            Unstoppable Threads
          </Link>

          {/* Search */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search products..." className="pl-10" />
            </div>
          </div>

          {/* Right section */}
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="icon" title="Home">
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

            {isAuthenticated ? (
              <>
                <Link to="/cart">
                  <Button variant="ghost" size="icon" title="Cart">
                    <ShoppingCart className="h-5 w-5" />
                  </Button>
                </Link>

                {/* Profile */}
                <div className="relative" ref={menuRef}>
                  <div
                    title={user?.name || user?.email}
                    onClick={() => setOpen(!open)}
                    className="cursor-pointer"
                  >
                    {user?.picture ? (
                      <img
                        src={user.picture}
                        alt="profile"
                        className="w-9 h-9 rounded-full border"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center font-semibold">
                        {getInitials(user?.name, user?.email)}
                      </div>
                    )}
                  </div>

                  {/* Dropdown */}
                  <div
                    className={`absolute right-0 mt-2 w-32 bg-white border rounded-lg shadow-md
                    transition-all duration-200 origin-top-right
                    ${open ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none"}`}
                  >
                    <button
                      onClick={() =>
                        logout({
                          logoutParams: {
                            returnTo: window.location.origin,
                          },
                        })
                      }
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <Button onClick={() => loginWithRedirect()}>
                Login
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
