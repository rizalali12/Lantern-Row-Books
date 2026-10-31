import { useEffect, useRef, useState } from 'react'

export const Header = ({ user, onOpenAccount, onSignOut }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [active, setActive] = useState(null)
  const menuRef = useRef(null)

  const bar = 'h-0.5 w-6 bg-current transition-all duration-200'

  const navItems = [
    { label: 'Home', href: '#hero' },
    { label: 'Books', href: '#books' },
    { label: 'Event', href: '#event' },
  ]

  const handleNavLink = () => {
    setIsOpen(false)
  }

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.6,
    }

    const observer = new IntersectionObserver((enteries) => {
      enteries.forEach((entry) => {
        if (entry.isIntersecting) setActive(entry.target.id)
      })
    }, options)

    navItems.forEach((menu) => {
      const element = document.getElementById(menu.href.slice(1))
      observer.observe(element)
    })
  }, [])

  useEffect(() => {
    if (!menuOpen) return
    const onClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [menuOpen])

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between border-b border-b-(--line) bg-(--ground) px-(--gutter) py-3 font-medium text-(--ink)">
      <a href="#hero" className="font-display text-2xl">
        Lantern Row Books
      </a>

      <button
        onClick={() => setIsOpen((prev) => !prev)}
        type="button"
        className="flex size-10 flex-col items-center justify-center gap-1.5 md:hidden"
      >
        <span
          className={`${bar} ${isOpen ? 'translate-y-2 rotate-45' : ''}`}
        ></span>
        <span className={`${bar} ${isOpen ? 'opacity-0' : ''}`}></span>
        <span
          className={`${bar} ${isOpen ? '-translate-y-2 -rotate-45' : ''}`}
        ></span>
      </button>

      <nav
        className={`${isOpen ? 'visible translate-y-0 border-b border-b-(--line) bg-(--ground) opacity-100' : 'invisible -translate-y-2 opacity-0'} absolute inset-x-0 top-full py-3 transition-all duration-200 ease-out md:visible md:static md:translate-y-0 md:opacity-100`}
      >
        <ul className="flex flex-col items-center gap-8 text-[16px] md:flex-row">
          {navItems.map((item) => (
            <li key={item.href}>
              <a
                onClick={() => handleNavLink()}
                href={item.href}
                className={`inline-block rounded-[999px] px-3 py-1 transition-all duration-200 hover:-translate-y-1 ${active === item.href.slice(1) ? ' bg-(--accent) text-white hover:translate-y-0 ' : 'hover:bg-(--accent) hover:text-white '}`}
              >
                {item.label}
              </a>
            </li>
          ))}

          {user ? (
            <li ref={menuRef} className="relative">
              <button
                type="button"
                onClick={() => setMenuOpen((prev) => !prev)}
                className="inline-block cursor-pointer rounded-[999px] px-3 py-1 transition-all duration-200 hover:-translate-y-1 hover:bg-(--accent) hover:text-white"
              >
                {user.username}
              </button>

              {menuOpen && (
                <div className="absolute top-full left-1/2 z-50 mt-2 w-40 -translate-x-1/2 rounded-xl border border-(--line) bg-(--card) py-1 shadow-2xl">
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false)
                      onSignOut()
                    }}
                    className="block w-full px-4 py-2 text-left text-[15px] transition-colors hover:bg-(--ground) hover:text-(--accent)"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </li>
          ) : (
            <li>
              <button
                type="button"
                onClick={() => {
                  handleNavLink()
                  onOpenAccount()
                }}
                className="inline-block cursor-pointer rounded-[999px] px-3 py-1 transition-all duration-200 hover:-translate-y-1 hover:bg-(--accent) hover:text-white"
              >
                Account
              </button>
            </li>
          )}
        </ul>
      </nav>
    </header>
  )
}
