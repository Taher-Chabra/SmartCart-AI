'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { chooseRoleAfterGoogleLogin } from '@/services/auth.service';
import { ShoppingCart, Store, ArrowRight } from 'lucide-react';
import RoleOptionCard from '@/components/ui/SelectCard';
import { toast } from 'sonner';
import setAndNavigateUser from '@/lib/auth/setAndNavigateUser';
import { useLoader } from '@/context/LoaderContext';

const RoleProfilePage = () => {
  const [role, setRole] = useState('customer');

  const { loading, show, hide } = useLoader();
  const { userId } = useParams();

  const handleSubmit = async () => {
    if (!userId || typeof userId !== 'string') {
      throw new Error('Invalid user ID');
    }

    show();
    try {
      const response = await chooseRoleAfterGoogleLogin(userId, role);
      if (!response.success) {
        throw new Error(
          response.error?.message || 'An unknown error occurred.'
        );
      }

      const currentUser = response.data.user;
      toast.success(response.message || 'Login successful');
      setAndNavigateUser(currentUser);
      
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to set role'
      );
    } finally {
      hide();
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-3">
          One Last Step...
        </h1>
        <p className="text-lg text-gray-400 mb-12">
          How will you be using our platform? This will help us tailor your
          experience.
        </p>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <RoleOptionCard
            icon={<ShoppingCart size={32} className="text-gray-300" />}
            title="I'm a Customer"
            description="Browse and buy unique products from thousands of creators."
            isSelected={role === 'customer'}
            onClick={() => setRole('customer')}
          />
          <RoleOptionCard
            icon={<Store size={32} className="text-gray-300" />}
            title="I'm a Seller"
            description="Set up your digital storefront and start selling to a global audience."
            isSelected={role === 'seller'}
            onClick={() => setRole('seller')}
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full max-w-xs mx-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center group disabled:bg-gray-500 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving...' : 'Continue'}
          {!loading && (
            <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
          )}
        </button>
      </div>
    </div>
  );
};

export default RoleProfilePage;
