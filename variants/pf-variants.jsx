// Problem / Fix — variants for the section formerly called "the commitment trap".
// The key change from v1: charts are built in React (not the static PNGs) so the
// "Without Archera" and "With Archera" headers match exactly, and nothing gets
// cut off at the canvas edge.

/* =============== Shared bits =============== */

function SectionHead({ kicker='The commitment trap', kickerTone='violet',
  title=<>Commitments save money —<br/>until usage changes.</>,
  body=`You stop saving, but you keep paying. With Archera, that risk doesn't exist. Introducing insured commitments: cloud commitments without underutilization risk.`,
  align='left', titleSize=52, dark=false, maxWidth=860 }){
  const ta = align==='center' ? 'center' : 'left';
  const mx = align==='center' ? 'auto' : '0';
  const kickColor = kickerTone==='sky' ? 'var(--sky)'
                  : kickerTone==='amber' ? 'var(--amber)'
                  : kickerTone==='crimson' ? 'var(--crimson)'
                  : dark ? 'var(--sky)' : 'var(--violet)';
  return (
    <div style={{textAlign:ta, maxWidth, marginLeft:mx, marginRight:mx}}>
      <span style={{
        fontFamily:'var(--ff-d)', fontWeight:700, fontSize:13, letterSpacing:'0.16em',
        textTransform:'uppercase', color: kickColor, display:'inline-block'
      }}>
        {kicker}
      </span>
      <h2 style={{
        fontSize: titleSize, letterSpacing:'-0.025em', lineHeight:1.05, marginTop:20,
        color: dark ? '#fff' : 'var(--ink)',
        textWrap:'balance'
      }}>{title}</h2>
      <p style={{
        marginTop:22, fontSize:18, lineHeight:1.55, maxWidth:640,
        marginLeft: align==='center'?'auto':0, marginRight: align==='center'?'auto':0,
        color: dark ? 'rgba(255,255,255,0.72)' : 'var(--slate-3)',
        textWrap:'pretty'
      }}>{body}</p>
    </div>
  );
}

/* =============== Live CoverageChart ===============
   Replaces the static PNGs so we fully control the header and alignment.
   variant:  'without' | 'with'
   Optional props:
     hideHeader, embedded (for Variant C/D where we compose the header elsewhere)
*/
const WORKLOADS = [
  { name:'EC2',        bg:'#FF8A3D', iconBg:'#FFB27A' },
  { name:'RDS',        bg:'#24A148', iconBg:'#5AC483' },
  { name:'OpenSearch', bg:'#7101FF', iconBg:'#A56CFF' },
];

// Legend palette
const PAL = {
  year3:      '#FFC83D',
  year1:      '#6DD8FC',
  ondemand:   '#E8EAEE',
  insured:    '#7101FF',
};

// Utilization data
const WITHOUT_STACKS = [
  // [3y, 1y, on-demand]
  [18, 34, 48], // EC2 — 52% covered
  [12, 28, 60], // RDS — 40% covered
  [10, 15, 75], // OpenSearch — 25% covered
];
const WITH_STACKS = [
  // [3y, 1y, 30d-insured, on-demand]
  [10, 15, 72, 3],
  [13, 12, 70, 5],
  [10, 13, 71, 6],
];
const WITHOUT_COVERED = ['52%', '40%', '25%'];
const WITH_COVERED = ['97%', '95%', '94%'];

// TRAP state — usage has drifted. The committed portion stays the same SIZE
// (you pay for it), but a chunk of it is no longer being utilized — that chunk
// becomes crimson-hatched "UNUSED / WASTED". Meanwhile on-demand grows because
// net usage shifted elsewhere.
//
// Layout (stacked bottom→top):
//   [3y-used, 3y-wasted, 1y-used, 1y-wasted, on-demand]
const TRAP_STACKS = [
  [5, 13, 10, 24, 48],   // EC2 — only 15% of their 52% committed is still utilized
  [3, 9,  7, 21, 60],    // RDS — bad drift
  [2, 8,  4, 11, 75],    // OpenSearch
];
const TRAP_COVERED = ['15%', '10%', '6%'];

function WorkloadIcon({name, size=28}){
  const common = {width:size, height:size, borderRadius:8, display:'inline-grid', placeItems:'center', color:'#fff'};
  if(name==='EC2') return <span style={{...common, background:'#FF8A3D'}}>
    <svg width={size*0.55} height={size*0.55} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round">
      <rect x="5" y="5" width="14" height="14" rx="2"/><path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3"/>
    </svg>
  </span>;
  if(name==='RDS') return <span style={{...common, background:'#24A148'}}>
    <svg width={size*0.55} height={size*0.55} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
      <ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.66 3.58 3 8 3s8-1.34 8-3V5"/><path d="M4 12c0 1.66 3.58 3 8 3s8-1.34 8-3"/>
    </svg>
  </span>;
  return <span style={{...common, background:'#7101FF'}}>
    <svg width={size*0.55} height={size*0.55} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      <circle cx="10" cy="10" r="6"/><path d="M15 15l5 5"/>
    </svg>
  </span>;
}

function ChartHeader({ variant, onDark=false }){
  const isWith = variant==='with';
  const bg = isWith ? 'var(--violet)' : (onDark ? 'rgba(255,255,255,0.06)' : 'var(--paper)');
  const fg = isWith ? '#fff' : (onDark ? '#fff' : 'var(--ink)');
  return (
    <div style={{
      padding:'18px 22px',
      background: bg,
      borderBottom: isWith ? 'none' : (onDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid var(--line)'),
      borderRadius: isWith ? 'var(--radius) var(--radius) 0 0' : 0,
    }}>
      <div style={{
        fontFamily:'var(--ff-d)', fontWeight:700, fontSize:18, letterSpacing:'-0.015em',
        color: fg
      }}>
        {isWith ? 'With Archera' : 'Without Archera'}
      </div>
    </div>
  );
}

function ChartLegend({ variant, onDark, trap }){
  const items = variant==='with'
    ? [
        {c: PAL.year3,   l:'3-year: 57% off'},
        {c: PAL.year1,   l:'1-year: 27% off'},
        {c: PAL.insured, l:'30-day commit: 30% off'},
      ]
    : trap
      ? [
          {c: PAL.year3,    l:'3-year (utilized)'},
          {c: PAL.year1,    l:'1-year (utilized)'},
          {c: '#AD284B',    l:'Committed but unused',      hatched:true},
          {c: onDark ? 'rgba(255,255,255,0.2)' : PAL.ondemand, l:'On-demand (new drift)'},
        ]
      : [
          {c: PAL.year3,    l:'3-year: 57% off'},
          {c: PAL.year1,    l:'1-year: 27% off'},
          {c: onDark ? 'rgba(255,255,255,0.2)' : PAL.ondemand, l:'On-demand: 0% off'},
        ];
  return (
    <div style={{display:'flex', gap:20, flexWrap:'wrap', padding:'14px 22px 0',
      fontFamily:'var(--ff-b)', fontSize:12, color: onDark ? 'rgba(255,255,255,0.7)' : 'var(--slate-4)'}}>
      {items.map((x,i)=>(
        <div key={i} style={{display:'inline-flex', alignItems:'center', gap:8}}>
          <span style={{
            width:12, height:12, borderRadius:'50%',
            background: x.hatched
              ? `repeating-linear-gradient(45deg, ${x.c} 0, ${x.c} 2px, rgba(255,255,255,0.6) 2px, rgba(255,255,255,0.6) 4px)`
              : x.c,
            display:'inline-block'
          }}/>
          {x.l}
        </div>
      ))}
    </div>
  );
}

function CoverageChart({ variant='without', onDark=false, compact=false, embedded=false, trap=false }){
  const useTrap = trap && variant!=='with';
  const stacks = variant==='with' ? WITH_STACKS : (useTrap ? TRAP_STACKS : WITHOUT_STACKS);
  const covered = variant==='with' ? WITH_COVERED : (useTrap ? TRAP_COVERED : WITHOUT_COVERED);
  const chartH = compact ? 200 : 260;
  const accent = variant==='with' ? 'var(--violet)' : (useTrap ? 'var(--crimson)' : (onDark ? '#fff' : 'var(--ink)'));
  const gridColor = onDark ? 'rgba(255,255,255,0.08)' : 'rgba(12,10,48,0.08)';
  const axisColor = onDark ? 'rgba(255,255,255,0.4)' : 'var(--slate-5)';

  const content = (
    <>
      {!embedded && <ChartHeader variant={variant} onDark={onDark}/>}
      <ChartLegend variant={variant} onDark={onDark} trap={useTrap}/>

      {/* Bars */}
      <div style={{padding:'18px 22px 22px'}}>
        <div style={{position:'relative', height:chartH,
          display:'grid', gridTemplateColumns:'38px 1fr 1fr 1fr', gap:14, alignItems:'end'}}>
          {/* Axis */}
          <div style={{position:'relative', height:'100%'}}>
            {[0,25,50,75,100].map(v=>(
              <div key={v} style={{position:'absolute', right:2, bottom:`${v}%`,
                transform:'translateY(50%)', fontSize:11, color: axisColor,
                fontFamily:'var(--ff-d)', fontWeight:500}}>{v}%</div>
            ))}
          </div>
          {WORKLOADS.map((w, wi)=>{
            const stack = stacks[wi];
            return (
              <div key={w.name} style={{position:'relative', height:'100%'}}>
                {/* Gridlines */}
                {[0,25,50,75,100].map(v=>(
                  <div key={v} style={{position:'absolute', left:-14, right:0, bottom:`${v}%`, height:1,
                    borderTop:`1px dashed ${gridColor}`}}/>
                ))}
                {/* Stacked bar */}
                <div style={{position:'absolute', bottom:0, left:'50%', transform:'translateX(-50%)',
                  width:'65%', height:'100%',
                  display:'flex', flexDirection:'column-reverse',
                  borderRadius:'6px 6px 0 0', overflow:'hidden'}}>
                  {variant==='with' ? (
                    <>
                      <Seg height={stack[0]} color={PAL.year3}/>
                      <Seg height={stack[1]} color={PAL.year1}/>
                      <Seg height={stack[2]} color={PAL.insured} glow/>
                      <Seg height={stack[3]} color={onDark ? 'rgba(255,255,255,0.14)' : PAL.ondemand}/>
                    </>
                  ) : useTrap ? (
                    <>
                      {/* 3y-used */}
                      <Seg height={stack[0]} color={PAL.year3}/>
                      {/* 3y-wasted */}
                      <Seg height={stack[1]} color="#AD284B" hatched wasted={wi===0 && stack[1]>=13}/>
                      {/* 1y-used */}
                      <Seg height={stack[2]} color={PAL.year1}/>
                      {/* 1y-wasted */}
                      <Seg height={stack[3]} color="#AD284B" hatched wasted={wi===1 && stack[3]>=18}/>
                      {/* on-demand */}
                      <Seg height={stack[4]} color={onDark ? 'rgba(255,255,255,0.14)' : PAL.ondemand}/>
                    </>
                  ) : (
                    <>
                      <Seg height={stack[0]} color={PAL.year3}/>
                      <Seg height={stack[1]} color={PAL.year1}/>
                      <Seg height={stack[2]} color={onDark ? 'rgba(255,255,255,0.14)' : PAL.ondemand}/>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Workload labels row — sits below bars, aligned to columns */}
        <div style={{display:'grid', gridTemplateColumns:'38px 1fr 1fr 1fr', gap:14, marginTop:18}}>
          <div/>
          {WORKLOADS.map((w, wi)=>(
            <div key={w.name} style={{textAlign:'center'}}>
              <div style={{display:'inline-flex', alignItems:'center', gap:8,
                fontFamily:'var(--ff-d)', fontWeight:600, fontSize:14,
                color: onDark ? '#fff' : 'var(--ink)', letterSpacing:'-0.01em'}}>
                <WorkloadIcon name={w.name}/> {w.name}
              </div>
              <div style={{marginTop:6, fontFamily:'var(--ff-d)', fontWeight:700,
                fontSize:15, color: accent, letterSpacing:'-0.01em'}}>
                {covered[wi]} Covered
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );

  if(embedded) return content;

  return (
    <div style={{
      background: onDark ? 'rgba(255,255,255,0.04)' : '#fff',
      border: onDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid var(--line)',
      borderRadius:'var(--radius)',
      overflow:'hidden',
      boxShadow: onDark ? 'none' : '0 2px 6px rgba(12,10,48,0.04)'
    }}>
      {content}
    </div>
  );
}

function Seg({ height, color, hatched, glow, wasted }){
  return (
    <div style={{
      height: `${height}%`, width:'100%',
      background: hatched
        ? `repeating-linear-gradient(45deg, ${color} 0px, ${color} 4px, rgba(255,255,255,0.55) 4px, rgba(255,255,255,0.55) 8px)`
        : color,
      transition:'height .7s cubic-bezier(.4,0,.2,1), background .4s',
      position:'relative',
      boxShadow: glow && height>5 ? '0 0 20px rgba(113,1,255,0.45), inset 0 0 0 1px rgba(255,255,255,0.12)' : 'none',
    }}>
      {wasted && height>10 && (
        <div style={{
          position:'absolute', inset:0, display:'grid', placeItems:'center',
          fontFamily:'var(--ff-d)', fontSize:9, fontWeight:800, letterSpacing:'0.14em',
          color:'#fff', textTransform:'uppercase', pointerEvents:'none',
          textShadow:'0 1px 2px rgba(0,0,0,0.3)'
        }}>UNUSED</div>
      )}
    </div>
  );
}

/* =============== Compare card (used by A) =============== */
function CompareCard({ variant, title, body }){
  const isWith = variant==='with';
  return (
    <div style={{
      background:'#fff',
      border:'1px solid var(--line)',
      borderRadius:'var(--radius-lg)',
      padding:'28px 28px 28px',
      boxShadow:'0 2px 8px rgba(12,10,48,0.04)',
      display:'flex', flexDirection:'column', gap:22,
    }}>
      <div style={{flex:'0 0 auto'}}>
        <span style={{
          display:'inline-flex', alignItems:'center', padding:'6px 12px', borderRadius:999,
          fontFamily:'var(--ff-d)', fontWeight:600, fontSize:12, letterSpacing:'0.02em',
          background: isWith ? 'var(--violet)' : 'rgba(173,40,75,0.1)',
          color: isWith ? '#fff' : 'var(--crimson)',
          marginBottom:16
        }}>
          {isWith ? 'With Archera' : 'Without Archera'}
        </span>
        <h3 style={{fontSize:24, letterSpacing:'-0.02em', color: isWith ? 'var(--violet)' : 'var(--ink)'}}>{title}</h3>
        <p style={{marginTop:10, color:'var(--slate-3)', fontSize:15, lineHeight:1.55, textWrap:'pretty', maxWidth:440}}>{body}</p>
      </div>
      <div style={{marginTop:'auto'}}>
        <CoverageChart variant={variant} compact/>
      </div>
    </div>
  );
}

/* =====================================================================
   VARIANT A — Side-by-side in cards, no arrow
   ===================================================================== */
function VariantA(){
  return (
    <div style={{width:'100%', minHeight:'100%', background:'var(--paper-warm)', padding:'72px 80px', overflow:'hidden'}}>
      <div style={{maxWidth:1280, margin:'0 auto'}}>
        <SectionHead titleSize={46}/>
        <div style={{
          display:'grid', gridTemplateColumns:'1fr 1fr', gap:28,
          marginTop:48,
          alignItems:'stretch'
        }}>
          <CompareCard variant="without"
            title="You own the downside."
            body="Native RIs, Savings Plans and CUDs lock you in for 1–3 years. When usage shifts, underutilization eats your savings."/>
          <CompareCard variant="with"
            title="We own the downside."
            body="For a monthly premium, we cover what you don't use — through reimbursements or releasing you from the remaining commitment."/>
        </div>
      </div>
    </div>
  );
}

/* =====================================================================
   VARIANT B — Before/After reveal slider (same copy as A)
   ===================================================================== */
function VariantB(){
  const [pct, setPct] = React.useState(50);
  const [dragging, setDragging] = React.useState(false);
  const stageRef = React.useRef(null);

  const setFromClientX = (cx) => {
    const el = stageRef.current; if(!el) return;
    const r = el.getBoundingClientRect();
    const next = Math.max(4, Math.min(96, ((cx - r.left) / r.width) * 100));
    setPct(next);
  };

  const [touched, setTouched] = React.useState(false);
  React.useEffect(()=>{
    if(touched) return;
    let t = 0, raf;
    const tick = () => { t += 0.008; setPct(50 + Math.sin(t)*22); raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return ()=>cancelAnimationFrame(raf);
  }, [touched]);

  React.useEffect(()=>{
    const mv = (e) => { if(dragging){ setFromClientX(e.clientX); } };
    const up = () => setDragging(false);
    window.addEventListener('pointermove', mv);
    window.addEventListener('pointerup', up);
    return ()=>{window.removeEventListener('pointermove', mv); window.removeEventListener('pointerup', up);};
  },[dragging]);

  return (
    <div style={{width:'100%', minHeight:'100%', background:'var(--paper-warm)', padding:'72px 80px', overflow:'hidden'}}>
      <div style={{maxWidth:1280, margin:'0 auto'}}>
        {/* Same head as A */}
        <SectionHead titleSize={46}/>

        {/* Left/right labels above the stage */}
        <div style={{marginTop:44, display:'grid', gridTemplateColumns:'1fr 1fr', gap:48, padding:'0 4px'}}>
          <div>
            <span style={{display:'inline-flex', padding:'6px 12px', borderRadius:999, background:'rgba(173,40,75,0.1)', color:'var(--crimson)', fontFamily:'var(--ff-d)', fontWeight:600, fontSize:12, letterSpacing:'0.02em'}}>Without Archera</span>
            <h3 style={{fontSize:22, letterSpacing:'-0.02em', color:'var(--ink)', marginTop:10}}>You own the downside.</h3>
            <p style={{marginTop:8, color:'var(--slate-3)', fontSize:14.5, lineHeight:1.55, textWrap:'pretty', maxWidth:480}}>
              Native RIs, Savings Plans and CUDs lock you in for 1–3 years. When usage shifts, underutilization eats your savings.
            </p>
          </div>
          <div style={{textAlign:'right'}}>
            <span style={{display:'inline-flex', padding:'6px 12px', borderRadius:999, background:'var(--violet)', color:'#fff', fontFamily:'var(--ff-d)', fontWeight:600, fontSize:12, letterSpacing:'0.02em'}}>With Archera</span>
            <h3 style={{fontSize:22, letterSpacing:'-0.02em', color:'var(--violet)', marginTop:10}}>We own the downside.</h3>
            <p style={{marginTop:8, color:'var(--slate-3)', fontSize:14.5, lineHeight:1.55, textWrap:'pretty', maxWidth:480, marginLeft:'auto'}}>
              For a monthly premium, we cover what you don't use — through reimbursements or releasing you from the remaining commitment.
            </p>
          </div>
        </div>

        {/* Reveal stage */}
        <div ref={stageRef} style={{
          position:'relative', marginTop:20, borderRadius:'var(--radius-lg)',
          overflow:'hidden', userSelect:'none',
          background:'#FFFFFF',
          border:'1px solid var(--line)',
          boxShadow:'0 24px 60px -24px rgba(12,10,48,0.18)',
          cursor: dragging ? 'grabbing' : 'ew-resize',
          touchAction:'none'
        }}
        onPointerDown={(e)=>{setTouched(true); setDragging(true); setFromClientX(e.clientX);}}
        >
          {/* Base layer: Without (full width) */}
          <div style={{padding:'0'}}>
            <CoverageChart variant="without" embedded={false}/>
          </div>

          {/* Top layer: With, clipped from the right */}
          <div style={{
            position:'absolute', inset:0,
            clipPath:`inset(0 ${100-pct}% 0 0)`,
            transition: dragging ? 'none' : 'clip-path .25s ease-out',
          }}>
            <CoverageChart variant="with" embedded={false}/>
          </div>

          {/* Divider line */}
          <div style={{
            position:'absolute', top:0, bottom:0, left:`${pct}%`,
            width:2, background:'var(--violet)',
            transform:'translateX(-1px)',
            transition: dragging ? 'none' : 'left .25s ease-out',
            pointerEvents:'none',
            boxShadow:'0 0 0 1px rgba(113,1,255,0.15)'
          }}/>

          {/* Handle */}
          <button
            onPointerDown={(e)=>{e.stopPropagation(); setTouched(true); setDragging(true);}}
            aria-label="Drag to compare"
            style={{
              position:'absolute', top:'50%', left:`${pct}%`,
              transform:'translate(-50%,-50%)',
              width:52, height:52, borderRadius:'50%',
              background:'#fff', border:'2px solid var(--violet)',
              color:'var(--violet)',
              display:'grid', placeItems:'center',
              cursor: dragging ? 'grabbing' : 'grab',
              boxShadow:'0 8px 24px -4px rgba(113,1,255,0.45)',
              transition: dragging ? 'none' : 'left .25s ease-out, transform .15s',
              padding:0
            }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 6l-4 6 4 6M16 6l4 6-4 6"/>
            </svg>
          </button>
        </div>

        {/* Muted help text below the graphic */}
        <div style={{
          marginTop:18, textAlign:'center',
          fontFamily:'var(--ff-b)', fontSize:13,
          color:'var(--slate-5)',
          display:'flex', alignItems:'center', justifyContent:'center', gap:8
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M8 6l-4 6 4 6M16 6l4 6-4 6"/>
          </svg>
          Drag the handle to compare coverage before and after Archera
        </div>
      </div>
    </div>
  );
}

/* =====================================================================
   VARIANT C — Scrollytelling, light background
   Chart follows the active step position vertically.
   ===================================================================== */
function VariantC(){
  const [step, setStep] = React.useState(0);
  const [chartTop, setChartTop] = React.useState(0);
  const stepRefs = React.useRef([]);
  const scrollRef = React.useRef(null);     // the internal scroll container
  const narrativeRef = React.useRef(null);  // left column (narrative)
  const chartColRef = React.useRef(null);   // chart element (for its height)

  // Scroll happens INSIDE this variant (artboards are overflow:hidden, so we
  // can't use window scroll). We observe the internal scroll container.
  React.useEffect(()=>{
    const update = () => {
      const sc = scrollRef.current;
      const nc = narrativeRef.current;
      const ch = chartColRef.current;
      if(!sc || !nc || !ch) return;

      const viewportMid = sc.getBoundingClientRect().top + sc.clientHeight * 0.42;

      // Determine active step: the one whose center is closest to viewport mid
      let bestIdx = 0, bestDist = Infinity;
      stepRefs.current.forEach((el, i) => {
        if(!el) return;
        const r = el.getBoundingClientRect();
        const center = r.top + r.height/2;
        const dist = Math.abs(center - viewportMid);
        if(dist < bestDist){ bestDist = dist; bestIdx = i; }
      });
      setStep(bestIdx);

      // Chart Y relative to the narrative container
      const stepEl = stepRefs.current[bestIdx];
      if(stepEl){
        const ncr = nc.getBoundingClientRect();
        const sr = stepEl.getBoundingClientRect();
        const centerInContainer = (sr.top - ncr.top) + sr.height/2;
        const chartH = ch.offsetHeight;
        let y = centerInContainer - chartH/2;
        y = Math.max(0, Math.min(nc.offsetHeight - chartH, y));
        setChartTop(y);
      }
    };

    update();
    const sc = scrollRef.current;
    if(!sc) return;
    const onScroll = () => requestAnimationFrame(update);
    sc.addEventListener('scroll', onScroll, {passive:true});
    window.addEventListener('resize', onScroll);
    const rObs = new ResizeObserver(onScroll);
    rObs.observe(sc);
    return ()=>{
      sc.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      rObs.disconnect();
    };
  }, []);

  const steps = [
    {
      kicker:'01 · THE STATUS QUO',
      title:<>Most spend isn't under commitment.</>,
      body:`Teams under-commit because they're afraid of the lock-in. Result: a majority of spend sits at on-demand rates, earning zero discount.`,
      tone:'amber'
    },
    {
      kicker:'02 · THE TRAP',
      title:<>Commit long-term, and usage drifts away.</>,
      body:`The moment you take a 1- or 3-year commitment, you own the risk. Under-use it and the savings disappear — the bill shows up anyway.`,
      tone:'crimson'
    },
    {
      kicker:'03 · THE FIX',
      title:<>We cover the downside. You commit aggressively.</>,
      body:`Archera sits between your workload and your commitments. Over-commit by design; if utilization slips, we pay the difference or release the term.`,
      tone:'violet'
    },
  ];

  // For each step, choose which chart to show
  const chartForStep = (i) => i===2 ? 'with' : 'without';
  const trapForStep = (i) => i===1;

  return (
    <div ref={scrollRef} style={{width:'100%', height:'100%', background:'var(--paper-warm)', padding:'64px 80px 100px', overflow:'auto'}}>
      <div style={{maxWidth:1280, margin:'0 auto'}}>
        <SectionHead
          kicker="The commitment trap — in three scenes"
          title={<span style={{whiteSpace:'nowrap'}}>Cloud commitments save money.<br/>Until they don't.</span>}
          body="Scroll through three scenes that show where the savings disappear — and how Archera puts them back on the table."
          align="center"
          maxWidth={820}
          titleSize={46}
        />

        <div ref={narrativeRef} style={{
          position:'relative',
          display:'grid', gridTemplateColumns:'1fr 1.05fr', gap:72, marginTop:56,
          alignItems:'start'
        }}>
          {/* Left — narrative steps */}
          <div>
            {steps.map((s, i)=>{
              const toneColor = s.tone==='amber' ? 'var(--amber)'
                              : s.tone==='crimson' ? 'var(--crimson)'
                              : 'var(--violet)';
              const toneGlow = s.tone==='amber' ? 'rgba(255,208,128,0.28)'
                             : s.tone==='crimson' ? 'rgba(173,40,75,0.18)'
                             : 'rgba(113,1,255,0.20)';
              const toneTextOnFill = s.tone==='amber' ? 'var(--ink)' : '#fff';
              const active = step===i;
              return (
                <div key={i}
                  ref={el=>stepRefs.current[i]=el}
                  style={{
                    padding:'72px 0 72px 56px',
                    borderLeft: '1px solid var(--line)',
                    position:'relative',
                    transition:'opacity .3s',
                    opacity: active ? 1 : 0.45,
                    minHeight: 320
                  }}>
                  {/* Numbered circle — how-VariantA style, adapted for light theme */}
                  <div style={{
                    position:'absolute', left:-22, top:80,
                    width:44, height:44, borderRadius:'50%',
                    background: active ? toneColor : '#fff',
                    border: `1.5px solid ${active ? toneColor : 'var(--line)'}`,
                    display:'grid', placeItems:'center',
                    boxShadow: active ? `0 0 0 6px ${toneGlow}, 0 8px 20px ${toneColor}44` : '0 1px 4px rgba(12,10,48,0.06)',
                    transition:'all .4s ease'
                  }}>
                    <span style={{
                      fontFamily:'var(--ff-d)', fontWeight:800, fontSize:15,
                      letterSpacing:'-0.01em',
                      color: active ? toneTextOnFill : 'var(--slate-4)',
                      transition:'color .4s'
                    }}>{String(i+1)}</span>
                  </div>
                  <div style={{
                    fontFamily:'var(--ff-d)', fontSize:11, fontWeight:700, letterSpacing:'0.22em',
                    color: active ? toneColor : 'var(--slate-5)',
                    transition:'color .4s'
                  }}>{s.kicker}</div>
                  <h3 style={{fontSize:38, letterSpacing:'-0.025em', lineHeight:1.08, marginTop:14, color:'var(--ink)', textWrap:'balance'}}>
                    {s.title}
                  </h3>
                  <p style={{marginTop:18, color:'var(--slate-3)', fontSize:17, lineHeight:1.55, maxWidth:440, textWrap:'pretty'}}>
                    {s.body}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Right — chart column; chart is absolutely positioned and follows the active step */}
          <div style={{position:'relative'}}>
            <div ref={chartColRef}
              style={{
                position:'absolute', top: chartTop, left:0, right:0,
                transition:'top .5s cubic-bezier(.4,0,.2,1)'
              }}>
              <ScrollytellingChart step={step} variant={chartForStep(step)} trap={trapForStep(step)}/>
            </div>
            {/* spacer to ensure column matches narrative height */}
            <div style={{visibility:'hidden', pointerEvents:'none'}}>
              <ScrollytellingChart step={0} variant="without"/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ScrollytellingChart({ step, variant, trap }){
  const accents = ['var(--amber)', 'var(--crimson)', 'var(--violet)'];
  const headers = ['Coverage today', 'What happens when usage drifts', 'With Archera — insured commitments'];
  const notes = [
    <>Across the average fleet, <b style={{color:'var(--ink)'}}>only ~39% of spend is under commitment.</b> The rest pays on-demand rates.</>,
    <>When utilization slips, <b style={{color:'var(--crimson)'}}>the locked portion still bills.</b> Native RIs don't refund you for what you didn't use.</>,
    <>Insured 30-day commits cover <b style={{color:'var(--ink)'}}>~95% of spend</b> on average — with Archera underwriting the downside.</>,
  ];
  return (
    <div style={{
      background:'#fff', border:'1px solid var(--line)', borderRadius:'var(--radius-lg)',
      padding:0, boxShadow:'0 24px 60px -28px rgba(12,10,48,0.2)', overflow:'hidden'
    }}>
      {/* Custom header (since we need to color it by step) */}
      <div style={{padding:'22px 24px', borderBottom:'1px solid var(--line-2)',
        display:'flex', alignItems:'center', justifyContent:'space-between'}}>
        <div>
          <div style={{fontFamily:'var(--ff-d)', fontSize:11, fontWeight:700, letterSpacing:'0.18em', color:'var(--slate-5)'}}>
            SCENE {String(step+1).padStart(2,'0')} / 03
          </div>
          <div style={{fontFamily:'var(--ff-d)', fontSize:20, fontWeight:700, letterSpacing:'-0.015em', marginTop:4, color: accents[step], transition:'color .4s'}}>
            {headers[step]}
          </div>
        </div>
        <div style={{display:'flex', gap:6}}>
          {[0,1,2].map(i=>(
            <div key={i} style={{
              width: step===i ? 22 : 8, height:8, borderRadius:999,
              background: step===i ? accents[i] : 'var(--line)',
              transition:'all .3s'
            }}/>
          ))}
        </div>
      </div>

      <CoverageChart variant={variant} trap={trap} embedded/>

      <div style={{padding:'16px 24px 22px', display:'flex', gap:12, alignItems:'flex-start',
        borderTop:'1px solid var(--line-2)', background:'var(--paper)'}}>
        <div style={{width:4, alignSelf:'stretch', borderRadius:2, background: accents[step], transition:'background .4s', minHeight:32}}/>
        <div style={{fontSize:13.5, color:'var(--slate-3)', lineHeight:1.5, fontFamily:'var(--ff-b)'}}>
          {notes[step]}
        </div>
      </div>
    </div>
  );
}

/* =====================================================================
   VARIANT D — Compact horizontal (chart on top, beats below)
   Auto-advances every 2.8s, hover on a beat pauses + switches.
   ===================================================================== */
function VariantD(){
  const [step, setStep] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  const TICK = 5600;

  React.useEffect(()=>{
    if(paused) return;
    const t = setTimeout(()=> setStep(s => (s+1) % 3), TICK);
    return ()=>clearTimeout(t);
  }, [step, paused]);

  const accents = ['var(--amber)', 'var(--crimson)', 'var(--violet)'];
  const headers = ['Coverage today', 'When usage drifts', 'With Archera — insured commitments'];

  const steps = [
    {
      kicker:'01 · STATUS QUO',
      title:`Most spend isn't under commitment.`,
      body:`Teams under-commit to avoid lock-in. The majority of spend sits at on-demand rates.`,
    },
    {
      kicker:'02 · THE TRAP',
      title:`Commit long-term, and usage drifts away.`,
      body:`Native RIs, SPs and CUDs don't refund what you didn't use. The bill shows up anyway.`,
    },
    {
      kicker:'03 · THE FIX',
      title:`We cover the downside. You commit aggressively.`,
      body:`Archera reimburses or releases unused commitments, so you can over-commit safely.`,
    },
  ];

  const variant = step===2 ? 'with' : 'without';
  const trap = step===1;

  return (
    <div style={{width:'100%', minHeight:'100%', background:'var(--paper-warm)', padding:'64px 80px', overflow:'hidden'}}>
      <div style={{maxWidth:1280, margin:'0 auto'}}>
        <SectionHead
          kicker="The commitment trap — in three scenes"
          title={<span style={{whiteSpace:'nowrap'}}>Cloud commitments save money.<br/>Until they don't.</span>}
          body="Three scenes of coverage over time. Hover a scene — or just watch."
          align="center"
          maxWidth={820}
          titleSize={46}
        />

        {/* Chart stage */}
        <div style={{
          marginTop:36,
          background:'#fff', border:'1px solid var(--line)', borderRadius:'var(--radius-lg)',
          boxShadow:'0 12px 32px -16px rgba(12,10,48,0.15)', overflow:'hidden'
        }}>
          <div style={{padding:'18px 24px', borderBottom:'1px solid var(--line-2)',
            display:'flex', alignItems:'center', justifyContent:'space-between'}}>
            <div style={{display:'flex', alignItems:'center', gap:14}}>
              <div style={{fontFamily:'var(--ff-d)', fontWeight:700, fontSize:18, letterSpacing:'-0.015em', color: accents[step], transition:'color .4s'}}>
                {headers[step]}
              </div>
            </div>
            <div style={{display:'flex', alignItems:'center', gap:10, fontFamily:'var(--ff-d)', fontSize:11, fontWeight:700, letterSpacing:'0.14em', color:'var(--slate-5)'}}>
              SCENE {String(step+1).padStart(2,'0')} / 03
              <div style={{display:'flex', gap:6}}>
                {[0,1,2].map(i=>(
                  <div key={i} onClick={()=>setStep(i)} style={{
                    width: step===i ? 22 : 8, height:8, borderRadius:999, cursor:'pointer',
                    background: step===i ? accents[i] : 'var(--line)',
                    transition:'all .3s'
                  }}/>
                ))}
              </div>
            </div>
          </div>
          <CoverageChart variant={variant} trap={trap} compact embedded/>
        </div>

        {/* 3-up beat row */}
        <div style={{
          marginTop:28,
          display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:20
        }}>
          {steps.map((s, i)=>{
            const active = step===i;
            return (
              <div key={i}
                onMouseEnter={()=>{setStep(i); setPaused(true);}}
                onMouseLeave={()=>setPaused(false)}
                onClick={()=>setStep(i)}
                style={{
                  padding:'26px 26px 24px',
                  borderRadius:'var(--radius)',
                  background: active ? '#fff' : 'transparent',
                  border: `1px solid ${active ? 'var(--line)' : 'transparent'}`,
                  cursor:'pointer',
                  transition:'all .3s',
                  position:'relative', overflow:'hidden'
                }}>
                {/* Progress bar */}
                <div style={{
                  position:'absolute', top:0, left:0, right:0, height:3,
                  background: active ? 'var(--line-2)' : 'transparent'
                }}>
                  <div style={{
                    height:'100%',
                    background: accents[i],
                    width: active && !paused ? '100%' : (active ? '0%' : '0%'),
                    transition: active && !paused ? `width ${TICK}ms linear` : 'width .2s'
                  }}/>
                </div>
                <div style={{
                  fontFamily:'var(--ff-d)', fontSize:11, fontWeight:700, letterSpacing:'0.18em',
                  color: active ? accents[i] : 'var(--slate-5)', transition:'color .3s'
                }}>{s.kicker}</div>
                <h3 style={{
                  fontSize:22, letterSpacing:'-0.02em', lineHeight:1.15, marginTop:10,
                  color: active ? 'var(--ink)' : 'var(--slate-4)', transition:'color .3s', textWrap:'balance'
                }}>{s.title}</h3>
                <p style={{
                  marginTop:10, color: active ? 'var(--slate-3)' : 'var(--slate-5)',
                  fontSize:14.5, lineHeight:1.55, textWrap:'pretty', transition:'color .3s'
                }}>{s.body}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* =====================================================================
   VARIANT E — Per-step progress bars + auto-advance + pause/resume.
   Mirrors how-VariantC structure: stepper tabs above, two-column
   stage below (copy + controls left, CoverageChart right).
   Light paper-warm theme throughout.
   ===================================================================== */
function VariantE(){
  const [active, setActive] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  const TICK = 8400;

  React.useEffect(()=>{
    if(paused) return;
    const t = setTimeout(()=> setActive(s => (s+1) % 3), TICK);
    return ()=>clearTimeout(t);
  }, [active, paused]);

  const jump = (i) => { setActive(i); setPaused(true); };

  const scenes = [
    {
      n: '01',
      kicker: 'STATUS QUO',
      title: `Most spend isn\u2019t under commitment.`,
      body: `Teams under-commit to avoid lock-in. The majority of spend sits at on-demand rates, earning zero discount.`,
      accent: 'var(--amber)',
      accentText: '#B8860B',
      chartVariant: 'without',
      trap: false,
    },
    {
      n: '02',
      kicker: 'THE TRAP',
      title: `Commit long-term, and usage drifts away.`,
      body: `Native RIs, Savings Plans and CUDs lock you in for 1\u20133 years. When usage shifts, underutilization eats your savings \u2014 but the bill shows up anyway.`,
      accent: 'var(--crimson)',
      accentText: 'var(--crimson)',
      chartVariant: 'without',
      trap: true,
    },
    {
      n: '03',
      kicker: 'THE FIX',
      title: `We cover the downside. You commit aggressively.`,
      body: `Archera reimburses or releases unused commitments, so you can over-commit safely with 30-day insured terms.`,
      accent: 'var(--violet)',
      accentText: 'var(--violet)',
      chartVariant: 'with',
      trap: false,
    },
  ];

  const s = scenes[active];

  return (
    <div style={{width:'100%', background:'var(--paper-warm)', padding:'72px 80px 64px'}}>
      <div style={{maxWidth:1280, margin:'0 auto'}}>
        <SectionHead
          kicker={"The commitment trap \u2014 in three scenes"}
          title={<span>Cloud commitments save money.<br/>Until they don&rsquo;t.</span>}
          body={"Click a scene or just watch \u2014 see where savings disappear, and how Archera puts them back."}
          titleSize={46}
        />

        {/* Stepper tabs with per-step progress bars */}
        <div style={{marginTop:52, display:'grid', gridTemplateColumns:'repeat(3, minmax(0, 1fr))',
          gap:0, columnGap:20, position:'relative'}}>
          {scenes.map((sc, i) => {
            const isActive = i === active;
            const isPast = i < active;
            return (
              <div key={sc.n} style={{display:'flex', flexDirection:'column', gap:18, minWidth:0}}>
                {/* Per-step progress bar */}
                <div style={{height:3, borderRadius:2, background:'var(--line)', overflow:'hidden'}}>
                  <div
                    key={isActive ? `a-${active}-${paused}` : `p-${i}-${isPast}`}
                    style={{
                      height:'100%',
                      background: isActive ? sc.accent : (isPast ? 'rgba(12,10,48,0.22)' : 'transparent'),
                      width: isActive && paused ? '100%' : (!isActive && isPast ? '100%' : '0%'),
                      animation: isActive && !paused ? `fillBarPFE ${TICK}ms linear forwards` : 'none',
                    }}/>
                </div>

                <button onClick={()=>jump(i)}
                  style={{background:'transparent', border:'none', color:'var(--ink)',
                    textAlign:'left', cursor:'pointer', padding:0,
                    display:'flex', gap:14, alignItems:'flex-start', minWidth:0}}>
                  <span style={{
                    width:52, height:52, borderRadius:'50%',
                    display:'grid', placeItems:'center',
                    background: isActive ? sc.accent : (isPast ? 'var(--line-2)' : '#fff'),
                    color: isActive ? (i===0 ? 'var(--ink)' : '#fff') : 'var(--slate-4)',
                    border: isActive ? `2px solid ${sc.accent}` : '2px solid var(--line)',
                    boxShadow: isActive ? `0 4px 16px -4px ${sc.accent}55` : 'none',
                    fontFamily:'var(--ff-d)', fontWeight:800, fontSize:17,
                    transition:'all .3s', flex:'0 0 auto'
                  }}>{sc.n}</span>
                  <span style={{display:'flex', flexDirection:'column', gap:4, minWidth:0, flex:1, paddingTop:4}}>
                    <span style={{fontFamily:'var(--ff-d)', fontSize:10, letterSpacing:'0.2em',
                      fontWeight:700, color: isActive ? sc.accentText : 'var(--slate-5)'}}>{sc.kicker}</span>
                    <span style={{fontFamily:'var(--ff-d)', fontSize:14, fontWeight:600,
                      color: isActive ? 'var(--ink)' : 'var(--slate-4)',
                      textWrap:'balance', lineHeight:1.3, wordBreak:'break-word'}}>{sc.title}</span>
                  </span>
                </button>
              </div>
            );
          })}
        </div>

        {/* Stage: copy left, chart right.
            key is on the LEFT column only so it remounts/bounces on each step.
            The RIGHT column has NO key change — it stays mounted so the chart
            bars can animate via their own CSS transitions (no remount = no flash). */}
        <div style={{
          marginTop:52,
          display:'grid', gridTemplateColumns:'1fr 1.25fr', gap:72, alignItems:'center',
        }}>
          {/* Left: bounces in on each step change */}
          <div key={active} style={{animation:'stageBounceE .5s ease'}}>
            <div style={{fontFamily:'var(--ff-d)', fontSize:72, fontWeight:800,
              color: s.accentText, lineHeight:1, letterSpacing:'-0.04em', opacity:0.85}}>{s.n}</div>
            <h3 style={{fontSize:38, lineHeight:1.1, color:'var(--ink)', marginTop:18,
              textWrap:'balance', maxWidth:440}}>{s.title}</h3>
            <p style={{fontSize:17, lineHeight:1.6, color:'var(--slate-3)', marginTop:20,
              maxWidth:440, textWrap:'pretty'}}>{s.body}</p>

            <div style={{marginTop:36, display:'flex', gap:12, alignItems:'center'}}>
              <button onClick={()=>{ setPaused(p=>!p); }}
                style={{
                  padding:'12px 20px', borderRadius:999,
                  background: paused ? 'var(--ink)' : 'var(--line-2)',
                  border: paused ? 'none' : '1px solid var(--line)',
                  color: paused ? '#fff' : 'var(--ink)',
                  fontFamily:'inherit', fontSize:14, fontWeight:600,
                  cursor:'pointer',
                  display:'inline-flex', alignItems:'center', gap:8
                }}>
                {paused ? (
                  <><svg width="10" height="12" viewBox="0 0 10 12"><path d="M0 0 L10 6 L0 12 Z" fill="currentColor"/></svg> Resume</>
                ) : (
                  <><svg width="10" height="12" viewBox="0 0 10 12"><rect x="0" y="0" width="3" height="12" fill="currentColor"/><rect x="7" y="0" width="3" height="12" fill="currentColor"/></svg> Pause</>
                )}
              </button>
              <div style={{fontFamily:'var(--ff-d)', fontSize:11, fontWeight:700,
                letterSpacing:'0.18em', color:'var(--slate-5)'}}>
                {String(active+1).padStart(2,'0')} / 03
              </div>
            </div>
          </div>

          {/* Right: persistent chart — NO key, NO animation on the container.
              Custom header uses CSS transition so it fades between states.
              Bars animate via the Seg component's own CSS transition property. */}
          <div style={{
            background:'#fff', border:'1px solid var(--line)',
            borderRadius:'var(--radius)', overflow:'hidden',
            boxShadow:'0 2px 6px rgba(12,10,48,0.04)',
          }}>
            {/* Header: background + text fade via CSS transition, not remount */}
            <div style={{
              padding:'18px 22px',
              background: s.chartVariant==='with' ? 'var(--violet)' : 'var(--line-2)',
              borderBottom: s.chartVariant==='with' ? 'none' : '1px solid var(--line)',
              transition:'background .55s ease, border-color .55s ease',
            }}>
              <div style={{
                fontFamily:'var(--ff-d)', fontWeight:700, fontSize:18, letterSpacing:'-0.015em',
                color: s.chartVariant==='with' ? '#fff' : 'var(--ink)',
                transition:'color .55s ease',
              }}>
                {s.chartVariant==='with' ? 'With Archera' : 'Without Archera'}
              </div>
            </div>
            {/* Bars + legend rendered without ChartHeader (embedded=true skips it) */}
            <CoverageChart variant={s.chartVariant} trap={s.trap} embedded/>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes stageBounceE {
          from { opacity:0; transform: translateY(12px); }
          to   { opacity:1; transform: translateY(0); }
        }
        @keyframes fillBarPFE {
          from { width: 0%; }
          to   { width: 100%; }
        }
      `}</style>
    </div>
  );
}

Object.assign(window, { VariantA, VariantB, VariantC, VariantD, VariantE });
