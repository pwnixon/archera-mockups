// How It Works — three variants for Archera's homepage "how insured commitments work" section.
// Dark background. Replaces the literal product-screenshot SVGs from homepage.html with
// abstract/expressionistic visual metaphors built in inline SVG.

/* =========================================================
   Shared: copy + design tokens for the four steps
   ========================================================= */

const STEPS = [
  {
    n: '01',
    title: 'Find on-demand spend you could commit to',
    body: 'Archera analyzes your cloud usage and surfaces the on-demand infrastructure that would save money under a commitment — workloads you\'re running at full rate today.',
    accent: 'sky',
    kicker: 'ANALYZE'
  },
  {
    n: '02',
    title: '30-day and 1-year insured commitments',
    body: 'Pick a Guaranteed Reserved Instance or Savings Plan on a 30-day or 1-year term. Each plan includes insurance — Archera covers any unused capacity so you always realize the savings.',
    accent: 'violet',
    kicker: 'PROTECT'
  },
  {
    n: '03',
    title: 'Commitments purchased inside your account',
    body: 'Archera purchases the commitment directly in your cloud account. Your billing relationship stays with the cloud provider — you keep full control, we handle the optimization.',
    accent: 'amber',
    kicker: 'EXECUTE'
  },
  {
    n: '04',
    title: 'If savings go negative, Archera covers it',
    body: 'When usage drops and a commitment\'s savings would turn negative, Archera\'s coverage picks up the difference. You only ever see positive savings on your bill.',
    accent: 'mint',
    kicker: 'ABSORB'
  }
];

const ACCENT_HEX = { sky:'#6DD8FC', violet:'#7101FF', amber:'#FFD080', mint:'#38D9BF', crimson:'#AD284B' };

/* =========================================================
   HowHead — shared section opener
   ========================================================= */
function HowHead({ align='left' }){
  return (
    <div style={{textAlign:align, maxWidth: align==='center'?820:800,
      margin: align==='center' ? '0 auto' : 0, position:'relative'}}>
      <span style={{fontFamily:'var(--ff-d)', fontWeight:700, fontSize:13, letterSpacing:'0.16em',
        textTransform:'uppercase', color:'var(--sky)'}}>How insured commitments work</span>
      <h2 style={{fontSize:56, letterSpacing:'-0.025em', lineHeight:1.05, marginTop:18,
        color:'#fff', textWrap:'balance'}}>
        Short-term commitments.<br/>Guaranteed savings.
      </h2>
      <p style={{marginTop:22, fontSize:18, lineHeight:1.55, maxWidth:600,
        color:'rgba(255,255,255,0.65)',
        marginLeft: align==='center'?'auto':0, marginRight: align==='center'?'auto':0,
        textWrap:'pretty'}}>
        Archera sits between your cloud usage and your commitments — insuring the downside, so the flexibility of 30-day and 1-year terms actually pays off.
      </p>
    </div>
  );
}

/* =========================================================
   DarkStage — consistent dark background + ambient decor
   ========================================================= */
function DarkStage({ children, padTop=120, padBottom=120 }){
  return (
    <div style={{
      width:'100%', minHeight:'100%',
      background:'linear-gradient(180deg, #0C0A30 0%, #1A1352 100%)',
      color:'#fff',
      padding:`${padTop}px 96px ${padBottom}px`,
      position:'relative', overflow:'hidden'
    }}>
      <div style={{position:'absolute', inset:0, pointerEvents:'none',
        background:`radial-gradient(40% 40% at 90% 0%, rgba(113,1,255,0.32), transparent 70%),
                    radial-gradient(40% 40% at 0% 100%, rgba(109,216,252,0.18), transparent 70%)`}}/>
      <div style={{position:'relative', maxWidth:1280, margin:'0 auto'}}>
        {children}
      </div>
    </div>
  );
}

/* =========================================================
   Abstract illustrations — one per step.
   Style cues from figma SVGs: soft painterly shapes, brand colors,
   low-opacity layered fills, subtle grain. But metaphorical, not literal UI.
   Each is 560x360 in viewBox but scales to container.
   ========================================================= */

// Step 01 — ANALYZE: a grid of cloud infra tiles. Most are dim (on-demand / uncovered);
// a few light up as optimization candidates. A soft scan sweep passes across.
function IllusAnalyze({ animated=false }){
  // 4 rows x 7 cols of small instance tiles
  const cols = 7, rows = 4, tileW = 64, tileH = 44, gapX = 10, gapY = 12;
  const startX = 40, startY = 80;
  // Which tiles are "candidates" (will be highlighted in sky)
  const candidates = new Set(['1-2','2-4','0-5','2-1','3-3','1-6','3-0']);
  // Infra labels cycled across tiles
  const glyphs = ['EC2','RDS','EKS','EC2','S3','EC2','RDS','EKS','EC2','EC2','RDS','EC2','EC2','EKS','LAM','EC2','EC2','EKS','RDS','EC2','EC2','S3','EC2','EKS','EC2','RDS','EC2','EC2'];

  const tiles = [];
  let g = 0;
  for(let r=0; r<rows; r++){
    for(let c=0; c<cols; c++){
      const key = `${r}-${c}`;
      const isCand = candidates.has(key);
      const x = startX + c*(tileW+gapX);
      const y = startY + r*(tileH+gapY);
      tiles.push({ key, x, y, isCand, label: glyphs[g++ % glyphs.length] });
    }
  }

  return (
    <svg viewBox="0 0 560 360" style={{width:'100%', display:'block'}}>
      <defs>
        <linearGradient id="a-sweep" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="#6DD8FC" stopOpacity="0"/>
          <stop offset="50%" stopColor="#6DD8FC" stopOpacity="0.55"/>
          <stop offset="100%" stopColor="#6DD8FC" stopOpacity="0"/>
        </linearGradient>
        <linearGradient id="a-cand" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#6DD8FC" stopOpacity="0.9"/>
          <stop offset="100%" stopColor="#A2B1FB" stopOpacity="0.7"/>
        </linearGradient>
      </defs>

      {/* Label ribbon at top */}
      <g fontFamily="Manrope" fontWeight="700" letterSpacing="2" fontSize="10">
        <rect x="40" y="36" width="112" height="22" rx="11" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.15)"/>
        <circle cx="52" cy="47" r="3.5" fill="#F89090"/>
        <text x="62" y="51" fill="#fff" opacity="0.75">ON-DEMAND</text>

        <rect x="160" y="36" width="128" height="22" rx="11" fill="rgba(109,216,252,0.1)" stroke="#6DD8FC" strokeOpacity="0.5"/>
        <circle cx="172" cy="47" r="3.5" fill="#6DD8FC"/>
        <text x="182" y="51" fill="#6DD8FC">CANDIDATES</text>
      </g>

      {/* Counter, right side */}
      <g fontFamily="Manrope" textAnchor="end">
        <text x="520" y="45" fontSize="11" letterSpacing="2" fontWeight="700" fill="#6DD8FC" opacity="0.8">IDENTIFIED</text>
        <text x="520" y="68" fontSize="22" fontWeight="800" fill="#fff" letterSpacing="-1">7 resources</text>
      </g>

      {/* Tile grid */}
      {tiles.map(t => (
        <g key={t.key}>
          <rect x={t.x} y={t.y} width={tileW} height={tileH} rx="6"
            fill={t.isCand ? 'url(#a-cand)' : 'rgba(255,255,255,0.04)'}
            stroke={t.isCand ? '#6DD8FC' : 'rgba(255,255,255,0.1)'}
            strokeWidth={t.isCand ? 1.5 : 1}/>
          {t.isCand && (
            <rect x={t.x-3} y={t.y-3} width={tileW+6} height={tileH+6} rx="8"
              fill="none" stroke="#6DD8FC" strokeOpacity="0.3" strokeWidth="1"/>
          )}
          {/* dot */}
          <circle cx={t.x+10} cy={t.y+10} r="2.5"
            fill={t.isCand ? '#fff' : 'rgba(255,255,255,0.3)'}/>
          {/* glyph */}
          <text x={t.x + tileW/2} y={t.y + tileH/2 + 4}
            textAnchor="middle" fontFamily="Manrope" fontWeight="700" fontSize="11"
            fill={t.isCand ? '#0C0A30' : 'rgba(255,255,255,0.45)'}
            letterSpacing="1">{t.label}</text>
          {/* bar indicator (usage) */}
          <rect x={t.x+8} y={t.y+tileH-8} width={tileW-16} height="2" rx="1"
            fill={t.isCand ? '#0C0A30' : 'rgba(255,255,255,0.08)'} opacity={t.isCand ? 0.4 : 1}/>
          <rect x={t.x+8} y={t.y+tileH-8} width={(tileW-16)*(t.isCand ? 0.85 : 0.35)} height="2" rx="1"
            fill={t.isCand ? '#0C0A30' : '#F89090'} opacity={t.isCand ? 0.7 : 0.6}/>
        </g>
      ))}

      {/* Scanning sweep */}
      {animated && (
        <rect x="0" y="70" width="120" height="270" fill="url(#a-sweep)" opacity="0.9">
          <animate attributeName="x" from="-140" to="660" dur="3.5s" repeatCount="indefinite"/>
        </rect>
      )}
    </svg>
  );
}

// Step 02 — PROTECT: 30-day GRI, 1-year GSP, 1-year GRI plan cards under a protective dome.
function IllusProtect({ animated=false }){
  return (
    <svg viewBox="0 0 560 360" style={{width:'100%', display:'block'}}>
      <defs>
        <linearGradient id="p-dome" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#7101FF" stopOpacity="0.55"/>
          <stop offset="60%" stopColor="#7101FF" stopOpacity="0.1"/>
          <stop offset="100%" stopColor="#7101FF" stopOpacity="0"/>
        </linearGradient>
        <linearGradient id="p-card1" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#A2B1FB" stopOpacity="0.95"/>
          <stop offset="100%" stopColor="#7101FF" stopOpacity="0.7"/>
        </linearGradient>
        <pattern id="p-dots" x="0" y="0" width="6" height="6" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="0.7" fill="#fff" opacity="0.5"/>
        </pattern>
      </defs>

      <ellipse cx="280" cy="340" rx="260" ry="30" fill="#7101FF" opacity="0.15"/>

      {/* Protective dome */}
      <path d="M 50 280 A 230 220 0 0 1 510 280" fill="url(#p-dome)" stroke="#7101FF" strokeWidth="1.5" opacity="0.9"/>
      <path d="M 50 280 A 230 220 0 0 1 510 280" fill="none" stroke="#fff" strokeWidth="0.8" opacity="0.25" strokeDasharray="3 6"/>

      {/* INSURED badge riding the dome */}
      <g transform="translate(230, 78)">
        <rect width="100" height="28" rx="14" fill="#fff"/>
        <path d="M 16 14 L 14 8 L 20 6 L 26 8 L 24 14 C 24 18, 20 22, 20 22 C 20 22, 16 18, 16 14 Z"
          fill="#7101FF"/>
        <text x="58" y="18" textAnchor="middle" fontFamily="Manrope" fontWeight="800" fontSize="11"
          fill="#0C0A30" letterSpacing="1.5">INSURED</text>
      </g>

      {/* 1-YEAR GRI — left */}
      <g transform="translate(65, 175)">
        <rect width="130" height="120" rx="10" fill="url(#p-card1)"/>
        <rect width="130" height="120" rx="10" fill="url(#p-dots)" opacity="0.25"/>
        <text x="14" y="24" fill="#fff" opacity="0.75" fontFamily="Manrope" fontWeight="700" fontSize="10" letterSpacing="1.5">1-YEAR</text>
        <text x="14" y="70" fill="#fff" fontFamily="Manrope" fontWeight="800" fontSize="26" letterSpacing="-0.5">GRI</text>
        <text x="14" y="92" fill="#fff" opacity="0.75" fontFamily="Lexend" fontWeight="500" fontSize="10">Guaranteed</text>
        <text x="14" y="106" fill="#fff" opacity="0.75" fontFamily="Lexend" fontWeight="500" fontSize="10">Reserved Inst.</text>
      </g>

      {/* 30-DAY GRI — hero */}
      <g transform="translate(215, 155)">
        <rect width="130" height="140" rx="10" fill="#7101FF"/>
        <rect width="130" height="140" rx="10" fill="url(#p-dots)" opacity="0.2"/>
        <text x="14" y="24" fill="#FFD080" fontFamily="Manrope" fontWeight="700" fontSize="10" letterSpacing="1.5">30-DAY</text>
        <text x="14" y="74" fill="#fff" fontFamily="Manrope" fontWeight="800" fontSize="28" letterSpacing="-0.5">GRI</text>
        <text x="14" y="96" fill="#fff" opacity="0.75" fontFamily="Lexend" fontWeight="500" fontSize="10">Guaranteed</text>
        <text x="14" y="110" fill="#fff" opacity="0.75" fontFamily="Lexend" fontWeight="500" fontSize="10">Reserved Inst.</text>
        <circle cx="112" cy="22" r="5" fill="#38D9BF"/>
      </g>

      {/* 1-YEAR GSP — right */}
      <g transform="translate(365, 175)">
        <rect width="130" height="120" rx="10" fill="#15123F" stroke="#A2B1FB" strokeOpacity="0.45" strokeWidth="1.5"/>
        <text x="14" y="24" fill="#6DD8FC" fontFamily="Manrope" fontWeight="700" fontSize="10" letterSpacing="1.5">1-YEAR</text>
        <text x="14" y="70" fill="#fff" fontFamily="Manrope" fontWeight="800" fontSize="26" letterSpacing="-0.5">GSP</text>
        <text x="14" y="92" fill="#A2B1FB" opacity="0.75" fontFamily="Lexend" fontWeight="500" fontSize="10">Guaranteed</text>
        <text x="14" y="106" fill="#A2B1FB" opacity="0.75" fontFamily="Lexend" fontWeight="500" fontSize="10">Savings Plan</text>
      </g>

      <g opacity="0.55" fontFamily="Manrope" fontSize="11" fontWeight="700" letterSpacing="2" fill="#A2B1FB">
        <text x="28" y="330">PREMIUM</text>
        <text x="430" y="330">COVERAGE</text>
      </g>
    </svg>
  );
}

// Step 03 — EXECUTE: an "account" panel (your cloud account) with a clear billing header,
// commitments (unlabeled pills — no explicit term length) settling into it.
function IllusExecute({ animated=false }){
  return (
    <svg viewBox="0 0 560 360" style={{width:'100%', display:'block'}}>
      <defs>
        <linearGradient id="e-bar" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="#FFD080"/>
          <stop offset="100%" stopColor="#F89090"/>
        </linearGradient>
        <linearGradient id="e-panel" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#1A1352" stopOpacity="0.95"/>
          <stop offset="100%" stopColor="#0C0A30" stopOpacity="1"/>
        </linearGradient>
      </defs>

      {/* Background wash */}
      <path d="M 0 300 Q 140 280 280 290 T 560 285 L 560 360 L 0 360 Z" fill="#FFD080" opacity="0.06"/>

      {/* Incoming commitment pills (descending from above) */}
      <g>
        {animated && <animateTransform attributeName="transform" type="translate"
          values="0 -12; 0 0; 0 -12" dur="4s" repeatCount="indefinite"/>}
        <rect x="110" y="38" width="120" height="22" rx="11" fill="url(#e-bar)" opacity="0.95"/>
        <rect x="260" y="14" width="96" height="22" rx="11" fill="url(#e-bar)" opacity="0.75"/>
        <rect x="380" y="52" width="110" height="22" rx="11" fill="url(#e-bar)" opacity="0.88"/>
        {/* small "commitment" glyphs */}
        <text x="170" y="53" textAnchor="middle" fontFamily="Manrope" fontSize="11" fontWeight="800" fill="#0C0A30" letterSpacing="1">COMMITMENT</text>
        <text x="308" y="29" textAnchor="middle" fontFamily="Manrope" fontSize="11" fontWeight="800" fill="#0C0A30" letterSpacing="1">COMMITMENT</text>
        <text x="435" y="67" textAnchor="middle" fontFamily="Manrope" fontSize="11" fontWeight="800" fill="#0C0A30" letterSpacing="1">COMMITMENT</text>
      </g>

      {/* Arrows pointing down into the account */}
      <g opacity="0.45" stroke="#FFD080" strokeWidth="1.4" fill="none" strokeLinecap="round">
        <path d="M 170 80 L 170 130 M 165 124 L 170 134 L 175 124"/>
        <path d="M 308 55 L 308 130 M 303 124 L 308 134 L 313 124"/>
        <path d="M 435 92 L 435 130 M 430 124 L 435 134 L 440 124"/>
      </g>

      {/* Your Cloud Account panel */}
      <g transform="translate(50, 140)">
        <rect width="460" height="200" rx="14" fill="url(#e-panel)"
          stroke="#6DD8FC" strokeOpacity="0.35" strokeWidth="1.5"/>

        {/* Header bar */}
        <rect width="460" height="42" rx="14" fill="rgba(109,216,252,0.08)"/>
        <rect y="28" width="460" height="14" fill="rgba(109,216,252,0.08)"/>
        <line y1="42" x2="460" y2="42" stroke="#6DD8FC" strokeOpacity="0.2"/>
        {/* traffic lights */}
        <circle cx="18" cy="21" r="4" fill="#F89090" opacity="0.7"/>
        <circle cx="32" cy="21" r="4" fill="#FFD080" opacity="0.7"/>
        <circle cx="46" cy="21" r="4" fill="#38D9BF" opacity="0.7"/>
        <text x="72" y="26" fontFamily="Manrope" fontWeight="800" fontSize="13" fill="#fff" letterSpacing="0.5">Your Cloud Account</text>
        {/* billing owner pill on right */}
        <rect x="308" y="10" width="140" height="22" rx="11" fill="rgba(109,216,252,0.14)" stroke="#6DD8FC" strokeOpacity="0.55"/>
        <path d="M 318 21 L 322 25 L 330 17" stroke="#6DD8FC" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        <text x="336" y="25" fontFamily="Manrope" fontWeight="700" fontSize="10" fill="#6DD8FC" letterSpacing="1">BILLING OWNED BY YOU</text>

        {/* Inside: existing commitments stacked */}
        <g transform="translate(28, 68)">
          <text fontFamily="Manrope" fontWeight="700" fontSize="10" fill="rgba(255,255,255,0.45)" letterSpacing="1.5">ACTIVE COMMITMENTS</text>
          <g transform="translate(0, 14)">
            <rect width="404" height="26" rx="6" fill="#7101FF" opacity="0.85"/>
            <rect x="12" y="9" width="8" height="8" rx="2" fill="#fff"/>
            <rect x="30" y="10" width="80" height="6" rx="2" fill="#fff" opacity="0.8"/>
            <rect x="340" y="8" width="54" height="10" rx="5" fill="#fff" opacity="0.25"/>
          </g>
          <g transform="translate(0, 50)">
            <rect width="404" height="26" rx="6" fill="#A2B1FB" opacity="0.55"/>
            <rect x="12" y="9" width="8" height="8" rx="2" fill="#fff"/>
            <rect x="30" y="10" width="64" height="6" rx="2" fill="#fff" opacity="0.7"/>
            <rect x="340" y="8" width="54" height="10" rx="5" fill="#fff" opacity="0.25"/>
          </g>
          <g transform="translate(0, 86)">
            <rect width="404" height="26" rx="6" fill="#6DD8FC" opacity="0.4"/>
            <rect x="12" y="9" width="8" height="8" rx="2" fill="#fff"/>
            <rect x="30" y="10" width="50" height="6" rx="2" fill="#fff" opacity="0.7"/>
            <rect x="340" y="8" width="54" height="10" rx="5" fill="#fff" opacity="0.25"/>
          </g>
        </g>
      </g>

      <g opacity="0.55" fontFamily="Manrope" fontSize="10" fontWeight="700" letterSpacing="2" fill="#FFD080">
        <text x="50" y="352">ARCHERA PURCHASES → YOUR ACCOUNT</text>
      </g>
    </svg>
  );
}

// Step 04 — ABSORB: savings trajectory. Starts positive; as usage dips, savings shrink,
// cross zero (red), and the negative zone is filled by Archera's coverage (mint).
function IllusAbsorb({ animated=false }){
  // Chart area
  const x0 = 40, x1 = 520, y0 = 60, y1 = 300;
  const zeroY = 200;  // zero-savings baseline
  // Savings curve (y value = savings, positive above zeroY, negative below)
  const curve = [
    [40, 130],  // +savings early
    [100, 120],
    [160, 135],
    [220, 160],
    [280, 185],
    [340, 210],  // approaching zero
    [365, 220],  // crosses zero here
    [400, 240],
    [450, 260],
    [510, 255]
  ];
  // index where it crosses zero (y = zeroY = 200)
  const crossIdx = 5; // between idx 4 (y=185) and idx 6 (y=220)

  // Split the curve into positive (above zeroY) and negative (below zeroY) segments.
  // Interpolate exact crossover point.
  const findCross = () => {
    for(let i=0; i<curve.length-1; i++){
      const [xa,ya] = curve[i], [xb,yb] = curve[i+1];
      if((ya - zeroY) * (yb - zeroY) < 0){
        const t = (zeroY - ya) / (yb - ya);
        return [xa + (xb-xa)*t, zeroY];
      }
    }
    return null;
  };
  const cross = findCross();
  const posPts = curve.filter(([x,y])=>y <= zeroY).concat([cross]);
  const negPts = [cross].concat(curve.filter(([x,y])=>y > zeroY));

  const toPath = pts => pts.map((p,i)=>(i===0?'M':'L')+p[0]+' '+p[1]).join(' ');
  // Fill under positive curve down to zero line
  const posFill = `M ${posPts[0][0]} ${zeroY} ${posPts.map(p=>`L ${p[0]} ${p[1]}`).join(' ')} L ${posPts[posPts.length-1][0]} ${zeroY} Z`;
  // Fill ABOVE the negative curve up to zero line (the gap Archera covers)
  const negFill = `M ${negPts[0][0]} ${zeroY} ${negPts.map(p=>`L ${p[0]} ${p[1]}`).join(' ')} L ${negPts[negPts.length-1][0]} ${zeroY} Z`;

  return (
    <svg viewBox="0 0 560 360" style={{width:'100%', display:'block'}}>
      <defs>
        <linearGradient id="ab-pos" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#38D9BF" stopOpacity="0.5"/>
          <stop offset="100%" stopColor="#38D9BF" stopOpacity="0.1"/>
        </linearGradient>
        <linearGradient id="ab-cov" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#38D9BF" stopOpacity="0.15"/>
          <stop offset="100%" stopColor="#38D9BF" stopOpacity="0.55"/>
        </linearGradient>
        <pattern id="ab-cov-stripe" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="4" height="8" fill="#38D9BF" opacity="0.35"/>
        </pattern>
      </defs>

      {/* Axis labels */}
      <text x="24" y="68" fontFamily="Manrope" fontSize="10" fontWeight="700" fill="rgba(255,255,255,0.5)" letterSpacing="1.5">SAVINGS</text>

      {/* + / 0 / - marker at left */}
      <g fontFamily="Manrope" fontSize="11" fontWeight="700" letterSpacing="1" textAnchor="end">
        <text x="34" y="100" fill="#38D9BF" opacity="0.85">+</text>
        <text x="34" y="205" fill="rgba(255,255,255,0.5)">0</text>
        <text x="34" y="290" fill="#F89090" opacity="0.85">−</text>
      </g>

      {/* Gridlines */}
      {[100,150,250,290].map((y,i)=>(
        <line key={i} x1={x0} y1={y} x2={x1} y2={y}
          stroke="#fff" strokeOpacity="0.05" strokeDasharray="2 5"/>
      ))}

      {/* Zero line */}
      <line x1={x0} y1={zeroY} x2={x1} y2={zeroY}
        stroke="#fff" strokeOpacity="0.35" strokeWidth="1.2" strokeDasharray="6 4"/>

      {/* Positive savings area */}
      <path d={posFill} fill="url(#ab-pos)"/>
      {/* Archera coverage area (negative zone filled ABOVE the line, up to zero) */}
      <path d={negFill} fill="url(#ab-cov)"/>
      <path d={negFill} fill="url(#ab-cov-stripe)"/>

      {/* Savings line */}
      <path d={toPath(curve)} fill="none" stroke="#38D9BF" strokeWidth="2.5"
        strokeLinecap="round" strokeLinejoin="round"/>

      {/* Crossover marker */}
      {cross && (
        <g>
          <circle cx={cross[0]} cy={cross[1]} r="8" fill="#0C0A30" stroke="#F89090" strokeWidth="2"/>
          <circle cx={cross[0]} cy={cross[1]} r="3" fill="#F89090"/>
          <line x1={cross[0]} y1={cross[1]-10} x2={cross[0]} y2={cross[1]-40}
            stroke="#F89090" strokeWidth="1" strokeDasharray="2 3" opacity="0.7"/>
          <rect x={cross[0]-72} y={cross[1]-68} width="144" height="26" rx="13"
            fill="#F89090" opacity="0.95"/>
          <text x={cross[0]} y={cross[1]-50} textAnchor="middle"
            fontFamily="Manrope" fontWeight="800" fontSize="11" fill="#0C0A30" letterSpacing="1">SAVINGS GO NEGATIVE</text>
        </g>
      )}

      {/* Labels: top = your savings, bottom = archera coverage */}
      <g fontFamily="Manrope">
        <text x={140} y={115} fill="#38D9BF" fontWeight="700" fontSize="12" opacity="0.9">
          Your savings
        </text>
        <g transform="translate(395, 258)">
          <rect x="-10" y="-15" width="160" height="28" rx="14" fill="#38D9BF"/>
          <path d="M 2 -2 L -2 -2 L 0 -6 L 2 -2 M -2 -2 C -2 2, 0 4, 0 4 C 0 4, 2 2, 2 -2"
            fill="#0C0A30"/>
          <text x="72" y="5" textAnchor="middle" fontWeight="800" fontSize="12" fill="#0C0A30" letterSpacing="0.5">ARCHERA COVERAGE</text>
        </g>
      </g>

      {/* Time axis */}
      <g fontFamily="Manrope" fontSize="10" fill="#fff" opacity="0.38" letterSpacing="1">
        <text x={x0} y="325">Month 1</text>
        <text x="270" y="325" textAnchor="middle">Usage drops</text>
        <text x="510" y="325" textAnchor="end">End of term</text>
      </g>
    </svg>
  );
}

const ILLUS = [IllusAnalyze, IllusProtect, IllusExecute, IllusAbsorb];

Object.assign(window, { HowHead, DarkStage, STEPS, ACCENT_HEX, ILLUS,
  IllusAnalyze, IllusProtect, IllusExecute, IllusAbsorb });
