import { useEffect, useState } from 'react'
import { BookCategory } from './components/BookCategory'
import { Event } from './components/Event'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { UserAccount } from './components/UserAccount'
import userRepository from './repository/userRepository'

function App() {
  const [user, setUser] = useState(null)
  const [accountOpen, setAccountOpen] = useState(false)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const result = await userRepository.getUser()
        setUser(result.data)
      } catch {
        setUser(null)
      }
    }
    fetchUser()
  }, [])

  const handleSignOut = async () => {
    try {
      await userRepository.logout({ username: user.username })
    } catch {
      // ignore — the local session is cleared below regardless
    } finally {
      setUser(null)
    }
  }

  return (
    <main>
      <Header
        user={user}
        onOpenAccount={() => setAccountOpen(true)}
        onSignOut={handleSignOut}
      />
      <Hero />
      <BookCategory />
      <Event />
      <UserAccount
        open={accountOpen}
        onClose={() => setAccountOpen(false)}
        onLogin={(nextUser) => {
          setUser(nextUser)
          setAccountOpen(false)
        }}
      />
      <Footer />
    </main>
  )
}

export default App
