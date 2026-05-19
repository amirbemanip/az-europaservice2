import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);
  const sigRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          once: true,
        },
      });

      tl.fromTo(
        labelRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
      );

      tl.fromTo(
        headlineRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
        '-=0.68'
      );

      tl.fromTo(
        bodyRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
        '-=0.6'
      );

      tl.fromTo(
        sigRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
        '-=0.6'
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative"
      style={{
        background: '#0C0B0B',
        padding: '120px clamp(24px, 5vw, 80px)',
        zIndex: 2,
      }}
    >
      <div className="mx-auto" style={{ maxWidth: '780px' }}>
        <span
          ref={labelRef}
          className="block uppercase mb-6 opacity-0"
          style={{
            color: '#C9A96E',
            fontSize: '12px',
            letterSpacing: '0.12em',
            fontWeight: 500,
          }}
        >
          ABOUT
        </span>
        <h2
          ref={headlineRef}
          className="text-white mb-8 opacity-0"
          style={{
            fontSize: 'clamp(32px, 4vw, 64px)',
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: '-0.03em',
          }}
        >
          Two disciplines.
          <br />
          One strategic mind.
        </h2>
        <p
          ref={bodyRef}
          className="opacity-0"
          style={{
            color: '#8A8A8A',
            fontSize: 'clamp(15px, 1.1vw, 17px)',
            lineHeight: 1.6,
            letterSpacing: '0.01em',
          }}
        >
          With over fifteen years navigating the intersection of German construction law and corporate finance, I bring a rare dual perspective to complex transactions. Every contract is a financial instrument. Every deal has legal architecture.
        </p>
        <p
          ref={sigRef}
          className="italic opacity-0"
          style={{
            color: '#C9A96E',
            fontSize: '14px',
            marginTop: '32px',
          }}
        >
          {'\u2014'} Amir Bemani
        </p>
      </div>
    </section>
  );
}
