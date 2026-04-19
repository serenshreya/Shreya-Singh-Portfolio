import { useState, useEffect } from 'react'

const ITEMS = [
  { href: '#home',     symbol: '⌂',  label: 'Home' },
  { href: '#projects', symbol: '⬡',  label: 'Work' },
  { href: '#skills',   symbol: '◈',  label: 'Skills' },
  { href: '#contact',  symbol: '✉',  label: 'Contact' },
]

export default function MobileNav() {
  const [activeSection, setActiveSection] = useState('home')

  useEffect(() => {
    const handleScroll = () => {
      const sections = ITEMS.map(i => i.href.replace('#', ''))
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i])
        if (el && el.getBoundingClientRect().top <= 300) {
          setActiveSection(sections[i])
          break
        }
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleClick = (e, href) => {
    e.preventDefault()
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <style>{`
        .mobile-nav-bar {
          display: none !important;
        }
        @media (max-width: 767px) {
          .mobile-nav-bar {
            display: grid !important;
          }
          body {
            padding-bottom: 64px !important;
          }
        }
      `}</style>
      <nav
        className="mobile-nav-bar fixed bottom-0 left-0 right-0 z-[998] h-16 grid-cols-4"
        style={{
          background: 'rgba(10,10,10,0.97)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          gridTemplateColumns: 'repeat(4, 1fr)',
        }}
      >
        {ITEMS.map(item => (
          <a
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center gap-1 text-[10px] font-semibold uppercase tracking-wider transition-colors relative ${
              activeSection === item.href.replace('#', '') ? 'text-accent' : 'text-muted'
            }`}
            onClick={(e) => handleClick(e, item.href)}
          >
            {activeSection === item.href.replace('#', '') && (
              <span className="absolute top-0 left-1/2 -translate-x-1/2 w-5 h-[3px] bg-accent rounded-b" />
            )}
            <span className="text-xl leading-none">{item.symbol}</span>
            <span>{item.label}</span>
          </a>
        ))}
      </nav>
    </>
  )
}
