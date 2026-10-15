import { useState } from "react";

export const Header = () => {
  const [current, setCurrent] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const bar = "h-0.5 w-6 bg-current transition-all duration-200";

  const navItems = [
    { label: "Home", href: "#home" },
    { label: "Books", href: "#books" },
    { label: "Events", href: "#events" },
  ];

  const handleNavLink = (href) => {
    setCurrent(href);
    setIsOpen(false);
  };

  return (
    <header className="relative flex items-center justify-between border-b border-b-(--line) bg-(--ground) px-(--gutter) py-3 font-medium text-(--ink)">
      <a href="#hero" className="font-display text-2xl">
        Lantern Row Books
      </a>

      <button
        onClick={() => setIsOpen((prev) => !prev)}
        type="button"
        className="flex size-10 flex-col items-center justify-center gap-1.5 md:hidden"
      >
        <span
          className={`${bar} ${isOpen ? "translate-y-2 rotate-45" : ""}`}
        ></span>
        <span className={`${bar} ${isOpen ? "opacity-0" : ""}`}></span>
        <span
          className={`${bar} ${isOpen ? "-translate-y-2 -rotate-45" : ""}`}
        ></span>
      </button>

      <nav
        className={`${isOpen ? "visible translate-y-0 border-b border-b-(--line) opacity-100" : "invisible -translate-y-2 opacity-0"} absolute inset-x-0 top-full py-3 transition-all duration-200 ease-out md:visible md:static md:translate-y-0 md:opacity-100`}
      >
        <ul className="flex flex-col items-center gap-8 text-[16px] md:flex-row">
          {navItems.map((item) => (
            <li key={item.href}>
              <a
                onClick={() => handleNavLink(item.href)}
                href={item.href}
                className={`inline-block rounded-[999px] px-3 py-1 transition-all duration-200 hover:-translate-y-1 ${current === item.href ? " bg-(--accent) text-white hover:translate-y-0 " : "hover:bg-(--accent) hover:text-white "}`}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};
