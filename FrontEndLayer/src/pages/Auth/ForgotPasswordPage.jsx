import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, ArrowRight, CheckCircle, Shield } from 'lucide-react';
import { ForgotPasswordRequestSchema } from '../../Schemas/RequestSchemas/authSchemas';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../routes/RoutePaths';

const ForgotPasswordPage = () => {
  const { forgotPassword, forgotPasswordLoading, forgotPasswordSuccess, error, clearError, resetForgotPassword } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(ForgotPasswordRequestSchema),
  });

  useEffect(() => {
    clearError();
    return () => {
      resetForgotPassword();
    };
  }, [clearError, resetForgotPassword]);

  const onSubmit = (data) => {
    forgotPassword(data);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-[#FDF7FF]"
      style={{
        background: `
          radial-gradient(141.42% 141.42% at 0% 0%, rgba(103, 80, 164, 0.05) 0%, rgba(103, 80, 164, 0) 50%),
          radial-gradient(141.42% 141.42% at 100% 0%, rgba(118, 91, 0, 0.03) 0%, rgba(118, 91, 0, 0) 50%),
          radial-gradient(141.42% 141.42% at 100% 100%, rgba(103, 80, 164, 0.05) 0%, rgba(103, 80, 164, 0) 50%),
          radial-gradient(141.42% 141.42% at 0% 100%, rgba(118, 91, 0, 0.03) 0%, rgba(118, 91, 0, 0) 50%),
          linear-gradient(0deg, #FDF7FF, #FDF7FF),
          #FFFFFF
        `,
      }}
    >
      <div className="flex max-w-[1100px] w-full h-[640px] bg-white shadow-sm rounded-2xl overflow-hidden">
        <div className="relative w-[550px] min-w-[550px] h-full flex flex-col justify-between p-8 overflow-hidden">
          <div className="absolute inset-0 bg-[url('/images/image.png')] bg-cover bg-center" />
          <div className="absolute inset-0 bg-[#4F378A]/80" />

          <div className="relative z-10">
            <h1 className="font-['Hanken_Grotesk'] font-bold text-5xl text-white tracking-[-0.96px]">
              Morshed
            </h1>
          </div>

          <div className="relative z-10 space-y-2">
            <p className="font-['Hanken_Grotesk'] text-lg text-[#E0D2FF] max-w-[384px] leading-relaxed opacity-90">
              Your all-in-one academic management platform
            </p>
            <div className="flex items-center gap-2">
              <Shield size={18} className="text-white/80" />
              <span className="font-['IBM_Plex_Sans'] font-semibold text-xs text-white/80 uppercase tracking-[1.2px]">
                Private &amp; Secure
              </span>
            </div>
          </div>
        </div>

        <div className="flex-1 px-16 py-[50.8px]">
          <div className="max-w-[422px]">
            <div className="pb-8">
              <h2 className="font-['Hanken_Grotesk'] font-semibold text-3xl text-[#1D1B20]">
                Forgot Password?
              </h2>
              <p className="font-['Hanken_Grotesk'] text-base text-[#494551] mt-2">
                {forgotPasswordSuccess
                  ? "We've sent reset instructions to your email."
                  : 'Enter your email to receive reset instructions.'}
              </p>
            </div>

            {forgotPasswordSuccess ? (
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center gap-4 py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle size={36} className="text-green-600" />
                  </div>
                  <p className="font-['Hanken_Grotesk'] text-sm text-[#494551] text-center">
                    Check your inbox and follow the link to reset your password.
                  </p>
                </div>

                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={() => resetForgotPassword()}
                    className="w-full h-14 bg-[#4F378A] rounded-lg text-white font-['Hanken_Grotesk'] font-bold text-base flex items-center justify-center gap-2 hover:bg-[#3E2A6E] transition-colors"
                  >
                    Resend Reset Link
                    <ArrowRight size={13.33} className="text-white" />
                  </button>

                  <Link
                    to={ROUTES.LOGIN}
                    className="block w-full h-14 rounded-lg border-2 border-[#4F378A] text-[#4F378A] font-['Hanken_Grotesk'] font-bold text-base flex items-center justify-center hover:bg-[#4F378A]/5 transition-colors"
                  >
                    Back to Sign In
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 pb-4">
                <div className="space-y-[4.5px]">
                  <label className="font-['IBM_Plex_Sans'] font-semibold text-xs text-[#7A7582] uppercase tracking-[0.6px]">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7A7582]" />
                    <input
                      {...register('email')}
                      type="email"
                      placeholder="e.g. j.doe@university.edu"
                      className="w-full h-[50px] pl-12 pr-4 border border-[#CBC4D2] rounded-lg font-['Hanken_Grotesk'] text-base text-[#1D1B20] placeholder:text-[#CBC4D2] focus:outline-none focus:border-[#4F378A] transition-colors"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                  )}
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
                    {typeof error === 'string' ? error : error.message || 'Something went wrong'}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={forgotPasswordLoading}
                  className="w-full h-14 bg-[#4F378A] rounded-lg text-white font-['Hanken_Grotesk'] font-bold text-base flex items-center justify-center gap-2 hover:bg-[#3E2A6E] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {forgotPasswordLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      Send Reset Link
                      <ArrowRight size={13.33} className="text-white" />
                    </>
                  )}
                </button>
              </form>
            )}

            <div className="pt-8 border-t border-[#E6E0E9]">
              <p className="text-center font-['Hanken_Grotesk'] text-sm text-[#494551]">
                Remember your password?{' '}
                <Link to={ROUTES.LOGIN} className="text-[#4F378A] font-bold hover:underline">
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
