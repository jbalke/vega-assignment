import type { ReactNode } from 'react';
import { ErrorBoundary, type FallbackProps } from 'react-error-boundary';

import ErrorState from './ErrorState';

type AppErrorBoundaryProps = {
  children: ReactNode;
  onReset?: () => void;
};

const AppErrorFallback = ({ error, resetErrorBoundary }: FallbackProps) => (
  <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-10 text-white">
    <div className="w-full max-w-xl">
      <ErrorState
        title="Something went wrong"
        message={error?.message}
        onRetry={() => {
          resetErrorBoundary();
        }}
      />
    </div>
  </div>
);

const AppErrorBoundary = ({ children, onReset }: AppErrorBoundaryProps) => (
  <ErrorBoundary
    FallbackComponent={AppErrorFallback}
    onReset={() => {
      onReset?.();
    }}
  >
    {children}
  </ErrorBoundary>
);

export default AppErrorBoundary;
