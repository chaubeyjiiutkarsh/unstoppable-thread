import { useEffect, useRef, useState } from "react";
import { LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const ProfileMenu = () => {
  const [user, setUser] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // 🔐 Get Supabase user
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

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

  if (!user) return null;

  const name =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    "User";

  const email = user.email || "";

  const picture =
    user.user_metadata?.avatar_url ||
    user.user_metadata?.picture ||
    null;

  const initials =
    name
      ?.split(" ")
      .map((n: string) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() ||
    email?.[0]?.toUpperCase() ||
    "U";

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* Avatar */}
      {picture ? (
        <img
          src={picture}
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
          {picture ? (
            <img src={picture} className="w-10 h-10 rounded-full" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-semibold">
              {initials}
            </div>
          )}
          <div className="min-w-0">
            <p className="font-semibold text-sm truncate">{name}</p>
            <p className="text-xs text-muted-foreground truncate">{email}</p>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
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
