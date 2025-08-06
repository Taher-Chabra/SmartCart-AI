'use client';
import { useAuthStore } from "@/store/auth.store";

function SellerDashboard() {
  const user = useAuthStore((state) => state.user?.username);
  console.log("Seller Dashboard User:", user);
  return (
    <div>
      <p>Welcome {user} to the seller dashboard.</p>
      Seller Dashboard
    </div>
  )
}

export default SellerDashboard;
