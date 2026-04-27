// Archera — Homepage testimonials section, 3 variants.
// All variants share the same 3 testimonials (Platform9 / Floyo / Hex) with
// NO hierarchy. Each ends with a logo band + "discover their stories" CTA.

// ─────────────────────────────────────────────────────────────
// Variant A — Equal cards. All 3 visible concurrently, identical weight.
// ─────────────────────────────────────────────────────────────
function VariantA(){
  return (
    <section style={{
      background:'#fff', padding:'110px 80px 100px',
      fontFamily:'var(--ff-b)', color:'var(--ink)',
    }}>
      <SectionHeader
        theme="light"
        title={<>Real teams.<br/>Real flexibility.<br/>Real savings.</>}
        subtitle="Engineers, FinOps leads, and founders using Archera to reclaim room in their cloud spend without the lock-in."
      />

      <div style={{
        display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap: 28,
      }}>
        {TESTIMONIALS.map(t => (
          <article key={t.id} className="tc-card" style={{
            background:'#fff', border:'1px solid var(--line)',
            borderRadius:'var(--radius-lg)', padding: 40,
            display:'flex', flexDirection:'column', gap: 28,
            position:'relative', overflow:'hidden',
            transition:'border-color .2s, box-shadow .2s, transform .2s',
          }}>
            {/* Accent bar top */}
            <div style={{
              position:'absolute', top:0, left:0, right:0, height: 4,
              background: t.accent,
            }}/>

            {/* Header — company mark */}
            <div style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
              <CompanyMark company={t.company} accent={t.accent} size={18} color="var(--ink)"/>
              <span style={{
                fontFamily:'var(--ff-d)', fontSize: 11, fontWeight: 600,
                letterSpacing:'0.14em', textTransform:'uppercase', color:'var(--slate-4)',
              }}>Case study</span>
            </div>

            {/* Big typographic quote mark */}
            <div style={{
              fontFamily:'var(--ff-d)', fontWeight: 800, fontSize: 72,
              lineHeight: 0.6, color: t.accent, opacity: 0.25,
              marginBottom: -16, marginTop: 4,
            }}>“</div>

            {/* Quote */}
            <blockquote style={{
              margin: 0,
              fontFamily:'var(--ff-d)', fontWeight: 600,
              fontSize: 22, lineHeight: 1.35, letterSpacing: '-0.01em',
              color:'var(--ink)', textWrap:'pretty',
              flex: 1,
            }}>{t.quote}</blockquote>

            {/* Person */}
            <div style={{
              display:'flex', alignItems:'center', gap: 14,
              paddingTop: 22, borderTop:'1px solid var(--line-2)',
            }}>
              <img src={t.person.photo} alt="" style={{
                width: 52, height: 52, borderRadius:'50%', objectFit:'cover',
                background:'var(--paper)',
              }}/>
              <div>
                <div style={{fontFamily:'var(--ff-d)', fontWeight: 700, fontSize: 15, color:'var(--ink)'}}>
                  {t.person.name}
                </div>
                <div style={{fontSize: 13, color:'var(--slate-4)', marginTop: 2}}>
                  {t.person.role}, {t.company}
                </div>
              </div>
            </div>

            {/* Link */}
            <a href="#" style={{
              display:'inline-flex', alignItems:'center', gap: 8,
              fontFamily:'var(--ff-d)', fontWeight: 600, fontSize: 14,
              color: t.accent, textDecoration:'none',
            }}>
              Read the {t.company} story
              <span style={{
                width: 22, height: 22, borderRadius:'50%',
                background: `${t.accent}22`, color: t.accent,
                display:'grid', placeItems:'center',
              }}>→</span>
            </a>
          </article>
        ))}
      </div>

      <LogoBandAndCTA theme="light"/>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// Variant B — Carousel. One testimonial at a time, dot + arrow nav,
// company tabs act as chapter markers. Still equal weight per company.
// ─────────────────────────────────────────────────────────────
// Variant B — Stacked card deck (light). A single testimonial "card"
// sits at front. The other two peek from behind at slight horizontal
// offsets. Click a peek card to bring it forward; arrows cycle.
// Much calmer than the previous dark poster mess.
// ─────────────────────────────────────────────────────────────
function VariantB(){
  const [idx, setIdx] = React.useState(0);
  const t = TESTIMONIALS[idx];

  // Auto-advance every 7s, paused after user interaction.
  const [paused, setPaused] = React.useState(false);
  React.useEffect(()=>{
    if(paused) return;
    const id = setInterval(()=> setIdx(i => (i+1) % TESTIMONIALS.length), 7000);
    return ()=> clearInterval(id);
  }, [paused]);

  const go = (i) => { setIdx(i); setPaused(true); };

  // For each testimonial compute its position in the stack: 0 = front,
  // 1 = behind-right, 2 = behind-left (cycling).
  const stackPos = (i) => (i - idx + TESTIMONIALS.length) % TESTIMONIALS.length;

  return (
    <section style={{
      background:'#fff',
      padding:'110px 80px 100px',
      fontFamily:'var(--ff-b)', color:'var(--ink)',
      position:'relative', overflow:'hidden',
    }}>
      <SectionHeader
        theme="light"
        title={<>Real teams.<br/>Real flexibility.<br/>Real savings.</>}
        subtitle="Engineers, FinOps leads, and founders using Archera to reclaim room in their cloud spend without the lock-in."
      />

      {/* Progress rail — small timeline at top of the stage */}
      <div style={{
        display:'flex', alignItems:'center', gap: 16,
        marginBottom: 36,
        fontFamily:'var(--ff-d)',
      }}>
        <div style={{
          fontSize: 12, fontWeight: 700, letterSpacing:'0.16em',
          textTransform:'uppercase', color:'var(--slate-4)',
        }}>
          Story <span style={{color:'var(--ink)'}}>0{idx+1}</span>
          <span style={{margin:'0 8px', color:'var(--slate-5)'}}>/</span>
          03
        </div>
        <div style={{
          flex: 1, height: 2, background:'var(--line)',
          borderRadius: 999, overflow:'hidden', position:'relative',
        }}>
          <div style={{
            position:'absolute', top:0, left:0, bottom:0,
            width: `${((idx+1)/TESTIMONIALS.length)*100}%`,
            background:'var(--ink)',
            transition:'width .5s cubic-bezier(.2,.7,.3,1)',
          }}/>
        </div>
      </div>

      {/* Stage — stacked deck. Height is fixed so absolute positioning
          against it is stable. */}
      <div style={{
        position:'relative', height: 680,
        perspective: '1200px',
      }}>
        {TESTIMONIALS.map((tm, i) => {
          const pos = stackPos(i);
          const isFront = pos === 0;
          // Card transforms — the two behind cards tilt out in opposite
          // directions, slightly smaller + dimmer.
          const transforms = {
            0: 'translateX(-50%) translateY(0) scale(1)',
            1: 'translateX(calc(-50% + 160px)) translateY(32px) scale(0.93) rotate(2.5deg)',
            2: 'translateX(calc(-50% - 160px)) translateY(32px) scale(0.93) rotate(-2.5deg)',
          }[pos];
          const zIndex = 3 - pos;
          const opacity = pos === 0 ? 1 : 0.55;
          const cursor = pos === 0 ? 'default' : 'pointer';
          return (
            <article key={tm.id} onClick={()=> !isFront && go(i)} style={{
              position:'absolute', top: 0, left: '50%',
              width: 1140, height: 620,
              transform: transforms,
              zIndex, opacity, cursor,
              transition: 'transform .55s cubic-bezier(.2,.7,.3,1), opacity .4s',
              background:'#fff', borderRadius:'var(--radius-xl)',
              border:'1px solid var(--line)',
              boxShadow: isFront
                ? '0 40px 80px -30px rgba(12,10,48,0.25), 0 4px 12px rgba(12,10,48,0.05)'
                : '0 20px 40px -20px rgba(12,10,48,0.15)',
              padding: '64px 72px',
              display:'grid', gridTemplateColumns: '1fr 260px', gap: 60,
              alignItems:'stretch',
            }}>
              {/* Left — quote block */}
              <div style={{display:'flex', flexDirection:'column'}}>
                {/* Header row — company mark + case study label */}
                <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom: 24}}>
                  <CompanyMark company={tm.company} size={26}/>
                  <span style={{
                    fontFamily:'var(--ff-d)', fontSize: 11, fontWeight: 600,
                    letterSpacing:'0.16em', textTransform:'uppercase',
                    color:'var(--slate-4)',
                  }}>Case study</span>
                </div>

                {/* Big quote mark */}
                <div style={{
                  fontFamily:'var(--ff-d)', fontWeight: 800, fontSize: 90,
                  lineHeight: 0.5, color: tm.accent, opacity: 0.3,
                  marginBottom: 12, marginTop: 4,
                }}>“</div>

                {/* Quote */}
                <blockquote style={{
                  margin: 0, flex: 1,
                  fontFamily:'var(--ff-d)', fontWeight: 600,
                  fontSize: 34, lineHeight: 1.25, letterSpacing:'-0.02em',
                  color:'var(--ink)', textWrap:'pretty',
                }}>{tm.quote}</blockquote>

                {/* Person + link */}
                <div style={{
                  marginTop: 40, display:'flex', alignItems:'center', gap: 16,
                  paddingTop: 28, borderTop:'1px solid var(--line-2)',
                }}>
                  <img src={tm.person.photo} alt="" style={{
                    width: 56, height: 56, borderRadius:'50%', objectFit:'cover',
                    background:'var(--paper)',
                  }}/>
                  <div>
                    <div style={{fontFamily:'var(--ff-d)', fontWeight: 700, fontSize: 17, color:'var(--ink)'}}>
                      {tm.person.name}
                    </div>
                    <div style={{fontSize: 14, color:'var(--slate-4)', marginTop: 3}}>
                      {tm.person.role}, {tm.company}
                    </div>
                  </div>
                  {isFront && (
                    <a href="#" onClick={e => e.stopPropagation()} style={{
                      marginLeft:'auto',
                      display:'inline-flex', alignItems:'center', gap: 8,
                      fontFamily:'var(--ff-d)', fontWeight: 600, fontSize: 14,
                      color: tm.accent, textDecoration:'none',
                    }}>
                      Read case study
                      <span style={{
                        width: 24, height: 24, borderRadius:'50%',
                        background: `${tm.accent}22`, color: tm.accent,
                        display:'grid', placeItems:'center',
                      }}>→</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Right — a gentle gradient column with the accent color,
                  containing the story-number badge. Keeps visual weight
                  without relying on pixelated portraits. */}
              <div style={{
                position:'relative',
                borderRadius:'var(--radius-lg)',
                background: `linear-gradient(160deg, ${tm.accent}18 0%, ${tm.accent}05 100%)`,
                border: `1px solid ${tm.accent}33`,
                overflow:'hidden',
                display:'flex', flexDirection:'column', justifyContent:'space-between',
                padding: '24px 20px',
              }}>
                {/* Decorative dot stack — brand motif */}
                <div style={{display:'flex', gap: 6, alignItems:'center'}}>
                  <div style={{width: 8, height: 8, borderRadius:'50%', background: tm.accent, opacity: 0.9}}/>
                  <div style={{width: 10, height: 10, borderRadius:'50%', background: tm.accent, opacity: 0.55}}/>
                  <div style={{width: 12, height: 12, borderRadius:'50%', background: tm.accent, opacity: 0.25}}/>
                </div>

                {/* Story number */}
                <div>
                  <div style={{
                    fontFamily:'var(--ff-d)', fontSize: 11, fontWeight: 600,
                    letterSpacing:'0.16em', textTransform:'uppercase',
                    color:'var(--slate-4)',
                  }}>Story</div>
                  <div style={{
                    fontFamily:'var(--ff-d)', fontWeight: 800, fontSize: 96,
                    lineHeight: 1, letterSpacing: '-0.03em',
                    color: tm.accent, marginTop: 4,
                  }}>0{i+1}</div>
                  <div style={{
                    fontSize: 14, color:'var(--slate-4)', marginTop: 8,
                  }}>of 03</div>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Arrow controls */}
      <div style={{
        display:'flex', alignItems:'center', justifyContent:'center',
        gap: 20, marginTop: 8,
      }}>
        <button onClick={()=> go((idx - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)} aria-label="Previous"
          style={arrowBtnStyleLight}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M11 18l-6-6 6-6" stroke="var(--ink)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Dot nav between arrows */}
        <div style={{display:'flex', alignItems:'center', gap: 10}}>
          {TESTIMONIALS.map((_, i) => (
            <button key={i} onClick={()=> go(i)} style={{
              width: i === idx ? 28 : 8, height: 8, borderRadius: 999,
              background: i === idx ? t.accent : 'var(--line)',
              border:'none', cursor:'pointer', padding: 0,
              transition:'width .3s, background .3s',
            }} aria-label={`Show story ${i+1}`}/>
          ))}
        </div>

        <button onClick={()=> go((idx + 1) % TESTIMONIALS.length)} aria-label="Next"
          style={arrowBtnStyleLight}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M5 12h14M13 18l6-6-6-6" stroke="var(--ink)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      <LogoBandAndCTA theme="light"/>
    </section>
  );
}

const arrowBtnStyleLight = {
  width: 48, height: 48, borderRadius: '50%',
  background: '#fff',
  border: '1px solid var(--line)',
  display: 'grid', placeItems: 'center',
  cursor: 'pointer',
  transition: 'background .15s, border-color .15s, transform .15s',
};

// ─────────────────────────────────────────────────────────────
// Variant C — Tabbed triptych (Paraform-inspired). A single oversized
// card split into three panels: a light gray "headline + blurb" panel,
// a middle portrait panel with the customer's photo, and a dark panel
// with the company wordmark and a supporting pull-stat. Tabs at the
// top-left switch between the three customers; a "n / 3" progress
// indicator sits at the top-right.
// ─────────────────────────────────────────────────────────────
function VariantC({ theme = 'light' }){
  const isDark = theme === 'dark';
  const [idx, setIdx] = React.useState(0);
  const t = TESTIMONIALS[idx];

  // Editorial headline + short blurb per testimonial. These are summaries
  // written to sit on the left panel — the real quote lives in the full
  // case study. Keeping them short keeps the panel breathing.
  const CARDS = {
    platform9: {
      tag: 'DevOps',
      headline: 'Reclaim your AWS bill',
      blurb: 'Automation and visibility Platform9 used to make aggressive cloud decisions — and cut AWS spend significantly.',
      stat: '↓ AWS',
      statLabel: 'Aggressive cut in monthly AWS spend',
      bullets: ['Automated rightsizing', 'Cross-account visibility', 'Commitment rebalancing'],
    },
    floyo: {
      tag: 'AI Startup',
      headline: 'Scale without the analysis',
      blurb: 'Archera removed hours of commitment modeling so Floyo could grow its AI infra without a dedicated FinOps hire.',
      stat: '0 hrs',
      statLabel: 'Of manual commitment analysis per month',
      bullets: ['Zero-effort coverage', 'Startup-safe terms', 'Scale up, scale down'],
    },
    hex: {
      tag: 'Data',
      headline: 'Transparent, flat-fee pricing',
      blurb: 'Hex chose Archera for the one thing competitors kept hiding: a single predictable fee off the top — nothing more.',
      stat: '1 fee',
      statLabel: 'Flat rate, off the top — no surprises',
      bullets: ['Predictable pricing', 'No hidden spreads', 'No revenue share'],
    },
  };
  const card = CARDS[t.id];

  // Per-testimonial brand accent for the card backgrounds. Uses the
  // Archera brand palette (violet / sky / peach) rather than the per-company
  // accent colors so the vibe stays on-brand. Stored as hex so we can
  // concatenate alpha suffixes like `${bg}55` in gradient stops.
  const BG = {
    platform9: '#7101FF', // violet
    floyo:     '#6DD8FC', // sky
    hex:       '#F89090', // peach
  };
  const bg = BG[t.id];

  // Theme-dependent tokens. On dark, we invert the section bg and the
  // neutral UI (tabs, rail, counter) so the brand-tinted cards still pop.
  const sectionBg   = isDark ? 'var(--ink)'               : 'var(--paper-warm)';
  const sectionInk  = isDark ? '#fff'                      : 'var(--ink)';
  const tabActiveBg = isDark ? '#fff'                      : 'var(--ink)';
  const tabActiveFg = isDark ? 'var(--ink)'               : '#fff';
  const tabIdleFg   = isDark ? 'rgba(255,255,255,0.75)'    : 'var(--ink)';
  const railBg      = isDark ? 'rgba(255,255,255,0.18)'    : 'var(--line)';
  const railFill    = isDark ? '#fff'                      : 'var(--ink)';
  const counterFg   = isDark ? 'rgba(255,255,255,0.8)'     : 'var(--slate-3)';
  const counterDim  = isDark ? 'rgba(255,255,255,0.35)'    : 'var(--slate-5)';

  return (
    <section style={{
      background: sectionBg, padding:'110px 80px 100px',
      fontFamily:'var(--ff-b)', color: sectionInk,
      position:'relative', overflow:'hidden',
    }}>
      <SectionHeader
        theme={isDark ? 'dark' : 'light'}
        title={<>Real teams.<br/>Real flexibility.<br/>Real savings.</>}
        subtitle="Engineers, FinOps leads, and founders using Archera to reclaim room in their cloud spend without the lock-in."
      />

      {/* Tab row — pill tabs on the left, progress indicator on the right.
          Matches the Paraform reference layout almost 1:1. */}
      <div style={{
        display:'flex', alignItems:'center', justifyContent:'space-between',
        marginBottom: 32,
      }}>
        <div style={{display:'flex', alignItems:'center', gap: 8}}>
          {TESTIMONIALS.map((tm, i) => {
            const active = i === idx;
            return (
              <button key={tm.id} onClick={()=> setIdx(i)} style={{
                padding: '12px 22px', borderRadius: 999,
                background: active ? tabActiveBg : 'transparent',
                color: active ? tabActiveFg : tabIdleFg,
                border: 'none', cursor: active ? 'default' : 'pointer',
                fontFamily:'var(--ff-d)', fontWeight: 600, fontSize: 15,
                transition: 'background .2s, color .2s',
              }}>
                {tm.company}
              </button>
            );
          })}
        </div>

        {/* Counter on the right — a short filled rail plus "N / 3" */}
        <div style={{display:'flex', alignItems:'center', gap: 14}}>
          <div style={{
            position:'relative', width: 80, height: 2, background: railBg,
            borderRadius: 999, overflow:'hidden',
          }}>
            <div style={{
              position:'absolute', inset:0,
              width: `${((idx+1)/TESTIMONIALS.length)*100}%`,
              background: railFill,
              transition:'width .4s cubic-bezier(.2,.7,.3,1)',
            }}/>
          </div>
          <div style={{
            fontFamily:'var(--ff-d)', fontSize: 14, fontWeight: 600,
            color: counterFg, fontVariantNumeric:'tabular-nums',
          }}>
            {idx+1} <span style={{color: counterDim}}>/</span> {TESTIMONIALS.length}
          </div>
        </div>
      </div>

      {/* The card — 2-card grid:
          Card 1 (1/3) — light: case-study headline, summary, Read more link.
          Card 2 (2/3) — dark: person + logo + quote + pull stat. */}
      <div style={{
        display:'grid',
        gridTemplateColumns: '1fr 2fr',
        gap: 16,
      }}>
        {/* Card 1 — light, heavily tinted with the brand color. The base is
            the brand color at ~26 alpha (gives that soft pastel ground — similar
            tint to the previous #EEEEEE but keyed to the brand), and we add a
            more prominent diagonal gradient sweep so the brand hue reads
            clearly instead of reading as grey. */}
        <div key={t.id + '-cs'} style={{
          position:'relative',
          // On dark theme the alpha stops let the near-black section show
          // through, turning the tint muddy. Stack the tint over an opaque
          // light base so the card reads as a soft pastel in both themes.
          // Gradient goes light at the top (where the kicker + headline sit)
          // to heavier tint at the bottom, so grey "case study" text stays
          // legible against the wash.
          background: isDark
            ? `linear-gradient(200deg, ${bg}1A 0%, ${bg}4D 55%, ${bg}99 100%), #FFFFFF`
            : `linear-gradient(200deg, ${bg}1A 0%, ${bg}4D 55%, ${bg}99 100%), #FFFFFF`,
          borderRadius:'var(--radius-lg)',
          padding:'40px 40px 36px',
          display:'flex', flexDirection:'column',
          justifyContent: isDark ? 'center' : undefined,
          minHeight: 480,
          overflow:'hidden',
          animation:'tcPanel .5s ease both',
        }}>
          <div style={{
            fontFamily:'var(--ff-d)', fontWeight:600, fontSize:13,
            letterSpacing:'0.14em', textTransform:'uppercase',
            color:'var(--slate-4)',
          }}>Case study · {card.tag}</div>

          <h3 style={{
            marginTop: 24,
            fontFamily:'var(--ff-d)', fontWeight:600, fontSize: 36,
            lineHeight: 1.1, letterSpacing:'-0.02em', color:'var(--ink)',
            textWrap:'balance',
          }}>{card.headline}</h3>

          <p style={{
            marginTop: 20,
            fontSize:15, lineHeight:1.55, color:'var(--slate-3)',
            textWrap:'pretty',
          }}>{card.blurb}</p>

          <a href="#" style={{
            marginTop: isDark ? 24 : 'auto',
            display:'inline-flex', alignItems:'center', gap: 12,
            fontFamily:'var(--ff-d)', fontWeight:600, fontSize:15,
            color:'var(--ink)', textDecoration:'none',
            alignSelf:'flex-start',
          }}>
            Read more
            <span style={{
              width:30, height:30, borderRadius:'50%',
              background:'var(--ink)', color:'#fff',
              display:'grid', placeItems:'center',
            }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                <path d="M5 12h14M13 6l6 6-6 6" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
          </a>
        </div>

        {/* Card 2 — dark. Top row: person thumb + name/role on the left,
            company wordmark on the right. Middle: the quote (hero).
            Bottom: big pull stat (amber). */}
        <div key={t.id + '-hero'} style={{
          position:'relative',
          background:`linear-gradient(135deg, var(--ink) 0%, var(--ink) 55%, ${bg} 180%)`,
          color:'#fff',
          borderRadius:'var(--radius-lg)',
          padding:'40px 48px 44px',
          display:'flex', flexDirection:'column',
          minHeight: 480,
          overflow:'hidden',
          animation:'tcPanel .5s .05s ease both',
          // On the dark-theme section, the dark hero card would otherwise
          // blend into the section background — add a hairline light border
          // to separate it from the ground.
          border: isDark ? '1px solid rgba(255,255,255,0.18)' : 'none',
        }}>
          {/* Branded accent glow in the bottom-right */}
          <div style={{
            position:'absolute', width: 520, height: 520, borderRadius:'50%',
            bottom: -200, right: -140,
            background:`radial-gradient(circle, ${bg}66, transparent 65%)`,
            pointerEvents:'none',
          }}/>
          {/* Second, softer glow top-left for depth */}
          <div style={{
            position:'absolute', width: 340, height: 340, borderRadius:'50%',
            top: -140, left: -80,
            background:`radial-gradient(circle, ${bg}33, transparent 70%)`,
            pointerEvents:'none',
          }}/>

          {/* Top row — person on the left, wordmark on the right */}
          <div style={{
            position:'relative',
            display:'flex', alignItems:'center', justifyContent:'space-between',
            gap: 20,
          }}>
            <div style={{display:'flex', alignItems:'center', gap: 14}}>
              <img src={t.person.photo} alt="" style={{
                width: 52, height: 52, borderRadius:'50%', objectFit:'cover',
                background: t.accent, flexShrink: 0,
                boxShadow: `0 0 0 3px rgba(255,255,255,0.08)`,
              }}/>
              <div>
                <div style={{fontFamily:'var(--ff-d)', fontWeight: 700, fontSize: 16, color:'#fff'}}>
                  {t.person.name}
                </div>
                <div style={{fontSize: 13, color:'rgba(255,255,255,0.6)', marginTop: 2}}>
                  {t.person.role}
                </div>
              </div>
            </div>
            <CompanyMark company={t.company} size={28} color="#fff"/>
          </div>

          {/* Quote — hero of the card */}
          <blockquote style={{
            position:'relative',
            margin: '36px 0 0 0',
            fontFamily:'var(--ff-d)', fontWeight: 500,
            fontSize: 28, lineHeight: 1.3, letterSpacing:'-0.018em',
            color:'#fff', textWrap:'pretty', maxWidth: 720,
          }}>
            “{t.quote}”
          </blockquote>

          {/* Big pull stat at bottom, with subtle separator. Stat + label
              render in amber to pop against the dark ground. */}
          <div style={{
            position:'relative', marginTop:'auto', paddingTop: 32,
            borderTop: '1px solid rgba(255,255,255,0.12)',
            display:'flex', alignItems:'flex-end', gap: 24,
          }}>
            <div style={{
              fontFamily:'var(--ff-d)', fontWeight: 700, fontSize: 88,
              lineHeight: 0.95, letterSpacing:'-0.03em', color:'var(--amber)',
            }}>{card.stat}</div>
            <div style={{
              paddingBottom: 10,
              fontSize: 14, color:'var(--amber)',
              lineHeight:1.4, maxWidth: 320, opacity: 0.9,
            }}>
              {card.statLabel}
            </div>
          </div>
        </div>
      </div>

      <LogoBandAndCTA theme={isDark ? 'dark' : 'light'}/>

      <style>{`
        @keyframes tcPanel {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: none; }
        }
      `}</style>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// Variant D — Same layout as C, but on the dark section background.
// The left (tinted) card stays as-is; the right (dark) card gains a
// hairline white border so it reads cleanly against the dark ground.
// ─────────────────────────────────────────────────────────────
function VariantD(){
  return <VariantC theme="dark"/>;
}

// ─────────────────────────────────────────────────────────────
// Variant E — Pillar-style cards (Practitioners C grid pattern).
// Same three testimonials as Variant A, but laid out as a
// 3-col pillar grid: 2px gutter on a --line background, each
// card on --paper-warm with a per-accent 3px bar at the top
// and a numbered label, matching the practitioners vC pillar style.
// ─────────────────────────────────────────────────────────────
function VariantE(){
  return (
    <section style={{
      background:'#fff', padding:'110px 80px 100px',
      fontFamily:'var(--ff-b)', color:'var(--ink)',
    }}>
      <SectionHeader
        theme="light"
        title={<>Real teams.<br/>Real flexibility.<br/>Real savings.</>}
        subtitle="Engineers, FinOps leads, and founders using Archera to reclaim room in their cloud spend without the lock-in."
      />

      <div style={{
        display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap: 2,
        background:'var(--line)', borderRadius: 20, overflow:'hidden',
      }}>
        {TESTIMONIALS.map((t, i) => (
          <article key={t.id} className="tc-pillar" style={{
            background:'var(--paper-warm)',
            padding:'40px 36px 44px',
            display:'flex', flexDirection:'column',
            transition:'background .2s',
          }}>
            {/* Accent bar — in flex flow, matching vC-pillar::before */}
            <div style={{
              height: 3, borderRadius: 999,
              background: t.accent,
              marginBottom: 28, flexShrink: 0,
            }}/>

            {/* Number */}
            <div style={{
              fontFamily:'var(--ff-d)', fontWeight:800, fontSize:13,
              color:'var(--slate-5)', letterSpacing:'0.08em', marginBottom:20,
            }}>0{i+1}</div>

            {/* Company mark */}
            <div style={{marginBottom:24}}>
              <CompanyMark company={t.company} size={18} color="var(--ink)"/>
            </div>

            {/* Quote */}
            <blockquote style={{
              margin:0,
              fontFamily:'var(--ff-d)', fontWeight:600,
              fontSize:20, lineHeight:1.4, letterSpacing:'-0.01em',
              color:'var(--ink)', textWrap:'pretty',
              flex:1,
            }}>{t.quote}</blockquote>

            {/* Person */}
            <div style={{
              display:'flex', alignItems:'center', gap:14,
              paddingTop:22, borderTop:'1px solid var(--line-2)',
              marginTop:28,
            }}>
              <img src={t.person.photo} alt="" style={{
                width:48, height:48, borderRadius:'50%', objectFit:'cover',
                background:'var(--paper)',
              }}/>
              <div>
                <div style={{fontFamily:'var(--ff-d)', fontWeight:700, fontSize:14, color:'var(--ink)'}}>
                  {t.person.name}
                </div>
                <div style={{fontSize:13, color:'var(--slate-4)', marginTop:2}}>
                  {t.person.role}, {t.company}
                </div>
              </div>
            </div>

            {/* Link */}
            <a href="#" style={{
              display:'inline-flex', alignItems:'center', gap:8,
              fontFamily:'var(--ff-d)', fontWeight:600, fontSize:14,
              color:t.accent, textDecoration:'none',
              marginTop:20,
            }}>
              Read the {t.company} story
              <span style={{
                width:22, height:22, borderRadius:'50%',
                background:`${t.accent}22`, color:t.accent,
                display:'grid', placeItems:'center',
              }}>→</span>
            </a>
          </article>
        ))}
      </div>

      <LogoBandAndCTA theme="light"/>

      <style>{`
        .tc-pillar:hover { background: #fff !important; }
      `}</style>
    </section>
  );
}
