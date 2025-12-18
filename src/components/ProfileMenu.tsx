import { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { LogOut } from "lucide-react";

const ProfileMenu = () => {
  const { user, isAuthenticated, logout } = useAuth0();
  const [open, setOpen] = useState(false);

  if (!isAuthenticated || !user) return null;

  return (
    <div className="relative">
      <img
        src={user.picture}
        alt="profile"
        className="w-9 h-9 rounded-full cursor-pointer border"
        onClick={() => setOpen(!open)}
      />

      {open && (
        <div className="absolute right-0 mt-2 w-36 bg-white border rounded-lg shadow-md">
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
      )}
    </div>
  );
};

export default ProfileMenu;
