import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export default function Navigation() {
  const navRef = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navLinks = [
    { label: 'Practice', id: 'practice' },
    { label: 'About', id: 'about' },
    { label: 'Contact', id: 'contact' },
  ];

  useEffect(() => {
    if (navRef.current) {
      gsap.fromTo(
        navRef.current,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.2 }
      );
    }
  }, []);

  return (
    <>
      <nav
        ref={navRef}
        className="fixed top-0 left-0 w-full z-[100] transition-all duration-500 opacity-0"
        style={{
          height: '70px',
          background: scrolled ? 'rgba(12, 11, 11, 0.9)' : 'transparent',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
        }}
      >
        <div
          className="flex items-center justify-between h-full mx-auto"
          style={{ padding: '0 clamp(24px, 5vw, 80px)' }}
        >
          {/* Logo */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="font-bold text-white uppercase tracking-[0.08em] text-[16px] whitespace-nowrap"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            AMIR.BEMANI
          </a>

          {/* Center nav - desktop */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className="group relative text-[14px] tracking-[0.04em] transition-colors duration-[250ms]"
                style={{
                  color: '#8A8A8A',
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 400,
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.color = '#FFFFFF';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.color = '#8A8A8A';
                }}
              >
                {link.label}
                <span className="absolute bottom-[-4px] left-0 w-full h-[1px] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-[400ms]"
                  style={{ background: 'rgba(255, 255, 255, 0.15)' }}
                />
              </button>
            ))}
          </div>

          {/* Right CTA - desktop */}
          <button
            onClick={() => scrollTo('contact')}
            className="hidden md:block group relative text-[14px] tracking-[0.04em] transition-colors duration-[250ms]"
            style={{ color: '#C9A96E', fontFamily: "'Space Grotesk', sans-serif", fontWeight: 400 }}
          >
            Get in Touch
            <span
              className="absolute bottom-[-4px] left-0 w-full h-[1px] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-[400ms]"
              style={{ background: 'rgba(255, 255, 255, 0.15)' }}
            />
          </button>

          {/* Hamburger - mobile */}
          <button
            className="md:hidden flex flex-col gap-[6px]"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span
              className="block w-5 h-[1px] bg-white transition-transform duration-300"
              style={{
                transform: menuOpen ? 'rotate(45deg) translateY(3.5px)' : 'none',
              }}
            />
            <span
              className="block w-5 h-[1px] bg-white transition-transform duration-300"
              style={{
                transform: menuOpen ? 'rotate(-45deg) translateY(-3.5px)' : 'none',
              }}
            />
          </button>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-[99] flex flex-col items-center justify-center gap-8"
          style={{ background: 'rgba(12, 11, 11, 0.97)', backdropFilter: 'blur(20px)' }}
        >
          {navLinks.map((link, i) => (
            <button
              key={link.id}
              onClick={() => scrollTo(link.id)}
              className="text-white text-2xl uppercase tracking-[0.06em]"
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 500,
                animation: `fadeInUp 0.4s ease forwards ${i * 0.06}s`,
                opacity: 0,
              }}
            >
              {link.label}
            </button>
          ))}
          <style>{`
            @keyframes fadeInUp {
              from { opacity: 0; transform: translateY(20px); }
              to { opacity: 1; transform: translateY(0); }
            }
          `}</style>
        </div>
      )}
    </>
  );
}
