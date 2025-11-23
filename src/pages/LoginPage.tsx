import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { HiEye, HiEyeSlash } from 'react-icons/hi2';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

import AppFooter from '../components/common/AppFooter';
import TextField from '../components/common/TextField';
import { useAuth } from '../providers/useAuth';

const DEMO_EMAIL = 'investor@vega.app';
const DEMO_PASSWORD = 'portfolio';

const LoginPage = () => {
  const { login, error } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [localError, setLocalError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const validationSchema = useMemo(
    () =>
      z.object({
        email: z
          .string()
          .min(1, { message: t('auth.validation.emailRequired') })
          .email({ message: t('auth.validation.emailInvalid') }),
        password: z.string().min(1, { message: t('auth.validation.passwordRequired') }),
      }),
    [t]
  );

  type LoginFormValues = z.infer<typeof validationSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      email: DEMO_EMAIL,
      password: DEMO_PASSWORD,
    },
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
  });

  const onSubmit = handleSubmit(async ({ email, password }) => {
    setLocalError(null);
    try {
      await login(email.trim(), password);
      navigate('/dashboard', { replace: true });
    } catch (submitError) {
      setLocalError((submitError as Error).message);
    }
  });

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
          <form className="space-y-6" onSubmit={onSubmit} noValidate>
            <TextField
              id="email"
              label={t('auth.email')}
              autoComplete="email"
              error={errors.email?.message}
              inputProps={{
                type: 'email',
                ...register('email'),
                'aria-invalid': Boolean(errors.email),
                'aria-describedby': errors.email ? 'email-error' : undefined,
              }}
            />
            <TextField
              id="password"
              label={t('auth.password')}
              autoComplete="current-password"
              error={errors.password?.message}
              inputProps={{
                type: showPassword ? 'text' : 'password',
                ...register('password'),
                'aria-invalid': Boolean(errors.password),
                'aria-describedby': errors.password ? 'password-error' : undefined,
              }}
              rightAdornment={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-muted transition hover:text-white"
                  aria-label={showPassword ? t('auth.hidePassword') : t('auth.showPassword')}
                >
                  {showPassword ? (
                    <HiEyeSlash className="h-5 w-5" />
                  ) : (
                    <HiEye className="h-5 w-5" />
                  )}
                </button>
              }
            />
            {resolvedErrorMessage && (
              <p className="text-sm text-danger" role="alert">
                {resolvedErrorMessage}
              </p>
            )}
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
