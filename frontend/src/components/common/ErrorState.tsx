interface ErrorStateProps {
  title?: string
  message?: string
  onRetry?: () => void
}

const ErrorState = ({ title = 'Unable to load data', message = 'Please try again in a moment.', onRetry }: ErrorStateProps) => (
  <div className="flex h-64 w-full flex-col items-center justify-center gap-4 rounded-3xl border border-danger/30 bg-danger/5 text-center text-danger">
    <div className="text-lg font-semibold">{title}</div>
    <p className="max-w-md text-sm text-danger/80">{message}</p>
    {onRetry ? (
      <button
        onClick={onRetry}
        className="rounded-full bg-danger/80 px-6 py-2 text-sm font-semibold text-white transition hover:bg-danger"
      >
        Retry
      </button>
    ) : null}
  </div>
)

export default ErrorState

