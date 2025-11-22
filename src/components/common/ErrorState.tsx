import { useTranslation } from 'react-i18next';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

const ErrorState = ({ title, message, onRetry }: ErrorStateProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex h-64 w-full flex-col items-center justify-center gap-4 rounded-3xl border border-danger/30 bg-danger/5 text-center text-danger">
      <div className="text-lg font-semibold">{title ?? t('states.errorTitle')}</div>
      <p className="max-w-md text-sm text-danger/80">{message ?? t('states.errorMessage')}</p>
      {onRetry ? (
        <button
          onClick={onRetry}
          className="rounded-full bg-danger/80 px-6 py-2 text-sm font-semibold text-white transition hover:bg-danger"
        >
          {t('states.retry')}
        </button>
      ) : null}
    </div>
  );
};

export default ErrorState;
