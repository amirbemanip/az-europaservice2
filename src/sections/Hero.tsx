import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function Hero() {
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (leftRef.current) {
      gsap.fromTo(
        leftRef.current,
        { x: -40, opacity: 0 },
        { x: 0, opacity: 1, duration: 1.2, ease: 'power3.out', delay: 0.3 }
      );
    }
    if (rightRef.current) {
      gsap.fromTo(
        rightRef.current,
        { x: 40, opacity: 0 },
        { x: 0, opacity: 1, duration: 1.2, ease: 'power3.out', delay: 0.5 }
      );
    }
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="hero"
      className="relative flex flex-col md:flex-row"
      style={{ height: '100vh', zIndex: 2 }}
    >
      {/* Left Column - Law */}
      <div
        ref={leftRef}
        className="flex-1 flex items-center justify-center opacity-0"
        style={{
          background: 'linear-gradient(180deg, rgba(12,11,11,0.75) 0%, rgba(12,11,11,0.55) 50%, rgba(12,11,11,0.75) 100%)',
          paddingTop: '100px',
        }}
      >
        <div className="text-center md:text-left" style={{ maxWidth: '380px', padding: '0 24px' }}>
          <span
            className="block uppercase mb-4"
            style={{
              color: '#3B5BDB',
              fontSize: '12px',
              letterSpacing: '0.12em',
              fontWeight: 500,
            }}
          >
            LEGAL PRACTICE
          </span>
          <h1
            className="uppercase text-white mb-4"
            style={{
              fontSize: 'clamp(36px, 4vw, 64px)',
              lineHeight: 1.05,
              fontWeight: 700,
              letterSpacing: '-0.03em',
            }}
          >
            Corporate &amp;<br />Construction Law
          </h1>
          <p
            className="mb-6"
            style={{
              color: '#8A8A8A',
              fontSize: 'clamp(15px, 1.1vw, 17px)',
              lineHeight: 1.6,
              letterSpacing: '0.01em',
            }}
          >
            Contract negotiation, litigation strategy, and regulatory compliance across German and EU jurisdictions.
          </p>
          <button
            onClick={() => scrollTo('practice')}
            className="group relative inline-block"
            style={{
              color: '#3B5BDB',
              fontSize: '14px',
              fontWeight: 500,
              letterSpacing: '0.04em',
            }}
          >
            Explore Practice
            <span
              className="absolute bottom-[-2px] left-0 w-full h-[1px] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-[400ms]"
              style={{ background: '#3B5BDB' }}
            />
          </button>
        </div>
      </div>

      {/* Right Column - Finance */}
      <div
        ref={rightRef}
        className="flex-1 flex items-center justify-center opacity-0"
        style={{
          background: 'linear-gradient(180deg, rgba(12,11,11,0.75) 0%, rgba(12,11,11,0.55) 50%, rgba(12,11,11,0.75) 100%)',
          paddingTop: '100px',
        }}
      >
        <div className="text-center md:text-left" style={{ maxWidth: '380px', padding: '0 24px' }}>
          <span
            className="block uppercase mb-4"
            style={{
              color: '#C9A96E',
              fontSize: '12px',
              letterSpacing: '0.12em',
              fontWeight: 500,
            }}
          >
            FINANCIAL STRATEGY
          </span>
          <h1
            className="uppercase text-white mb-4"
            style={{
              fontSize: 'clamp(36px, 4vw, 64px)',
              lineHeight: 1.05,
              fontWeight: 700,
              letterSpacing: '-0.03em',
            }}
          >
            M&amp;A Advisory &amp;<br />Transaction Planning
          </h1>
          <p
            className="mb-6"
            style={{
              color: '#8A8A8A',
              fontSize: 'clamp(15px, 1.1vw, 17px)',
              lineHeight: 1.6,
              letterSpacing: '0.01em',
            }}
          >
            Due diligence, financial modeling, and deal structuring for mid-market enterprises and institutional clients.
          </p>
          <button
            onClick={() => scrollTo('practice')}
            className="group relative inline-block"
            style={{
              color: '#C9A96E',
              fontSize: '14px',
              fontWeight: 500,
              letterSpacing: '0.04em',
            }}
          >
            Explore Practice
            <span
              className="absolute bottom-[-2px] left-0 w-full h-[1px] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-[400ms]"
              style={{ background: '#C9A96E' }}
            />
          </button>
        </div>
      </div>
    </section>
  );
}
