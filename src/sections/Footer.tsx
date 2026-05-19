import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        footerRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.6,
          scrollTrigger: {
            trigger: footerRef.current,
            start: 'top 90%',
            once: true,
          },
        }
      );
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer
      ref={footerRef}
      className="relative opacity-0"
      style={{
        borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: '40px clamp(24px, 5vw, 80px)',
        background: '#0C0B0B',
        zIndex: 2,
      }}
    >
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <span
          style={{
            color: '#8A8A8A',
            fontSize: '12px',
            fontWeight: 400,
            fontFamily: "'Space Grotesk', sans-serif",
          }}
        >
          &copy; 2025 Amir Bemani
        </span>
        <span
          className="uppercase"
          style={{
            color: '#8A8A8A',
            fontSize: '12px',
            fontWeight: 500,
            letterSpacing: '0.1em',
            fontFamily: "'Space Grotesk', sans-serif",
          }}
        >
          BREMEN, DE
        </span>
        <a
          href="mailto:amir@bemani.law"
          className="transition-colors duration-[250ms]"
          style={{
            color: '#8A8A8A',
            fontSize: '12px',
            fontWeight: 400,
            fontFamily: "'Space Grotesk', sans-serif",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.color = '#C9A96E';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.color = '#8A8A8A';
          }}
        >
          amir@bemani.law
        </a>
      </div>
    </footer>
  );
}
