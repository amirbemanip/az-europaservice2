import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function BalanceIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="#3B5BDB" strokeWidth="1">
      <line x1="24" y1="8" x2="24" y2="32" />
      <line x1="8" y1="32" x2="40" y2="32" />
      <line x1="8" y1="32" x2="8" y2="38" />
      <line x1="40" y1="32" x2="40" y2="38" />
      <line x1="4" y1="38" x2="44" y2="38" />
      <circle cx="16" cy="24" r="3" />
      <circle cx="32" cy="20" r="3" />
      <line x1="4" y1="8" x2="44" y2="8" />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="#C9A96E" strokeWidth="1">
      <polyline points="8,36 16,24 24,28 32,14 40,8" />
      <line x1="8" y1="40" x2="40" y2="40" />
      <line x1="8" y1="8" x2="8" y2="40" />
      <circle cx="16" cy="24" r="2" />
      <circle cx="24" cy="28" r="2" />
      <circle cx="32" cy="14" r="2" />
      <circle cx="40" cy="8" r="2" />
    </svg>
  );
}

interface PracticeCardProps {
  icon: React.ReactNode;
  label: string;
  title: string;
  description: string;
  services: string[];
  accentColor: string;
  delay: number;
}

function PracticeCard({ icon, title, description, services, delay }: PracticeCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: 'power3.out',
          delay,
          scrollTrigger: {
            trigger: cardRef.current,
            start: 'top 80%',
            once: true,
          },
        }
      );
    }, cardRef);

    return () => ctx.revert();
  }, [delay]);

  return (
    <div
      ref={cardRef}
      className="opacity-0"
      style={{
        background: 'rgba(255,255,255,0.03)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '2px',
        padding: '56px 40px',
        maxWidth: '520px',
        width: '100%',
      }}
    >
      <div className="mb-6">{icon}</div>
      <h3
        className="text-white uppercase mb-4"
        style={{
          fontSize: '28px',
          fontWeight: 700,
          letterSpacing: '-0.02em',
        }}
      >
        {title}
      </h3>
      <p
        className="mb-8"
        style={{
          color: '#8A8A8A',
          fontSize: 'clamp(15px, 1.1vw, 17px)',
          lineHeight: 1.6,
          letterSpacing: '0.01em',
        }}
      >
        {description}
      </p>
      <div>
        {services.map((service) => (
          <div
            key={service}
            className="py-5"
            style={{
              borderTop: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <span
              className="uppercase"
              style={{
                color: '#FFFFFF',
                fontSize: '14px',
                fontWeight: 500,
                letterSpacing: '0.06em',
              }}
            >
              {service}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Practice() {
  return (
    <section
      id="practice"
      className="relative"
      style={{
        background: '#0C0B0B',
        padding: '120px clamp(24px, 5vw, 80px)',
        zIndex: 2,
      }}
    >
      <div className="flex flex-col md:flex-row gap-[60px] justify-center items-stretch">
        <PracticeCard
          icon={<BalanceIcon />}
          label="law"
          title="Legal Practice"
          description="Specialized counsel in construction contract law (VOB/B), corporate governance, and regulatory compliance. Representing clients before German and EU courts."
          services={['Contract Negotiation', 'Litigation Strategy', 'Regulatory Compliance']}
          accentColor="#3B5BDB"
          delay={0}
        />
        <PracticeCard
          icon={<ChartIcon />}
          label="finance"
          title="Financial Advisory"
          description="M&A advisory, due diligence, and transaction structuring. Financial modeling and valuation for corporate acquisitions and strategic investments."
          services={['M&A Advisory', 'Due Diligence', 'Financial Modeling']}
          accentColor="#C9A96E"
          delay={0.15}
        />
      </div>
    </section>
  );
}
