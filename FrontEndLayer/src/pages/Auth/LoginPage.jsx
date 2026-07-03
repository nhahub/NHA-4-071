import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  GraduationCap, Presentation, ClipboardList, Shield,
  User, Lock, Eye, EyeOff, ArrowRight,
} from 'lucide-react';
import { LoginRequestSchema } from '../../Schemas/RequestSchemas/authSchemas';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../routes/RoutePaths';

const ROLE_OPTIONS = [
  { value: 'student', label: 'Student', icon: GraduationCap },
  { value: 'professor', label: 'Professor', icon: Presentation },
  { value: 'advisor', label: 'Advisor', icon: ClipboardList },
  { value: 'admin', label: 'Admin', icon: Shield },
];

const ROLE_DASHBOARD = {
  student: ROUTES.STUDENT.DASHBOARD,
  professor: ROUTES.PROFESSOR.DASHBOARD,
  advisor: ROUTES.ADVISOR.DASHBOARD,
  admin: ROUTES.ADMIN.DASHBOARD,
};

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, loading, error, user, isAuthenticated, clearError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState('student');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(LoginRequestSchema),
  });

  useEffect(() => {
    clearError();
  }, [clearError]);

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(ROLE_DASHBOARD[user.role] || ROUTES.STUDENT.DASHBOARD, { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const onSubmit = (data) => {
    login(data);
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
            <p className='opacity-50 text-white w-lg'>
              The next-generation academic portal for high-
              performance learning and collaborative
              research management.
            </p>
          </div>

          <div className="relative z-10 space-y-2">
            <p className="font-['Hanken_Grotesk'] text-lg text-[#E0D2FF] max-w-[384px] leading-relaxed opacity-90">
              Your all-in-one academic management platform
            </p>
            <div className="flex items-center gap-2">
              <Shield className='text-white' size={22}/>
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
                Welcome Back
              </h2>
              <p className="font-['Hanken_Grotesk'] text-base text-[#494551] mt-2">
                Enter your credentials to access your dashboard.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 pb-4">
              <div className="space-y-[4.5px]">
                <label className="font-['IBM_Plex_Sans'] font-semibold text-xs text-[#7A7582] uppercase tracking-[0.6px]">
                  Select Your Role
                </label>
                <div className="flex gap-[8px]">
                  {ROLE_OPTIONS.map((role) => {
                    const Icon = role.icon;
                    const isSelected = selectedRole === role.value;
                    return (
                      <button
                        key={role.value}
                        type="button"
                        onClick={() => setSelectedRole(role.value)}
                        className={`flex flex-col items-center gap-1 w-[99.5px] py-2 rounded-xl transition-colors ${
                          isSelected
                            ? 'bg-[#4F378A]/5 border-2 border-[#4F378A]'
                            : 'bg-[#F2ECF4] border-2 border-transparent'
                        }`}
                      >
                        <Icon
                          size={22}
                          className={isSelected ? 'text-[#4F378A]' : 'text-[#7A7582]'}
                        />
                        <span
                          className={`font-['Hanken_Grotesk'] font-bold text-[10px] leading-[15px] ${
                            isSelected ? 'text-[#4F378A]' : 'text-[#494551]'
                          }`}
                        >
                          {role.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-[4.5px]">
                <label className="font-['IBM_Plex_Sans'] font-semibold text-xs text-[#7A7582] uppercase tracking-[0.6px]">
                  University ID or Email
                </label>
                <div className="relative">
                  <User size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7A7582]" />
                  <input
                    {...register('universityId')}
                    type="text"
                    placeholder="e.g. j.doe@university.edu"
                    className="w-full h-[50px] pl-12 pr-4 border border-[#CBC4D2] rounded-lg font-['Hanken_Grotesk'] text-base text-[#1D1B20] placeholder:text-[#CBC4D2] focus:outline-none focus:border-[#4F378A] transition-colors"
                  />
                </div>
                {errors.universityId && (
                  <p className="text-red-500 text-xs mt-1">{errors.universityId.message}</p>
                )}
              </div>

              <div className="space-y-[4px]">
                <div className="flex justify-between items-center">
                  <label className="font-['IBM_Plex_Sans'] font-semibold text-xs text-[#7A7582] uppercase tracking-[0.6px]">
                    Password
                  </label>
                  <Link
                    to={ROUTES.FORGOT_PASSWORD}
                    className="font-['Hanken_Grotesk'] font-bold text-xs text-[#4F378A]"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7A7582]" />
                  <input
                    {...register('password')}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="w-full h-[50px] pl-12 pr-12 border border-[#CBC4D2] rounded-lg font-['Hanken_Grotesk'] text-base text-[#1D1B20] placeholder:text-[#CBC4D2] focus:outline-none focus:border-[#4F378A] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#7A7582]"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
                )}
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
                  {typeof error === 'string' ? error : error.message || 'Invalid credentials'}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full h-14 bg-[#4F378A] rounded-lg text-white font-['Hanken_Grotesk'] font-bold text-base flex items-center justify-center gap-2 hover:bg-[#3E2A6E] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    Sign In
                    <ArrowRight size={13.33} className="text-white" />
                  </>
                )}
              </button>
            </form>

            <div className="pt-8 border-t border-[#E6E0E9]">
              <p className="text-center font-['Hanken_Grotesk'] text-sm text-[#494551]">
                Don't have an account?{' '}
                <Link to={ROUTES.REGISTER} className="text-[#4F378A] font-bold hover:underline">
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
