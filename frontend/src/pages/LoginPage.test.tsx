import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import LoginPage from './LoginPage'

const loginMock = vi.fn()
const navigateMock = vi.fn()

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom')
  return {
    ...actual,
    useNavigate: () => navigateMock,
  }
})

vi.mock('../providers/AuthProvider', () => ({
  useAuth: () => ({
    login: loginMock,
    error: null,
  }),
}))

describe('LoginPage', () => {
  beforeEach(() => {
    loginMock.mockReset()
    loginMock.mockResolvedValue(undefined)
    navigateMock.mockReset()
  })

  it('submits credentials', async () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    )

    await userEvent.clear(screen.getByLabelText(/email/i))
    await userEvent.type(screen.getByLabelText(/email/i), 'demo@vega.app')
    await userEvent.clear(screen.getByLabelText(/password/i))
    await userEvent.type(screen.getByLabelText(/password/i), 'secret')
    await userEvent.click(screen.getByRole('button', { name: /access portfolio/i }))

    expect(loginMock).toHaveBeenCalledWith('demo@vega.app', 'secret')
  })
})

