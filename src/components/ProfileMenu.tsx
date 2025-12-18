import { useEffect, useRef, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { LogOut } from "lucide-react";

const ProfileMenu = () => {
  const { user, isAuthenticated, logout } = useAuth0();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // 🔹 Outside click close
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (!isAuthenticated || !user) return null;

  const initials =
    user.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() ||
    user.email?.[0]?.toUpperCase() ||
    "U";

  return (
    <div className="relative" ref={menuRef}>
      {/* Avatar */}
      {user.picture ? (
        <img
          src={user.picture}
          alt="profile"
          className="w-9 h-9 rounded-full cursor-pointer border"
          onClick={() => setOpen(!open)}
        />
      ) : (
        <div
          onClick={() => setOpen(!open)}
          className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center font-semibold cursor-pointer"
        >
          {initials}
        </div>
      )}

      {/* Dropdown */}
      <div
        className={`absolute right-0 mt-2 w-56 bg-white border rounded-xl shadow-lg
        transition-all duration-200 origin-top-right
        ${open ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none"}`}
      >
        {/* User info */}
        <div className="flex items-center gap-3 p-4 border-b">
          {user.picture ? (
            <img src={user.picture} className="w-10 h-10 rounded-full" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-semibold">
              {initials}
            </div>
          )}
          <div className="min-w-0">
            <p className="font-semibold text-sm truncate">
              {user.name || "User"}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {user.email}
            </p>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={() =>
            logout({
              logoutParams: { returnTo: window.location.origin },
            })
          }
          className="flex items-center gap-2 w-full px-4 py-3 text-sm hover:bg-gray-100 rounded-b-xl"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfileMenu;
