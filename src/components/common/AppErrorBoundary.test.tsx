import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import AppErrorBoundary from './AppErrorBoundary';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

const Boom = () => {
  throw new Error('Crash!');
};

describe('AppErrorBoundary', () => {
  it('renders fallback UI and allows retry', async () => {
    const user = userEvent.setup();
    const onReset = vi.fn();

    render(
      <AppErrorBoundary onReset={onReset}>
        <Boom />
      </AppErrorBoundary>
    );

    expect(screen.getByText(/states\.errortitle/i)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /retry/i }));
    expect(onReset).toHaveBeenCalled();
  });
});
