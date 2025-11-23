import { useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { HiEye, HiEyeSlash } from 'react-icons/hi2';
import { useNavigate } from 'react-router-dom';

import AppFooter from '../components/common/AppFooter';
import { useAuth } from '../providers/useAuth';

const DEMO_EMAIL = 'investor@vega.app';
const DEMO_PASSWORD = 'portfolio';

const LoginPage = () => {
  const { login, error } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setLocalError(null);
    try {
      const formData = new FormData(event.currentTarget);
      const email = (formData.get('email') as string).trim();
      const password = formData.get('password') as string;
      await login(email, password);
      navigate('/dashboard', { replace: true });
    } catch (submitError) {
      setLocalError((submitError as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resolvedErrorKey = error ?? localError;
  const resolvedErrorMessage = resolvedErrorKey
    ? t(`auth.errors.${resolvedErrorKey}`, { defaultValue: resolvedErrorKey })
    : null;

  return (
    <div className="flex min-h-screen flex-col bg-[radial-gradient(circle_at_top,_rgba(124,58,237,0.35),_rgba(7,9,15,1)_70%)] px-4 py-8 text-white">
      <main className="flex flex-1 items-center justify-center">
        <div className="glass-panel w-full max-w-lg p-8">
          <div className="mb-8">
            <p className="text-sm uppercase tracking-[0.3em] text-muted">Vega</p>
            <h1 className="mt-2 text-3xl font-semibold">{t('auth.title')}</h1>
            <p className="mt-2 text-sm text-muted">
              {t('auth.subtitle', { email: DEMO_EMAIL, password: DEMO_PASSWORD })}
            </p>
          </div>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <label className="block text-sm font-semibold uppercase tracking-[0.3em] text-muted">
              {t('auth.email')}
              <input
                name="email"
                type="email"
                defaultValue={DEMO_EMAIL}
                className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-base text-white focus:border-accent focus:outline-none"
                required
              />
            </label>
            <label className="block text-sm font-semibold uppercase tracking-[0.3em] text-muted">
              {t('auth.password')}
              <div className="relative mt-2">
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  defaultValue={DEMO_PASSWORD}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 pr-12 text-base text-white focus:border-accent focus:outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted transition hover:text-white"
                  aria-label={showPassword ? t('auth.hidePassword') : t('auth.showPassword')}
                >
                  {showPassword ? (
                    <HiEyeSlash className="h-5 w-5" />
                  ) : (
                    <HiEye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </label>
            {resolvedErrorMessage && <p className="text-sm text-danger">{resolvedErrorMessage}</p>}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-2xl bg-accent px-4 py-3 text-base font-semibold text-white transition hover:bg-accent/80 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? t('auth.submitting') : t('auth.submit')}
            </button>
          </form>
        </div>
      </main>
      <AppFooter />
    </div>
  );
};

export default LoginPage;
