'use client';

import { useEffect, useState } from 'react';
import { Mail, Lock, User, Briefcase, ArrowRight } from 'lucide-react';
import FormInput from '@/components/ui/FormInput';
import ToggleSwitch from '@/components/ui/ToggleSwitch';
import Link from 'next/link';
import { signupUser } from '@/services/auth.service';
import { z } from 'zod';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/auth.store';
import { navigateTo } from '@/lib/router';
import { cacheUser } from '@/utils/userCache';
import { formatErrorObject } from '@/utils/formatErrorObject';
import { IUserSignup } from '@smartcartai/shared/src/interface/user';

interface SignupFormData extends IUserSignup {
  confirmPassword: string;
  role: 'customer' | 'seller';
}

function fullNameToUsername(fullName: string): string {
  return fullName
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/^(\w+)\s+(\w+).*$/, '$1_$2');
}

const signupSchema: z.ZodType<SignupFormData> = z
  .object({
    fullName: z.string().min(5, 'Full name must be at least 5 characters long'),
    username: z.string().min(3, 'Username must be at least 3 characters long'),
    email: z.email('Invalid email format'),
    password: z.string().min(8, 'Password must be at least 8 characters long'),
    confirmPassword: z
      .string()
      .min(8, 'Confirm password must be at least 8 characters long'),
    role: z.enum(['customer', 'seller'], {
      message: 'Invalid role',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords must match',
  });

const RegisterPage = () => {
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSeller, setIsSeller] = useState(false);
  const [error, setError] = useState<Record<string, string>>({});

  const setUser = useAuthStore((state) => state.setUser);

  const handleUserSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const userData = {
      fullName,
      username,
      email,
      password,
      confirmPassword,
      role: isSeller ? 'seller' : ('customer' as 'customer' | 'seller'),
    };

    const validation = signupSchema.safeParse(userData);
    if (!validation.success) {
      const errObj = formatErrorObject(validation.error);
      setError(errObj);
      return;
    }

    try {
      const response = await signupUser(userData);
      if (!response.success) {
        throw new Error(response.error.message || 'An unknown error occurred.');
      }

      const currentUser = response.data.user;
      setUser(currentUser);
      cacheUser(currentUser);
      if (currentUser.role === 'seller') {
        navigateTo('/seller/dashboard');
      }
      if (currentUser.role === 'customer') {
        navigateTo('/customer/dashboard');
      }
      if (currentUser.role === 'admin') {
        navigateTo('/admin/dashboard');
      }
      toast.success(response.message || 'Account created successfully');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to create account'
      );
    }
  };

  useEffect(() => {
    if (!confirmPassword) return;

    setError((prev) => ({
      ...prev,
      confirmPassword:
        confirmPassword !== password ? 'Passwords must match' : '',
    }));
  }, [password, confirmPassword]);

  return (
    <div className="grid lg:grid-cols-2 gap-10 items-center bg-gray-800/40 backdrop-blur-sm border border-gray-700/60 rounded-2xl shadow-2xl overflow-hidden">
      {/* Branding & Info on the left side */}
      <div className="hidden md:flex flex-col justify-center p-12 bg-indigo-600/20 h-full">
        <h1 className="text-4xl font-bold mb-4 leading-tight">
          Join Our Thriving Marketplace
        </h1>
        <p className="text-indigo-200 mb-8">
          Whether you're here to shop the best deals or sell your unique
          products, you're in the right place. Create your account to get
          started.
        </p>
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-indigo-500 rounded-full mt-1">
              <Briefcase size={20} />
            </div>
            <div>
              <h3 className="font-semibold">Become a Seller</h3>
              <p className="text-indigo-300 text-sm">
                Set up your shop in minutes and reach thousands of customers.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="p-2 bg-indigo-500 rounded-full mt-1">
              <User size={20} />
            </div>
            <div>
              <h3 className="font-semibold">Start as a Customer</h3>
              <p className="text-indigo-300 text-sm">
                Discover unique products and support independent creators.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side: Registration Form */}
      <div className="p-8 md:p-12">
        <h2 className="text-3xl font-bold mb-2">Create Your Account</h2>
        <p className="text-gray-400 mb-8">Let's get you set up.</p>
        <form onSubmit={handleUserSignup}>
          <FormInput
            Icon={User}
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => {
              setFullName(e.target.value);
              if (error.fullName)
                setError((prev) => ({ ...prev, fullName: '' }));
            }}
            error={error.fullName}
          />
          <FormInput
            Icon={User}
            type="text"
            name="username"
            placeholder="Username"
            onClick={() => {
              if (!username) {
                setUsername(fullNameToUsername(fullName));
              }
            }}
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              if (error.username)
                setError((prev) => ({ ...prev, username: '' }));
            }}
            error={error.username}
          />
          <FormInput
            Icon={Mail}
            type="email"
            name="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error.email) setError((prev) => ({ ...prev, email: '' }));
            }}
            error={error.email}
          />
          <FormInput
            Icon={Lock}
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            formType="register"
            onChange={(e) => {
              setPassword(e.target.value);
              if (error.password)
                setError((prev) => ({ ...prev, password: '' }));
            }}
            error={error.password}
          />
          <FormInput
            Icon={Lock}
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={confirmPassword}
            formType="register"
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={error.confirmPassword}
          />

          <ToggleSwitch
            value={isSeller}
            setValue={setIsSeller}
            name="role"
            htmlFor="role-toggle"
            id="role-toggle"
          />

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center group"
          >
            Register
            <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
          </button>
        </form>
        <p className="text-center text-gray-400 mt-8">
          Already have an account?{' '}
          <Link
            href="/auth/login"
            className="font-semibold text-indigo-400 hover:text-indigo-300"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
