'use client';
import { useLoader } from '@/context/LoaderContext';
import { useAuthStore } from '@/store/auth.store';
import { useEffect } from 'react';

function SellerDashboard() {
  const user = useAuthStore((state) => state.user?.username);
  const { loading, hide } = useLoader();

  useEffect(() => {
    if (loading) hide();
  }, []);

  return (
    <div>
      <p>Welcome {user} to the seller dashboard.</p>
      Seller Dashboard
    </div>
  );
}

export default SellerDashboard;
