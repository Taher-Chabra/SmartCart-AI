"use client";

import { useState } from 'react';
import { Mail, Lock, User, Briefcase, ArrowRight } from 'lucide-react';
import FormInput from '@/components/ui/FormInput';
import ToggleSwitch from '@/components/ui/ToggleSwitch';
import Link from 'next/link';

const RegisterPage = () => {
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSeller, setIsSeller] = useState(false);

  const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log({
      fullName,
      username,
      email,
      password,
      role: isSeller ? 'seller' : 'customer',
    });
  };

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
        <form onSubmit={handleRegister}>
          <FormInput
            Icon={User}
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          <FormInput
            Icon={User}
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <FormInput
            Icon={Mail}
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <FormInput
            Icon={Lock}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <ToggleSwitch
            value={isSeller}
            setValue={setIsSeller}
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
