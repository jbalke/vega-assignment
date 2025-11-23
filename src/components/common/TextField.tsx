import clsx from 'clsx';
import type { InputHTMLAttributes, ReactNode } from 'react';

type TextFieldProps = {
  id: string;
  label: string;
  error?: string | null;
  inputProps: InputHTMLAttributes<HTMLInputElement>;
  rightAdornment?: ReactNode;
  autoComplete?: string;
};

const TextField = ({
  id,
  label,
  error,
  inputProps,
  rightAdornment,
  autoComplete,
}: TextFieldProps) => {
  const { className, autoComplete: inputAutoComplete, ...restInputProps } = inputProps;
  const resolvedAutoComplete = autoComplete ?? inputAutoComplete;

  const baseClasses =
    'w-full rounded-2xl border bg-white/5 px-4 py-3 text-base text-white focus:outline-none transition';
  const classes = clsx(
    baseClasses,
    error ? 'border-danger focus:border-danger/70' : 'border-white/10 focus:border-accent',
    className
  );

  return (
    <label className="block text-sm font-semibold uppercase tracking-[0.3em] text-muted">
      {label}
      <div className="relative mt-2">
        <input
          id={id}
          autoComplete={resolvedAutoComplete}
          className={classes}
          {...restInputProps}
        />
        {rightAdornment ? (
          <div className="pointer-events-auto absolute right-3 top-1/2 -translate-y-1/2">
            {rightAdornment}
          </div>
        ) : null}
      </div>
      {error ? (
        <p
          id={restInputProps['aria-describedby']}
          data-testid={`${id}-error`}
          className="mt-2 text-sm text-danger"
          role="alert"
        >
          {error}
        </p>
      ) : null}
    </label>
  );
};

export default TextField;
