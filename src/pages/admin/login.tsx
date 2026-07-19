import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/auth';
import { PublicLayout } from '@/layouts/PublicLayout';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormInputs) => {
    setErrorMessage(null);
    setIsLoading(true);

    try {
      await login({ email: data.email, password: data.password });
      navigate('/admin/dashboard');
    } catch (error) {
      const err = error as { message?: string };
      setErrorMessage(err?.message || 'Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PublicLayout>
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-card border border-card rounded-lg p-6 sm:p-8"
        >
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-text mb-2">Admin Login</h1>
            <p className="text-sm sm:text-base text-text-secondary">
              Sign in to your admin account
            </p>
          </div>

          {/* Error Alert */}
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              role="alert"
              aria-live="polite"
              className="mb-4 p-3 sm:p-4 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg flex items-start gap-3"
            >
              <AlertCircle size={20} className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm sm:text-base text-red-800 dark:text-red-200">{errorMessage}</p>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-text-secondary mb-1"
              >
                Email Address <span aria-label="required">*</span>
              </label>
              <input
                id="email"
                type="email"
                placeholder="admin@example.com"
                {...register('email')}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? 'email-error' : undefined}
                disabled={isLoading}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-background border border-card rounded-lg text-sm sm:text-base text-text placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all disabled:opacity-50"
              />
              {errors.email && (
                <p
                  id="email-error"
                  role="alert"
                  className="text-xs sm:text-sm text-red-500 mt-1"
                >
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-text-secondary mb-1"
              >
                Password <span aria-label="required">*</span>
              </label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                {...register('password')}
                aria-invalid={Boolean(errors.password)}
                aria-describedby={errors.password ? 'password-error' : undefined}
                disabled={isLoading}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-background border border-card rounded-lg text-sm sm:text-base text-text placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all disabled:opacity-50"
              />
              {errors.password && (
                <p
                  id="password-error"
                  role="alert"
                  className="text-xs sm:text-sm text-red-500 mt-1"
                >
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Demo Credentials */}
            <div className="p-3 sm:p-4 bg-blue-100 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700 rounded-lg">
              <p className="text-xs sm:text-sm text-blue-800 dark:text-blue-200 font-medium mb-2">
                Demo Credentials:
              </p>
              <p className="text-xs text-blue-700 dark:text-blue-300">
                Email: <code className="font-mono">admin@nexaagenda.com</code>
              </p>
              <p className="text-xs text-blue-700 dark:text-blue-300">
                Password: <code className="font-mono">Admin@123</code>
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              aria-busy={isLoading}
              className="w-full px-4 py-2 sm:py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base min-h-[44px]"
            >
              {isLoading && <Loader2 size={18} className="animate-spin" />}
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Footer */}
          <p className="text-xs sm:text-sm text-text-secondary text-center mt-6">
            This is a secure admin area. Unauthorized access is prohibited.
          </p>
        </motion.div>
      </div>
    </PublicLayout>
  );
}