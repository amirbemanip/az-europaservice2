import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [subject, setSubject] = useState('Legal');

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        leftRef.current,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            once: true,
          },
        }
      );

      if (formRef.current) {
        const fields = formRef.current.querySelectorAll('.form-field');
        gsap.fromTo(
          fields,
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            ease: 'power3.out',
            stagger: 0.06,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 75%',
              once: true,
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const inputStyle: React.CSSProperties = {
    background: 'transparent',
    border: 'none',
    borderBottom: '1px solid rgba(255,255,255,0.15)',
    color: '#FFFFFF',
    fontSize: '15px',
    padding: '16px 0',
    width: '100%',
    outline: 'none',
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 400,
    transition: 'border-color 0.3s ease',
    borderRadius: '0',
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative"
      style={{
        background: '#0C0B0B',
        padding: '120px clamp(24px, 5vw, 80px)',
        zIndex: 2,
      }}
    >
      <div className="flex flex-col md:flex-row gap-16 max-w-[1200px] mx-auto">
        {/* Left column */}
        <div ref={leftRef} className="md:w-[40%] opacity-0">
          <span
            className="block uppercase mb-6"
            style={{
              color: '#C9A96E',
              fontSize: '12px',
              letterSpacing: '0.12em',
              fontWeight: 500,
            }}
          >
            CONTACT
          </span>
          <h2
            className="text-white mb-6"
            style={{
              fontSize: 'clamp(32px, 3.5vw, 56px)',
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
            }}
          >
            Let&apos;s discuss
            <br />
            your case.
          </h2>
          <p
            style={{
              color: '#8A8A8A',
              fontSize: 'clamp(15px, 1.1vw, 17px)',
              lineHeight: 1.6,
              letterSpacing: '0.01em',
              maxWidth: '320px',
            }}
          >
            Every engagement begins with understanding. Share the scope of your matter.
          </p>
        </div>

        {/* Right column - Form */}
        <div className="md:w-[60%]">
          <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="form-field">
              <input
                type="text"
                placeholder="Name"
                style={inputStyle}
                onFocus={(e) => {
                  (e.target as HTMLInputElement).style.borderBottomColor = '#C9A96E';
                }}
                onBlur={(e) => {
                  (e.target as HTMLInputElement).style.borderBottomColor = 'rgba(255,255,255,0.15)';
                }}
              />
            </div>
            <div className="form-field">
              <input
                type="email"
                placeholder="Email"
                style={inputStyle}
                onFocus={(e) => {
                  (e.target as HTMLInputElement).style.borderBottomColor = '#C9A96E';
                }}
                onBlur={(e) => {
                  (e.target as HTMLInputElement).style.borderBottomColor = 'rgba(255,255,255,0.15)';
                }}
              />
            </div>
            <div className="form-field">
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                style={{
                  ...inputStyle,
                  appearance: 'none',
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%238A8A8A' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 0 center',
                }}
                onFocus={(e) => {
                  (e.target as HTMLSelectElement).style.borderBottomColor = '#C9A96E';
                }}
                onBlur={(e) => {
                  (e.target as HTMLSelectElement).style.borderBottomColor = 'rgba(255,255,255,0.15)';
                }}
              >
                <option value="Legal" style={{ background: '#0C0B0B', color: '#fff' }}>Legal</option>
                <option value="Financial" style={{ background: '#0C0B0B', color: '#fff' }}>Financial</option>
                <option value="Both" style={{ background: '#0C0B0B', color: '#fff' }}>Both</option>
              </select>
            </div>
            <div className="form-field">
              <textarea
                placeholder="Message"
                rows={4}
                style={{
                  ...inputStyle,
                  resize: 'none',
                }}
                onFocus={(e) => {
                  (e.target as HTMLTextAreaElement).style.borderBottomColor = '#C9A96E';
                }}
                onBlur={(e) => {
                  (e.target as HTMLTextAreaElement).style.borderBottomColor = 'rgba(255,255,255,0.15)';
                }}
              />
            </div>
            <div className="form-field mt-4">
              <button
                type="submit"
                className="transition-all duration-300 hover:scale-[1.02]"
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: '#FFFFFF',
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 500,
                  fontSize: '14px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  padding: '16px 40px',
                  borderRadius: '0',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  const btn = e.currentTarget;
                  btn.style.background = '#C9A96E';
                  btn.style.borderColor = '#C9A96E';
                  btn.style.color = '#0C0B0B';
                }}
                onMouseLeave={(e) => {
                  const btn = e.currentTarget;
                  btn.style.background = 'transparent';
                  btn.style.borderColor = 'rgba(255,255,255,0.2)';
                  btn.style.color = '#FFFFFF';
                }}
              >
                Send Message
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
