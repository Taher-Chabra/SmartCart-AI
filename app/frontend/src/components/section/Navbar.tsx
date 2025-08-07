'use client';

import Link from "next/link";
import { useAuthStore } from "@/store/auth.store";
import { logoutUser } from "@/services/auth.service";
import { clearUserCache } from "@/utils/userCache";
import { navigateTo } from "@/lib/router";

function Navbar() {
   const user = useAuthStore((state) => state.user);
   const clearUser = useAuthStore((state) => state.clearUser);
   

   const handleUserLogout = async() => {
      const res = await logoutUser();
      if (res.success) {
         clearUser();
         clearUserCache();
         sessionStorage.removeItem('auth-storage');
         navigateTo('/');
         sessionStorage.removeItem('user');
      } else {
         console.error('Logout failed:', res.message);
      }
   }
   
   return (
      <nav className="bg-gray-800 p-4">
         <div className="container mx-auto flex justify-between items-center">
         <div className="text-white text-lg font-bold">SmartCart - AI</div>
         <div className="flex space-x-4">
            {user ? (
               <>
               <span className="text-white">{user.username}</span>
               <button
                  onClick={handleUserLogout}
                  className="text-white hover:text-gray-300"
               >
                  Logout
               </button>
               </>
            ) : (
               <>
               <Link href="/auth/login" className="text-white hover:text-gray-300">
                  Login
               </Link>
               <Link href="/auth/register" className="text-white hover:text-gray-300">
                  Register
               </Link>
               </>
            )}
         </div>
         </div>
      </nav>
   );
}

export default Navbar;