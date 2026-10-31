import { useEffect, useState } from 'react'
import { UiButton } from './ui/Button'
import { preTitle } from '../utility/style'
import userRepository from '../repository/userRepository'

export const UserAccount = ({ open, onClose, onLogin }) => {
  const [mode, setMode] = useState('login')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [notice, setNotice] = useState(null)

  const inputClass =
    'w-full rounded-xl border border-(--line) bg-(--ground) px-4 py-3 text-(--ink) outline-none focus:border-(--accent)'

  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const reset = () => {
    setUsername('')
    setPassword('')
    setError(null)
    setNotice(null)
  }

  const validate = () => {
    if (!username.trim() || !password.trim()) {
      setError('Username and password are required')
      return false
    }
    if (username.length > 255 || password.length > 255) {
      setError('Username and password must be 255 characters or fewer')
      return false
    }
    return true
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setError(null)
    setNotice(null)
    if (!validate()) return

    setLoading(true)
    try {
      const result = await userRepository.login({ username, password })
      onLogin(result.data)
      reset()
    } catch (err) {
      setError(err?.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setError(null)
    setNotice(null)
    if (!validate()) return

    setLoading(true)
    try {
      await userRepository.register({ username, password })
      setPassword('')
      setNotice('Account created. Sign in below.')
      setMode('login')
    } catch (err) {
      setError(err?.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${open ? '' : 'hidden'}`}
      role="dialog"
      aria-modal="true"
      aria-hidden={!open}
    >
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-90 rounded-2xl border border-(--line) bg-(--card) p-6 shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close account"
          className="absolute top-4 right-4 flex size-9 items-center justify-center rounded-full text-(--muted) transition-colors hover:bg-(--line) hover:text-(--ink)"
        >
          ✕
        </button>

        <p className={preTitle}>Your account</p>
        <h3 className="pt-1 pb-4">
          {mode === 'login' ? 'Sign in' : 'Create account'}
        </h3>

        <div className="flex flex-col gap-4">
          <div className="flex gap-3">
            <UiButton
              text="Login"
              type="button"
              click={() => setMode('login')}
              isActive={
                mode === 'login' ? 'bg-(--ink) text-white' : 'hover:scale-115'
              }
            />
            <UiButton
              text="Register"
              type="button"
              click={() => setMode('register')}
              isActive={
                mode === 'register'
                  ? 'bg-(--ink) text-white'
                  : 'hover:scale-115'
              }
            />
          </div>

          <form
            onSubmit={mode === 'login' ? handleLogin : handleRegister}
            className="flex flex-col gap-4"
          >
            <div>
              <label
                htmlFor="username"
                className="mb-1 block text-sm text-(--muted)"
              >
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={inputClass}
                maxLength={255}
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="mb-1 block text-sm text-(--muted)"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClass}
                maxLength={255}
              />
            </div>

            {error && <p className="text-(--accent)">{error}</p>}
            {notice && <p className="text-(--muted)">{notice}</p>}

            <div>
              <UiButton
                type="submit"
                text={
                  loading
                    ? 'Loading…'
                    : mode === 'login'
                      ? 'Sign in'
                      : 'Create account'
                }
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
