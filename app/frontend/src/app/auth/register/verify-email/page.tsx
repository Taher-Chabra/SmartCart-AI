'use client';

import { useState, useEffect } from 'react';
import InputOTP from '@/components/ui/OtpInput';
import { MailCheck, Check, ArrowRight } from 'lucide-react';
import { z } from 'zod';
import { toast } from 'sonner';
import {
  verifyCode,
  sendCodeToEmail,
  completeProfileCreation,
} from '@/services/auth.service';
import setAndNavigateUser from '@/lib/auth/setAndNavigateUser';
import { useLoader } from '@/context/LoaderContext';

const VerifyEmailPage = () => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(120);
  const [verified, setVerified] = useState(false);

  const { loading, show, hide } = useLoader();

  const email = sessionStorage.getItem('email') || '';

  // Timer
  useEffect(() => {
    if (countdown === 0) return;

    const timer = setInterval(() => {
      setCountdown((prevCountdown) => prevCountdown - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  useEffect(() => {
    if (loading) hide();
  }, []);

  const handleVerify = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    show();
    setError({});
    setIsLoading(true);

    if (!otp) return;
    const validOtp = z
      .string()
      .min(6, 'Code must be 6 digits')
      .max(6, 'Code must be 6 digits')
      .regex(/^\d{6}$/, 'Code must be 6 digits and numeric')
      .safeParse(otp);

    if (!validOtp.success) {
      hide();
      setError((prev) => ({
        ...prev,
        emailOtp: validOtp.error.message,
      }));
      return;
    }

    try {
      const response = await verifyCode(email, otp);
      if (!response.success) {
        if (response.error === 'Expired') {
          toast.error('Verification code expired');
        }
        if (response.error === 'Too many attempts') {
          toast.error('Too many attempts');
        }
        throw new Error(response.error || 'Failed to verify email code');
      }
      setVerified(true);
      toast.success('Email verified successfully');
    } catch (error) {
      setError((prev) => ({
        ...prev,
        emailOtp: error instanceof Error ? error.message : 'Invalid Code',
      }));
    } finally {
      hide();
      setIsLoading(false);
    }
  };

  const sendOtpCode = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    show();
    if (countdown > 0) return;
    setIsLoading(true);

    try {
      const response = await sendCodeToEmail(email);
      if (!response.success) {
        throw new Error(response.error || 'Failed to send verification code');
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to verify email'
      );
    } finally {
      hide();
      setIsLoading(false);
    }

    setCountdown(120);
    setOtp('');
    setError({});
  };

  const completeRegistration = async () => {
    show();
    sessionStorage.removeItem('email');
    setIsLoading(true);

    try {
      const response = await completeProfileCreation();
      if (!response.success) {
        throw new Error(response.error || 'Failed to complete registration');
      }
      const currentUser = response.data.user;
      toast.success('Registration completed successfully');
      setAndNavigateUser(currentUser);
    } catch (error) {
      hide();
      toast.error(
        error instanceof Error
          ? error.message
          : 'Failed to complete registration'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Format countdown into MM:SS
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md mx-auto bg-gray-800/40 backdrop-blur-sm border border-gray-700/60 rounded-2xl shadow-2xl p-8 text-center">
        <div className="mx-auto mb-6 bg-indigo-600/20 w-16 h-16 rounded-full flex items-center justify-center">
          <MailCheck className="text-indigo-400" size={32} />
        </div>

        <h1 className="text-3xl font-bold mb-2">Check your email</h1>
        <p className="text-gray-400 mb-8">
          We've sent a 6-digit code to{' '}
          <span className="font-semibold text-indigo-300">{email}</span>.
        </p>

        {verified ? (
          <div className="flex flex-col items-center justify-center my-5">
            <div className="bg-green-700/20 rounded-full p-4 mb-4">
              <Check className="text-green-400" size={40} />
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-green-500 mb-2">
              Email Verified!
            </h2>
            <button
              className="w-full mt-7 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center group"
              onClick={completeRegistration}
            >
              <span className="text-base font-medium">
                Continue Registration
              </span>
              <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        ) : (
          <>
            <form onSubmit={handleVerify}>
              <div className="mb-10">
                <InputOTP value={otp} onChange={setOtp} />
              </div>

              {error && (
                <p className="text-red-400 text-sm mb-4 -mt-2">
                  {error.emailOtp}
                </p>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center group disabled:bg-gray-500 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Verifying...' : 'Verify'}
                {!isLoading && (
                  <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
                )}
              </button>
            </form>

            <div className="mt-8 text-sm text-gray-400">
              <p>Didn't receive the code?</p>
              <div className="flex items-center justify-center gap-2 mt-2">
                <button
                  onClick={sendOtpCode}
                  disabled={countdown > 0}
                  className="font-semibold text-indigo-400 hover:text-indigo-300 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
                >
                  Resend OTP
                </button>
                {countdown > 0 && (
                  <span className="text-gray-500">
                    ({formatTime(countdown)})
                  </span>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmailPage;
