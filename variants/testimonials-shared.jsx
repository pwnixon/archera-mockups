// Shared testimonial data + logo band + CTA link used across all 3 variants.

const TESTIMONIALS = [
  {
    id: 'platform9',
    company: 'Platform9',
    accent: '#7101FF', // violet
    quote: `We now have the visibility and automation needed to make smart, aggressive cloud management decisions — and we\u2019ve significantly reduced our AWS bill as a result.`,
    person: { name: 'Esten Rye', role: 'DevOps Manager', photo: 'assets/people/esten.png' },
  },
  {
    id: 'floyo',
    company: 'Floyo',
    accent: '#6DD8FC', // sky
    quote: `Archera enables us to scale without hours of analysis. We\u2019d recommend it to any startup navigating cloud cost optimization.`,
    person: { name: 'Ashish Gupta', role: 'Head of AI Infrastructure', photo: 'assets/people/ashish.png' },
  },
  {
    id: 'hex',
    company: 'Hex',
    accent: '#FFD080', // amber
    quote: `The one differentiator with Archera is transparency in pricing. One fee off the top \u2014 that\u2019s pretty much it.`,
    person: { name: 'Kim Leung', role: 'Engineering Lead', photo: 'assets/people/kim.png' },
  },
];

// A compact wordmark rendered from the actual company SVGs.
// Always shown in grey (no per-company accent color), matching the user's
// request that all customer logos read as mono/grey.
function CompanyMark({ company, size = 22, color = 'var(--slate-3)' }){
  // Each SVG has its own intrinsic aspect; we scale by height and let width
  // flow. Platform9 logo has blue bits — we grayscale-filter so it reads mono.
  const src = company === 'Platform9' ? 'assets/customers/platform9.svg'
           : company === 'Floyo' ? 'assets/customers/floyo.svg'
           : company === 'Hex'   ? 'assets/customers/hex.svg'
           : null;
  if(!src) return <span style={{fontFamily:'var(--ff-d)', fontWeight:800, color}}>{company}</span>;
  // Light/dark detection: if color contains #fff / 255 / rgba(255 we invert.
  const isLight = typeof color === 'string' && /#fff|#FFF|255,\s*255,\s*255|rgba\(255/.test(color);
  return (
    <img src={src} alt={company} style={{
      height: size, width:'auto', display:'inline-block',
      // Greyscale makes the Platform9 blue read as mono.
      // `brightness(0)` alone collapses to black, then we invert conditionally
      // for dark surfaces.
      filter: isLight
        ? 'brightness(0) invert(1) opacity(0.85)'
        : 'grayscale(1) brightness(0) opacity(0.6)',
    }}/>
  );
}

// Bottom band shared by all 3 variants:
//   "Companies that use us" copy + row of the 9 customer logos
//   + "Discover their stories" CTA link
function LogoBandAndCTA({ theme = 'light', align = 'center' }){
  const isDark = theme === 'dark';
  const logoUrls = Array.from({length:9}, (_,i)=>`assets/customers/logo-0${i+1}.svg`);

  const bandBg = isDark ? 'rgba(255,255,255,0.03)' : 'var(--paper-warm)';
  const bandBorder = isDark ? 'rgba(255,255,255,0.08)' : 'var(--line)';
  const label = isDark ? 'rgba(255,255,255,0.55)' : 'var(--slate-4)';
  const heading = isDark ? '#fff' : 'var(--ink)';
  const body = isDark ? 'rgba(255,255,255,0.7)' : 'var(--slate-3)';
  const linkColor = isDark ? '#6DD8FC' : 'var(--violet)';

  return (
    <div style={{
      marginTop: 96,
      paddingTop: 48, borderTop: `1px solid ${bandBorder}`,
    }}>
      {/* CTA row */}
      <div style={{
        display:'grid', gridTemplateColumns:'1.1fr auto', gap: 40,
        alignItems:'end', marginBottom: 40,
      }}>
        <div>
          <div style={{
            fontFamily:'var(--ff-d)', fontWeight:700, fontSize: 13,
            letterSpacing:'0.14em', textTransform:'uppercase',
            color: isDark ? '#FFD080' : 'var(--violet)',
            marginBottom: 14,
          }}>More customer stories</div>
          <h3 style={{
            color: heading, fontSize: 32, lineHeight: 1.15,
            maxWidth: 700, textWrap: 'pretty',
          }}>
            See how other teams are succeeding in the cloud with Archera.
          </h3>
        </div>
        <a href="#" style={{
          display:'inline-flex', alignItems:'center', gap: 12,
          fontFamily:'var(--ff-d)', fontWeight:700, fontSize: 16,
          color: linkColor, textDecoration: 'none',
          padding: '14px 22px', borderRadius: 999,
          border: `1.5px solid ${linkColor}`,
          background: 'transparent',
          whiteSpace: 'nowrap',
        }}>
          Discover their stories
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M5 12h14M13 6l6 6-6 6" stroke={linkColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </a>
      </div>

      {/* Logo band — full-bleed infinite marquee scrolling right→left.
          We break out of the section's side padding (which is 80px on every
          variant) using negative margins, then render two copies of the logo
          row inside a flex track and animate translateX(-50%) so the seam is
          invisible. The strip sits on bandBg with thin top/bottom borders —
          no rounded card, no interior column dividers. */}
      <div style={{
        position:'relative',
        marginLeft: -80, marginRight: -80,
        background: bandBg,
        borderTop: `1px solid ${bandBorder}`,
        borderBottom: `1px solid ${bandBorder}`,
        padding: '32px 0 36px',
        overflow:'hidden',
      }}>
        <div style={{
          fontFamily: 'var(--ff-d)', fontWeight: 600, fontSize: 13,
          letterSpacing: '0.16em', textTransform: 'uppercase',
          color: label, marginBottom: 24, textAlign: 'center',
        }}>
          Trusted by cloud teams at scale
        </div>

        {/* Marquee track — two identical rows side by side, animated -50%.
            Each row is a flex container with gap; translating the outer track
            by 50% makes the second row seamlessly take the first's place. */}
        <div style={{
          display:'flex', width:'max-content',
          animation: 'logoMarquee 40s linear infinite',
        }}>
          {[0,1].map(loop => (
            <div key={loop} style={{
              display:'flex', alignItems:'center', gap: 72,
              paddingRight: 72,
              flexShrink: 0,
            }} aria-hidden={loop === 1 ? 'true' : undefined}>
              {logoUrls.map((u,i)=>(
                <div key={i} style={{
                  height: 48, display:'flex', alignItems:'center', justifyContent:'center',
                  flexShrink: 0,
                }}>
                  <img src={u} alt={loop === 0 ? '' : ''} style={{
                    maxHeight: 44, width:'auto',
                    opacity: isDark ? 0.75 : 0.85,
                    filter: isDark
                      ? 'grayscale(1) brightness(0) invert(1) opacity(0.8)'
                      : 'grayscale(1) brightness(0) opacity(0.65)',
                  }}/>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes logoMarquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}

// Small utility to render the Archera section header consistently.
function SectionHeader({ theme = 'light', kickerColor, title, subtitle }){
  const isDark = theme === 'dark';
  return (
    <div style={{marginBottom: 72}}>
      <div style={{
        fontFamily:'var(--ff-d)', fontWeight:700, fontSize: 13,
        letterSpacing: '0.14em', textTransform:'uppercase',
        color: kickerColor || (isDark ? 'var(--amber)' : 'var(--violet)'),
        marginBottom: 20,
      }}>Customer stories</div>
      <div style={{display:'grid', gridTemplateColumns: '1fr auto', gap: 48, alignItems:'end'}}>
        <h2 style={{
          fontSize: 52, lineHeight: 1.05, letterSpacing: '-0.025em',
          color: isDark ? '#fff' : 'var(--ink)',
          maxWidth: 780, textWrap: 'balance', margin: 0,
          fontFamily: 'var(--ff-d)', fontWeight: 700,
        }}>{title}</h2>
        {subtitle && (
          <p style={{
            color: isDark ? 'rgba(255,255,255,0.68)' : 'var(--slate-3)',
            fontSize: 17, lineHeight: 1.5, maxWidth: 420, margin: 0,
            paddingBottom: 8,
          }}>{subtitle}</p>
        )}
      </div>
    </div>
  );
}
