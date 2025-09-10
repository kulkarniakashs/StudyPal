"use client";
import { FiLogOut } from "react-icons/fi";
import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
export default function UserProfile() {
  const [user, setuser] = useState<{name : string}>({name : "Loading"}); 
  const session = useSession();
  useEffect(()=>{
    if(session.status == "authenticated") setuser({name : session.data.user.name || ""})
  },[session])
  // Get initials from name
  const getInitials = (name: string) => {
    if(!name) return '?';
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return parts[0][0].toUpperCase() + parts[1][0].toUpperCase();
  };

  const handleLogout = () => {
    console.log("User logged out"); 
    signOut({callbackUrl : "/"});
  };

  return (
    <div className="flex items-center justify-between bg-gray-800 p-3 rounded-lg">
      {/* Left: Avatar + Name */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-600 text-white font-bold">
          {getInitials(user.name)}
        </div>
        <span className="text-white font-medium">{user.name}</span>
      </div>

      {/* Right: Logout Icon */}
      <button
        onClick={handleLogout}
        className="text-gray-300 hover:text-red-500 transition"
      >
        <FiLogOut size={22} />
      </button>
    </div>
  );
}
