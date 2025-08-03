'use client';

import { useState, useEffect } from 'react';
import { Mail, Lock, ArrowRight, LogIn } from 'lucide-react';
import FormInput from '@/components/ui/FormInput';
import Link from 'next/link';
import { loginUser } from '@/services/auth.service';
import { z } from 'zod';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/auth.store';
import { redirect } from 'next/navigation';

const loginSchema = z.object({
  email: z.email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
});

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  const setUser = useAuthStore((state) => state.setUser);

  const handleUserLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const userData = {
      email,
      password,
    };

    const validation = loginSchema.safeParse(userData);
    if (!validation.success) {
      setErrors(z.treeifyError(validation.error).errors);
      return;
    }
    setErrors({});

    const response = await loginUser(userData);
    if (!response.success) {
      setErrors({ message: response.message });
      return;
    }
    setUser(response.user);
    redirect('/user/dashboard');
  };

  const handleGoogleLogin = async () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login-google`;
  };

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      toast.error(Object.values(errors).join(', ') || 'An error occurred');
    }
  }, [errors]);

  return (
    <div className="grid lg:grid-cols-2 gap-10 items-center bg-gray-800/40 backdrop-blur-sm border border-gray-700/60 rounded-2xl shadow-2xl overflow-hidden">
      {/* Left Side: Form */}
      <div className="p-8 md:p-12 order-2 lg:order-1">
        <h2 className="text-3xl font-bold mb-2">Welcome Back!</h2>
        <p className="text-gray-400 mb-8">
          Sign in to continue to your account.
        </p>
        <form onSubmit={handleUserLogin}>
          <FormInput
            Icon={Mail}
            type="email"
            name="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <FormInput
            Icon={Lock}
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="flex justify-end mb-6">
            <a
              href="#"
              className="text-sm text-indigo-400 hover:text-indigo-300"
            >
              Forgot Password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center group"
          >
            Sign In
            <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-gray-700"></div>
          <span className="flex-shrink mx-4 text-gray-400">or</span>
          <div className="flex-grow border-t border-gray-700"></div>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center"
        >
          <LogIn className="mr-3" size={20} />
          Sign In with Google
        </button>

        <p className="text-center text-gray-400 mt-8">
          Don't have an account?{' '}
          <Link
            href="/auth/register"
            className="font-semibold text-indigo-400 hover:text-indigo-300"
          >
            Register
          </Link>
        </p>
      </div>

      {/* Right Side: Branding & Info */}
      <div className="hidden lg:flex flex-col justify-center p-12 bg-indigo-600/20 h-full order-1 lg:order-2">
        <h1 className="text-4xl font-bold mb-4 leading-tight">
          Access Your Dashboard
        </h1>
        <p className="text-indigo-200 mb-8">
          Manage your profile, track your orders, and view your sales all in one
          place. Securely sign in to get started.
        </p>
        <img
          src="https://placehold.co/400x300/1e1b4b/93c5fd?text=Analytics+View&font=raleway"
          alt="Abstract dashboard illustration"
          className="rounded-lg shadow-lg"
          onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src =
              'https://placehold.co/400x300/1e1b4b/ffffff?text=Image+Not+Found';
          }}
        />
      </div>
    </div>
  );
};

export default LoginPage;
