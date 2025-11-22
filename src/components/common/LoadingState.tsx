const LoadingState = ({ label = 'Loading portfolio data...' }: { label?: string }) => (
  <div className="flex h-64 w-full flex-col items-center justify-center gap-3 rounded-3xl border border-white/10 bg-surface/60 text-slate-200">
    <div className="h-12 w-12 animate-spin rounded-full border-2 border-white/20 border-t-accent" />
    <p className="text-sm font-medium tracking-wide text-muted">{label}</p>
  </div>
)

export default LoadingState
