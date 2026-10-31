import { useCallback, useEffect, useState } from 'react'
import { BookCategory } from './components/BookCategory'
import { Event } from './components/Event'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { UserAccount } from './components/UserAccount'
import userRepository from './repository/userRepository'
import purchasesRepository from './repository/purchases'

function App() {
  const [user, setUser] = useState(null)
  const [accountOpen, setAccountOpen] = useState(false)
  const [purchasesBook, setPurchasesBook] = useState([])

  const refreshPurchases = useCallback(async () => {
    try {
      const result = await purchasesRepository.getBookData()
      setPurchasesBook(Array.isArray(result?.data) ? result.data : [])
    } catch {
      setPurchasesBook([])
    }
  }, [])

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const result = await userRepository.getUser()
        setUser(result.data)
        if (result.data) {
          await refreshPurchases()
        } else {
          setPurchasesBook([])
        }
      } catch {
        setUser(null)
        setPurchasesBook([])
      }
    }
    fetchUser()
  }, [refreshPurchases])

  // Stripe redirects back with ?payment=success, but the purchase is only marked
  // paid by the webhook. Poll briefly so the owned state shows up without a reload.
  useEffect(() => {
    if (!user) return

    const params = new URLSearchParams(window.location.search)
    if (params.get('payment') !== 'success') return

    let cancelled = false
    let attempts = 0
    let timer

    const poll = async () => {
      await refreshPurchases()
      attempts += 1
      if (!cancelled && attempts < 5) timer = setTimeout(poll, 2000)
    }
    timer = setTimeout(poll, 1000)

    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [user, refreshPurchases])

  const handleSignOut = async () => {
    try {
      await userRepository.logout({ username: user.username })
    } catch {
      // ignore — the local session is cleared below regardless
    } finally {
      setUser(null)
      setPurchasesBook([])
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
      <BookCategory
        purchasesBook={purchasesBook}
        user={user}
        onRequireLogin={() => setAccountOpen(true)}
        onPurchasesChange={refreshPurchases}
      />
      <Event />
      <UserAccount
        open={accountOpen}
        onClose={() => setAccountOpen(false)}
        onLogin={(nextUser) => {
          setUser(nextUser)
          setAccountOpen(false)
          refreshPurchases()
        }}
      />
      <Footer />
    </main>
  )
}

export default App
