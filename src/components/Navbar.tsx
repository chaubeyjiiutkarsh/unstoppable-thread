import { Link } from "react-router-dom";
import { ShoppingCart, User, Search, Home, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth0 } from "@auth0/auth0-react";

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth0();

  const handleLogout = () => {
    logout({ logoutParams: { returnTo: window.location.origin } });
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-primary">
            Unstoppable Threads
          </Link>

          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                className="pl-10"
              />
            </div>
          </div>

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
                  <Button variant="ghost" size="icon" className="relative">
                    <ShoppingCart className="h-5 w-5" />
                  </Button>
                </Link>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handleLogout}
                  title={`Logout (${user?.email || user?.name})`}
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </>
            ) : (
              <Link to="/auth">
                <Button>Login</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
