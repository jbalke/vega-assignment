import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

import LoginPage from './LoginPage';

const loginMock = vi.fn();
const navigateMock = vi.fn();
const authState = { error: null as string | null };

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

vi.mock('../providers/useAuth', () => ({
  useAuth: () => ({
    login: loginMock,
    error: authState.error,
  }),
}));

describe('LoginPage', () => {
  beforeEach(() => {
    loginMock.mockReset();
    loginMock.mockResolvedValue(undefined);
    navigateMock.mockReset();
    authState.error = null;
  });

  it('submits credentials', async () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    await userEvent.clear(screen.getByLabelText(/email/i));
    await userEvent.type(screen.getByLabelText(/email/i), 'demo@vega.app');
    const passwordInput = screen.getByLabelText(/password/i, { selector: 'input' });
    await userEvent.clear(passwordInput);
    await userEvent.type(passwordInput, 'secret');
    await userEvent.click(screen.getByRole('button', { name: /access portfolio/i }));

    expect(loginMock).toHaveBeenCalledWith('demo@vega.app', 'secret');
  });

  it('allows toggling password visibility', async () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    const passwordInput = screen.getByLabelText(/password/i, { selector: 'input' });
    const toggleButton = screen.getByRole('button', { name: /show password/i });

    expect(passwordInput).toHaveAttribute('type', 'password');
    await userEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'text');
    await userEvent.click(screen.getByRole('button', { name: /hide password/i }));
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('surfaces errors returned by the login mutation', async () => {
    loginMock.mockRejectedValueOnce(new Error('invalidCredentials'));

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    await userEvent.click(screen.getByRole('button', { name: /access portfolio/i }));

    expect(await screen.findByText(/invalid email or password/i)).toBeInTheDocument();
  });

  it('renders errors coming from the auth context', () => {
    authState.error = 'invalidCredentials';

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    expect(screen.getByText(/invalid email or password/i)).toBeInTheDocument();
  });

  it('switches languages through the footer selector', async () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    const languageSelect = screen.getByTestId('language-select');
    await userEvent.selectOptions(languageSelect, 'fr-FR');

    expect(await screen.findByText(/Connexion investisseur/i)).toBeInTheDocument();
  });
});
