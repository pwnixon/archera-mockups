// Three variants for the "How it works" section.
// VariantA — timeline (same rhythm as homepage, new visuals, no card frame)
// VariantB — horizontal stepper with tabs + single large stage
// VariantC — experimental "living diagram" with persistent central illustration

/* =========================================================
   VARIANT A — four-step vertical timeline, no surrounding card.
   Scroll interaction: the step whose midpoint is nearest
   viewport-center becomes "active" — number glows, illustration
   gets a diagonal shimmer sweep.
   ========================================================= */
function VariantA(){
  const [active, setActive] = React.useState(0);
  const rowRefs = React.useRef([]);
  const scrollRef = React.useRef(null);

  // Scroll happens INSIDE this variant (artboards are overflow:hidden).
  React.useEffect(()=>{
    const sc = scrollRef.current;
    if(!sc) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const scRect = sc.getBoundingClientRect();
      const viewportMid = scRect.top + sc.clientHeight * 0.42;
      let best = 0, bestDist = Infinity;
      rowRefs.current.forEach((el, i) => {
        if(!el) return;
        const r = el.getBoundingClientRect();
        const mid = r.top + r.height/2;
        const d = Math.abs(mid - viewportMid);
        if(d < bestDist){ bestDist = d; best = i; }
      });
      // Clamp to last step if we're near the scroll bottom — otherwise the
      // final step never quite reaches the 42% activation line.
      const atBottom = sc.scrollTop >= (sc.scrollHeight - sc.clientHeight - 60);
      if(atBottom) best = rowRefs.current.length - 1;
      setActive(best);
    };
    const onScroll = () => { if(!raf) raf = requestAnimationFrame(update); };
    update();
    sc.addEventListener('scroll', onScroll, { passive:true });
    window.addEventListener('resize', onScroll);
    const rObs = new ResizeObserver(onScroll);
    rObs.observe(sc);
    return () => {
      if(raf) cancelAnimationFrame(raf);
      sc.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      rObs.disconnect();
    };
  }, []);

  return (
    <div ref={scrollRef} style={{width:'100%', height:'100%', overflow:'auto', background:'var(--ink)'}}>
    <DarkStage padTop={120} padBottom={140}>
      <HowHead/>
      <div style={{marginTop:80, position:'relative'}}>
        {STEPS.map((s, i) => {
          const Illus = ILLUS[i];
          const accent = ACCENT_HEX[s.accent];
          const isActive = i === active;
          const accentGlow = s.accent==='amber' ? 'rgba(255,208,128,0.18)'
                           : s.accent==='crimson' ? 'rgba(173,40,75,0.22)'
                           : s.accent==='sky' ? 'rgba(109,216,252,0.20)'
                           : s.accent==='mint' ? 'rgba(56,217,191,0.22)'
                           : 'rgba(113,1,255,0.22)';
          return (
            <div key={s.n}
              ref={el => rowRefs.current[i] = el}
              style={{
                display:'grid', gridTemplateColumns:'1fr 1.1fr', gap:72,
                padding:'64px 0 64px 40px',
                borderLeft:'1px solid rgba(255,255,255,0.12)',
                position:'relative',
                opacity: isActive ? 1 : 0.42,
                transition:'opacity .5s ease'}}>

              {/* Numbered chip on the spine */}
              <div style={{
                position:'absolute', left:-22, top:78,
                width:44, height:44, borderRadius:'50%',
                background: isActive ? accent : '#0C0A30',
                border: `1.5px solid ${isActive ? accent : 'rgba(255,255,255,0.22)'}`,
                display:'grid', placeItems:'center',
                boxShadow: isActive ? `0 0 0 6px ${accentGlow}, 0 0 24px ${accent}66` : 'none',
                transition:'all .4s ease'
              }}>
                <span style={{fontFamily:'var(--ff-d)', fontWeight:800, fontSize:15,
                  letterSpacing:'-0.01em',
                  color: isActive ? '#0C0A30' : 'rgba(255,255,255,0.72)',
                  transition:'color .4s'}}>{s.n}</span>
              </div>

              {/* Text */}
              <div>
                <div style={{fontFamily:'var(--ff-d)', fontSize:11, letterSpacing:'0.22em',
                  fontWeight:700, color: isActive ? accent : 'rgba(255,255,255,0.4)',
                  marginBottom:16, transition:'color .4s'}}>{s.kicker}</div>
                <h3 style={{fontSize:32, lineHeight:1.15, color:'#fff', marginBottom:18,
                  textWrap:'balance'}}>{s.title}</h3>
                <p style={{fontSize:16.5, lineHeight:1.6,
                  color:'rgba(255,255,255,0.68)', maxWidth:460, textWrap:'pretty'}}>{s.body}</p>
              </div>

              {/* Visual — subtle shimmer only */}
              <div style={{position:'relative', overflow:'hidden', borderRadius:20}}>
                <div style={{
                  filter: isActive ? 'none' : 'brightness(0.72) saturate(0.8)',
                  transition:'filter .6s ease'
                }}>
                  <Illus/>
                </div>
                {isActive && (
                  <div key={`sh-${i}-${active}`} style={{
                    position:'absolute', inset:0, pointerEvents:'none',
                    background:`linear-gradient(105deg, transparent 45%, ${accent}14 50%, transparent 58%)`,
                    animation:'shimmerSweep 1.8s ease-out'
                  }}/>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes shimmerSweep {
          0%   { transform: translateX(-100%); opacity: 0;   }
          30%  { opacity: 1; }
          100% { transform: translateX(100%);  opacity: 0;   }
        }
      `}</style>
    </DarkStage>
    </div>
  );
}

/* =========================================================
   VARIANT B — horizontal stepper. Tabs + big stage.
   ========================================================= */
function VariantB(){
  const [active, setActive] = React.useState(0);
  const s = STEPS[active];
  const Illus = ILLUS[active];
  const accent = ACCENT_HEX[s.accent];

  return (
    <DarkStage padTop={100} padBottom={110}>
      <HowHead/>

      {/* Stepper header — grid with wrapping titles */}
      <div style={{marginTop:56, display:'grid', gridTemplateColumns:'repeat(4, minmax(0, 1fr))',
        gap:0, position:'relative', columnGap:16}}>
        {/* progress track */}
        <div style={{gridColumn:'1 / -1', gridRow:1, height:2,
          background:'rgba(255,255,255,0.1)', alignSelf:'start', position:'relative', top:28}}/>
        <div style={{gridColumn:'1 / -1', gridRow:1, height:2,
          background:`linear-gradient(90deg, ${accent}, ${accent}66)`,
          width: `${((active+1)/STEPS.length)*100}%`,
          alignSelf:'start', position:'relative', top:28,
          transition:'width .45s cubic-bezier(.4,0,.2,1), background .3s'}}/>

        {STEPS.map((st, i) => {
          const a = ACCENT_HEX[st.accent];
          const isActive = i === active;
          const isPast = i < active;
          return (
            <button key={st.n} onClick={()=>setActive(i)}
              style={{gridRow:1, background:'transparent', border:'none', color:'#fff',
                textAlign:'left', cursor:'pointer', padding:'0 12px 0 0',
                display:'flex', gap:14, alignItems:'flex-start', position:'relative', zIndex:1,
                minWidth:0}}>
              <span style={{width:56, height:56, borderRadius:'50%',
                display:'grid', placeItems:'center',
                background: isActive ? a : (isPast ? 'rgba(255,255,255,0.15)' : '#15123F'),
                color: isActive ? '#0C0A30' : '#fff',
                border: isActive ? `2px solid ${a}` : '2px solid rgba(255,255,255,0.15)',
                fontFamily:'var(--ff-d)', fontWeight:800, fontSize:18,
                transition:'all .3s', flex:'0 0 auto'}}>{st.n}</span>
              <span style={{display:'flex', flexDirection:'column', gap:4, minWidth:0, flex:1,
                paddingTop:4}}>
                <span style={{fontFamily:'var(--ff-d)', fontSize:10, letterSpacing:'0.2em',
                  fontWeight:700, color: isActive ? a : 'rgba(255,255,255,0.4)'}}>{st.kicker}</span>
                <span style={{fontFamily:'var(--ff-d)', fontSize:14, fontWeight:600,
                  color: isActive ? '#fff' : 'rgba(255,255,255,0.55)',
                  textWrap:'balance', lineHeight:1.3, wordBreak:'break-word'}}>{st.title}</span>
              </span>
            </button>
          );
        })}
      </div>

      {/* Stage */}
      <div key={active} style={{marginTop:72,
        display:'grid', gridTemplateColumns:'1fr 1.3fr', gap:80, alignItems:'center',
        animation:'fadeStage .5s ease'}}>
        <div>
          <div style={{fontFamily:'var(--ff-d)', fontSize:72, fontWeight:800,
            color:accent, lineHeight:1, letterSpacing:'-0.04em', opacity:0.9}}>{s.n}</div>
          <h3 style={{fontSize:40, lineHeight:1.1, color:'#fff', marginTop:20,
            textWrap:'balance', maxWidth:440}}>{s.title}</h3>
          <p style={{fontSize:17.5, lineHeight:1.6, color:'rgba(255,255,255,0.7)',
            marginTop:22, maxWidth:440, textWrap:'pretty'}}>{s.body}</p>

          <div style={{marginTop:40, display:'flex', gap:12}}>
            <button onClick={()=>setActive(Math.max(0, active-1))}
              disabled={active===0}
              style={{padding:'12px 20px', borderRadius:999,
                background:'rgba(255,255,255,0.06)',
                border:'1px solid rgba(255,255,255,0.15)',
                color: active===0 ? 'rgba(255,255,255,0.3)' : '#fff',
                fontFamily:'inherit', fontSize:14, fontWeight:500,
                cursor: active===0 ? 'default':'pointer'}}>← Prev</button>
            <button onClick={()=>setActive(Math.min(STEPS.length-1, active+1))}
              disabled={active===STEPS.length-1}
              style={{padding:'12px 22px', borderRadius:999,
                background: accent, border:'none', color:'#0C0A30',
                fontFamily:'inherit', fontSize:14, fontWeight:600,
                cursor: active===STEPS.length-1 ? 'default':'pointer',
                opacity: active===STEPS.length-1 ? 0.4 : 1}}>
              Next step →
            </button>
          </div>
        </div>
        <div>
          <Illus animated/>
        </div>
      </div>

      <style>{`@keyframes fadeStage {
        from { opacity:0; transform: translateY(12px); }
        to   { opacity:1; transform: translateY(0); }
      }`}</style>
    </DarkStage>
  );
}

/* =========================================================
   VARIANT C — same shape as B, but auto-advances on a timer.
   Click a step to jump + pause; a thin progress bar fills the
   active step's slot and restarts on every tick.
   ========================================================= */
function VariantC(){
  const [active, setActive] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  const TICK = 8400;

  React.useEffect(()=>{
    if(paused) return;
    const t = setTimeout(()=> setActive(s => (s+1) % STEPS.length), TICK);
    return ()=> clearTimeout(t);
  }, [active, paused]);

  const s = STEPS[active];
  const Illus = ILLUS[active];
  const accent = ACCENT_HEX[s.accent];

  const jump = (i) => { setActive(i); setPaused(true); };

  return (
    <DarkStage padTop={100} padBottom={110}>
      <HowHead/>

      {/* Stepper header with per-slot progress bars */}
      <div style={{marginTop:56, display:'grid',
        gridTemplateColumns:'repeat(4, minmax(0, 1fr))',
        gap:0, columnGap:16, position:'relative'}}>
        {STEPS.map((st, i) => {
          const a = ACCENT_HEX[st.accent];
          const isActive = i === active;
          const isPast = i < active;
          return (
            <div key={st.n} style={{display:'flex', flexDirection:'column', gap:18, minWidth:0}}>
              {/* Progress track per step */}
              <div style={{height:3, borderRadius:2, background:'rgba(255,255,255,0.1)',
                overflow:'hidden', position:'relative'}}>
                <div
                  key={isActive ? `active-${active}-${paused}` : `idle-${i}-${isPast}`}
                  style={{
                    height:'100%',
                    background: isActive ? a : (isPast ? 'rgba(255,255,255,0.35)' : 'transparent'),
                    width: isActive && paused ? '100%' : (!isActive && isPast ? '100%' : '0%'),
                    animation: isActive && !paused ? `fillBar ${TICK}ms linear forwards` : 'none',
                  }}/>
              </div>

              <button onClick={()=>jump(i)}
                style={{background:'transparent', border:'none', color:'#fff',
                  textAlign:'left', cursor:'pointer', padding:0,
                  display:'flex', gap:14, alignItems:'flex-start', minWidth:0}}>
                <span style={{width:56, height:56, borderRadius:'50%',
                  display:'grid', placeItems:'center',
                  background: isActive ? a : (isPast ? 'rgba(255,255,255,0.15)' : '#15123F'),
                  color: isActive ? '#0C0A30' : '#fff',
                  border: isActive ? `2px solid ${a}` : '2px solid rgba(255,255,255,0.15)',
                  boxShadow: isActive ? `0 0 0 8px ${a}1F` : 'none',
                  fontFamily:'var(--ff-d)', fontWeight:800, fontSize:18,
                  transition:'all .3s', flex:'0 0 auto'}}>{st.n}</span>
                <span style={{display:'flex', flexDirection:'column', gap:4, minWidth:0, flex:1, paddingTop:4}}>
                  <span style={{fontFamily:'var(--ff-d)', fontSize:10, letterSpacing:'0.2em',
                    fontWeight:700, color: isActive ? a : 'rgba(255,255,255,0.4)'}}>{st.kicker}</span>
                  <span style={{fontFamily:'var(--ff-d)', fontSize:14, fontWeight:600,
                    color: isActive ? '#fff' : 'rgba(255,255,255,0.55)',
                    textWrap:'balance', lineHeight:1.3, wordBreak:'break-word'}}>{st.title}</span>
                </span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Stage — same layout as B */}
      <div key={active} style={{marginTop:72,
        display:'grid', gridTemplateColumns:'1fr 1.3fr', gap:80, alignItems:'center',
        animation:'fadeStage .5s ease'}}>
        <div>
          <div style={{fontFamily:'var(--ff-d)', fontSize:72, fontWeight:800,
            color:accent, lineHeight:1, letterSpacing:'-0.04em', opacity:0.9}}>{s.n}</div>
          <h3 style={{fontSize:40, lineHeight:1.1, color:'#fff', marginTop:20,
            textWrap:'balance', maxWidth:440}}>{s.title}</h3>
          <p style={{fontSize:17.5, lineHeight:1.6, color:'rgba(255,255,255,0.7)',
            marginTop:22, maxWidth:440, textWrap:'pretty'}}>{s.body}</p>

          <div style={{marginTop:40, display:'flex', gap:12, alignItems:'center'}}>
            <button onClick={()=>{ setPaused(p=>!p); }}
              style={{padding:'12px 20px', borderRadius:999,
                background: paused ? accent : 'rgba(255,255,255,0.06)',
                border: paused ? 'none' : '1px solid rgba(255,255,255,0.15)',
                color: paused ? '#0C0A30' : '#fff',
                fontFamily:'inherit', fontSize:14, fontWeight:600,
                cursor:'pointer',
                display:'inline-flex', alignItems:'center', gap:8}}>
              {paused ? (
                <><svg width="10" height="12" viewBox="0 0 10 12"><path d="M0 0 L10 6 L0 12 Z" fill="currentColor"/></svg> Resume</>
              ) : (
                <><svg width="10" height="12" viewBox="0 0 10 12"><rect x="0" y="0" width="3" height="12" fill="currentColor"/><rect x="7" y="0" width="3" height="12" fill="currentColor"/></svg> Pause</>
              )}
            </button>
            <div style={{fontFamily:'var(--ff-d)', fontSize:11, fontWeight:700,
              letterSpacing:'0.18em', color:'rgba(255,255,255,0.4)'}}>
              {String(active+1).padStart(2,'0')} / {String(STEPS.length).padStart(2,'0')}
            </div>
          </div>
        </div>
        <div>
          <Illus animated/>
        </div>
      </div>

      <style>{`
        @keyframes fadeStage {
          from { opacity:0; transform: translateY(12px); }
          to   { opacity:1; transform: translateY(0); }
        }
        @keyframes fillBar {
          from { width: 0%; }
          to   { width: 100%; }
        }
      `}</style>
    </DarkStage>
  );
}


/* =========================================================
   VARIANT D — same stepper as B, light theme.
   White/paper background, ink text, accent colors adapted
   for legibility on light.
   ========================================================= */
function VariantD(){
  const [active, setActive] = React.useState(0);
  const s = STEPS[active];
  const Illus = ILLUS[active];
  const accent = ACCENT_HEX[s.accent];
  // On a light bg, violet and sky are fine; amber needs a darker shade; mint needs darkening
  const accentText = s.accent === 'amber' ? '#B8860B'
                   : s.accent === 'mint'   ? '#1A9E8A'
                   : accent;

  return (
    <div style={{
      width:'100%', minHeight:'100%',
      background:'var(--paper-warm)',
      color:'var(--ink)',
      padding:'100px 96px 110px',
      position:'relative', overflow:'hidden',
    }}>
      {/* Subtle light orbs */}
      <div style={{position:'absolute', inset:0, pointerEvents:'none',
        background:`radial-gradient(40% 40% at 90% 0%, rgba(113,1,255,0.06), transparent 70%),
                    radial-gradient(40% 40% at 0% 100%, rgba(109,216,252,0.08), transparent 70%)`}}/>
      <div style={{position:'relative', maxWidth:1280, margin:'0 auto'}}>

        {/* Section header — light version */}
        <div style={{maxWidth:800}}>
          <span style={{fontFamily:'var(--ff-d)', fontWeight:700, fontSize:13, letterSpacing:'0.16em',
            textTransform:'uppercase', color:'var(--violet)'}}>How insured commitments work</span>
          <h2 style={{fontSize:56, letterSpacing:'-0.025em', lineHeight:1.05, marginTop:18,
            color:'var(--ink)', textWrap:'balance'}}>
            Short-term commitments.<br/>Guaranteed savings.
          </h2>
          <p style={{marginTop:22, fontSize:18, lineHeight:1.55, maxWidth:600,
            color:'var(--slate-3)', textWrap:'pretty'}}>
            Archera sits between your cloud usage and your commitments — insuring the downside, so the flexibility of 30-day and 1-year terms actually pays off.
          </p>
        </div>

        {/* Stepper tabs */}
        <div style={{marginTop:56, display:'grid', gridTemplateColumns:'repeat(4, minmax(0, 1fr))',
          gap:0, position:'relative', columnGap:16}}>
          {/* progress track background */}
          <div style={{gridColumn:'1 / -1', gridRow:1, height:2,
            background:'var(--line)', alignSelf:'start', position:'relative', top:28}}/>
          {/* progress fill */}
          <div style={{gridColumn:'1 / -1', gridRow:1, height:2,
            background:`linear-gradient(90deg, ${accentText}, ${accentText}66)`,
            width:`${((active+1)/STEPS.length)*100}%`,
            alignSelf:'start', position:'relative', top:28,
            transition:'width .45s cubic-bezier(.4,0,.2,1), background .3s'}}/>

          {STEPS.map((st, i) => {
            const a = ACCENT_HEX[st.accent];
            const aText = st.accent==='amber' ? '#B8860B' : st.accent==='mint' ? '#1A9E8A' : a;
            const isActive = i === active;
            const isPast = i < active;
            return (
              <button key={st.n} onClick={()=>setActive(i)}
                style={{gridRow:1, background:'transparent', border:'none', color:'var(--ink)',
                  textAlign:'left', cursor:'pointer', padding:'0 12px 0 0',
                  display:'flex', gap:14, alignItems:'flex-start', position:'relative', zIndex:1, minWidth:0}}>
                <span style={{width:56, height:56, borderRadius:'50%',
                  display:'grid', placeItems:'center',
                  background: isActive ? a : (isPast ? 'var(--line-2)' : '#fff'),
                  color: isActive ? (st.accent==='amber' ? '#0C0A30' : '#fff') : (isPast ? 'var(--slate-4)' : 'var(--slate-4)'),
                  border: isActive ? `2px solid ${a}` : '2px solid var(--line)',
                  fontFamily:'var(--ff-d)', fontWeight:800, fontSize:18,
                  boxShadow: isActive ? `0 4px 16px -4px ${a}66` : 'none',
                  transition:'all .3s', flex:'0 0 auto'}}>{st.n}</span>
                <span style={{display:'flex', flexDirection:'column', gap:4, minWidth:0, flex:1, paddingTop:4}}>
                  <span style={{fontFamily:'var(--ff-d)', fontSize:10, letterSpacing:'0.2em',
                    fontWeight:700, color: isActive ? aText : 'var(--slate-5)'}}>{st.kicker}</span>
                  <span style={{fontFamily:'var(--ff-d)', fontSize:14, fontWeight:600,
                    color: isActive ? 'var(--ink)' : 'var(--slate-4)',
                    textWrap:'balance', lineHeight:1.3, wordBreak:'break-word'}}>{st.title}</span>
                </span>
              </button>
            );
          })}
        </div>

        {/* Stage */}
        <div key={active} style={{marginTop:72,
          display:'grid', gridTemplateColumns:'1fr 1.3fr', gap:80, alignItems:'center',
          animation:'fadeStage .5s ease'}}>
          <div>
            <div style={{fontFamily:'var(--ff-d)', fontSize:72, fontWeight:800,
              color:accentText, lineHeight:1, letterSpacing:'-0.04em', opacity:0.85}}>{s.n}</div>
            <h3 style={{fontSize:40, lineHeight:1.1, color:'var(--ink)', marginTop:20,
              textWrap:'balance', maxWidth:440}}>{s.title}</h3>
            <p style={{fontSize:17.5, lineHeight:1.6, color:'var(--slate-3)',
              marginTop:22, maxWidth:440, textWrap:'pretty'}}>{s.body}</p>

            <div style={{marginTop:40, display:'flex', gap:12}}>
              <button onClick={()=>setActive(Math.max(0, active-1))}
                disabled={active===0}
                style={{padding:'12px 20px', borderRadius:999,
                  background:'var(--line-2)', border:'1px solid var(--line)',
                  color: active===0 ? 'var(--slate-5)' : 'var(--ink)',
                  fontFamily:'inherit', fontSize:14, fontWeight:500,
                  cursor: active===0 ? 'default':'pointer'}}>&#8592; Prev</button>
              <button onClick={()=>setActive(Math.min(STEPS.length-1, active+1))}
                disabled={active===STEPS.length-1}
                style={{padding:'12px 22px', borderRadius:999,
                  background:accent, border:'none',
                  color: s.accent==='amber' ? '#0C0A30' : '#fff',
                  fontFamily:'inherit', fontSize:14, fontWeight:600,
                  cursor: active===STEPS.length-1 ? 'default':'pointer',
                  opacity: active===STEPS.length-1 ? 0.4 : 1,
                  boxShadow:`0 6px 20px -6px ${accent}88`}}>
                Next step &#8594;
              </button>
            </div>
          </div>
          <div style={{background:'#fff', borderRadius:20, padding:32,
            boxShadow:'0 12px 40px -12px rgba(12,10,48,0.10)', border:'1px solid var(--line)'}}>
            <Illus animated/>
          </div>
        </div>

        <style>{`@keyframes fadeStage {
          from { opacity:0; transform: translateY(12px); }
          to   { opacity:1; transform: translateY(0); }
        }`}</style>
      </div>
    </div>
  );
}

Object.assign(window, { VariantA, VariantB, VariantC, VariantD });
