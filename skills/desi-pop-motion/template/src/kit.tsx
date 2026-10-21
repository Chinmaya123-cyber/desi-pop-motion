import React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {clamp, ease, pop, rand} from './anim';
import {BEAT, C, F, FPS, H, W} from './theme';

/* ------------------------------------------------------------------ helpers */

/** 0..1 pulse that spikes on every beat and decays (relative to scene-local frame + scene start sec). */
export const beatPulse = (absFrame: number, k = 7, beat = BEAT) => {
  const t = absFrame / FPS;
  const since = t - Math.floor(t / beat + 1e-6) * beat;
  return Math.exp(-since * k);
};

/** Index of the current beat. */
export const beatIdx = (absFrame: number, beat = BEAT) => Math.floor(absFrame / FPS / beat + 1e-6);

/** Stop-motion "boil": a value that changes every `step` frames. */
export const boil = (f: number, seed: number, amp: number, step = 4) =>
  (rand(Math.floor(f / step) * 13.7 + seed) - 0.5) * 2 * amp;

/** Extruded 3D block text shadow. */
export const extrude = (color: string, depth = 10, dx = 1, dy = 1) =>
  Array.from({length: depth}, (_, i) => `${(i + 1) * dx}px ${(i + 1) * dy}px 0 ${color}`).join(',');

export const sticker = (px = 6, color = '#fff', shadow = 'rgba(20,10,31,.45)') =>
  [
    `drop-shadow(${px}px 0 0 ${color})`,
    `drop-shadow(-${px}px 0 0 ${color})`,
    `drop-shadow(0 ${px}px 0 ${color})`,
    `drop-shadow(0 -${px}px 0 ${color})`,
    `drop-shadow(10px 14px 0 ${shadow})`,
  ].join(' ');

/* ------------------------------------------------------------------ assets */

export const EMO: Record<string, string> = {
  beer: '1f37a', cheers: '1f37b', whisky: '1f943', champagne: '1f37e', cig: '1f6ac', leaf: '1f343', herb: '1f33f',
  cake: '1f382', disco: '1faa9', speaker: '1f50a', tada: '1f389', confetti: '1f38a', party: '1f973', cool: '1f60e',
  fire: '1f525', skull: '1f480', dancer: '1f483', mandance: '1f57a', balloon: '1f388', gift: '1f381', pizza: '1f355',
  star: '2b50', sparkles: '2728', boom: '1f4a5', right: '1f449', left: '1f448', love: '1f48c', pin: '1f4cd',
  alarm: '23f0', cal: '1f4c5', house: '1f3e0', notes: '1f3b6', blossom: '1f33c', hibiscus: '1f33a', crown: '1f451',
  peek: '1fae3', sob: '1f62d', clown: '1f921', siren: '1f6a8', rickshaw: '1f6fa', money: '1f4b8', popcorn: '1f37f',
  clink: '1f942', nazar: '1f9ff', diya: '1fa94', cocktail: '1f379', zany: '1f92a', hundred: '1f4af', cross: '274c',
  check: '2705', mic: '1f3a4', chicken: '1f357', chili: '1f336', shush: '1f92b', eyes: '1f440', pray: '1f64f',
  kiss: '1f48b', headphones: '1f3a7', smirk: '1f60f', rofl: '1f923', hot: '1f975', smoke: '1f4a8', firecracker: '1f9e8',
  couch: '1f6cb', shirt: '1f455', bed: '1f6cf', moon: '1f319', sun: '2600', biryani: '1f35b', guitar: '1f3b8',
  camera: '1f4f8', ring: '1f48d', bell: '1f514', sneaker: '1f45f', samosa: '1f95f',
};

export const emo = (k: string) => staticFile(`stickers/${EMO[k] ?? k}.svg`);

/* ------------------------------------------------------------------ backgrounds */

export const Solid: React.FC<{color: string}> = ({color}) => <AbsoluteFill style={{background: color}} />;

export const Burst: React.FC<{a: string; b: string; speed?: number; rays?: number; cx?: string; cy?: string; offset?: number}> = ({
  a, b, speed = 0.6, rays = 18, cx = '50%', cy = '45%', offset = 0,
}) => {
  const f = useCurrentFrame();
  const step = 360 / rays / 2;
  return (
    <AbsoluteFill
      style={{
        background: `repeating-conic-gradient(from ${offset + f * speed}deg at ${cx} ${cy}, ${a} 0deg ${step}deg, ${b} ${step}deg ${step * 2}deg)`,
      }}
    />
  );
};

export const Halftone: React.FC<{color: string; size?: number; dot?: number; opacity?: number; drift?: number}> = ({
  color, size = 34, dot = 22, opacity = 0.35, drift = 0.4,
}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        backgroundImage: `radial-gradient(circle, ${color} ${dot}%, transparent ${dot + 2}%)`,
        backgroundSize: `${size}px ${size}px`,
        backgroundPosition: `${f * drift}px ${f * drift}px`,
        opacity,
      }}
    />
  );
};

export const Checker: React.FC<{a: string; b: string; size?: number; rot?: number; drift?: number}> = ({a, b, size = 120, rot = 0, drift = 1}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <div
        style={{
          position: 'absolute', left: -800, top: -800, width: W + 1600, height: H + 1600,
          transform: `rotate(${rot}deg)`,
          background: `conic-gradient(${a} 25%, ${b} 0 50%, ${a} 0 75%, ${b} 0)`,
          backgroundSize: `${size}px ${size}px`,
          backgroundPosition: `${f * drift}px 0px`,
        }}
      />
    </AbsoluteFill>
  );
};

export const Stripes: React.FC<{a: string; b: string; w?: number; angle?: number; drift?: number}> = ({a, b, w = 70, angle = 45, drift = 2}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        background: `repeating-linear-gradient(${angle}deg, ${a} 0 ${w}px, ${b} ${w}px ${w * 2}px)`,
        backgroundPosition: `${f * drift}px 0`,
        backgroundSize: '200% 200%',
      }}
    />
  );
};

/** Film grain + paper feel, stepping at 15fps. */
export const Grain: React.FC<{opacity?: number}> = ({opacity = 0.13}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{mixBlendMode: 'overlay', opacity, pointerEvents: 'none'}}>
      <Img src={staticFile(`img/grain${Math.floor(f / 2) % 4}.png`)} style={{width: '100%', height: '100%'}} />
    </AbsoluteFill>
  );
};

/** Triangle flag bunting (jhandi) hanging along the top. */
export const Bunting: React.FC<{y?: number; sag?: number; colors?: string[]; seed?: number; size?: number}> = ({
  y = 0, sag = 90, colors = [C.pink, C.yellow, C.blue, C.lime, C.orange, C.purple, C.cyan], seed = 0, size = 74,
}) => {
  const f = useCurrentFrame();
  const n = Math.ceil(W / (size * 0.95)) + 1;
  const pts = Array.from({length: n}, (_, i) => {
    const x = (i / (n - 1)) * (W + 40) - 20;
    const u = x / W;
    const yy = y + sag * 4 * u * (1 - u);
    return {x, y: yy};
  });
  return (
    <svg width={W} height={y + sag + size + 40} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
      <path d={`M ${pts.map((p) => `${p.x},${p.y}`).join(' L ')}`} stroke={C.ink} strokeWidth={4} fill="none" />
      {pts.slice(0, -1).map((p, i) => {
        const q = pts[i + 1];
        const sw = Math.sin(f / 7 + i * 1.3 + seed) * 6;
        const mx = (p.x + q.x) / 2 + sw;
        const my = (p.y + q.y) / 2 + size;
        return (
          <polygon
            key={i}
            points={`${p.x + 3},${p.y} ${q.x - 3},${q.y} ${mx},${my}`}
            fill={colors[(i + seed) % colors.length]}
            stroke={C.ink}
            strokeWidth={4}
            strokeLinejoin="round"
          />
        );
      })}
    </svg>
  );
};

/** Hanging marigold (genda phool) strings. */
export const Marigolds: React.FC<{xs: number[]; len?: number; r?: number; top?: number}> = ({xs, len = 9, r = 26, top = -10}) => {
  const f = useCurrentFrame();
  return (
    <svg width={W} height={H} style={{position: 'absolute', left: 0, top: 0}}>
      {xs.map((x0, j) => {
        const sw = Math.sin(f / 18 + j * 1.7) * 0.06;
        return (
          <g key={j} transform={`rotate(${sw * 57} ${x0} ${top})`}>
            <line x1={x0} y1={top} x2={x0} y2={top + len * r * 1.7} stroke="#2d6b1f" strokeWidth={3} />
            {Array.from({length: len}, (_, i) => {
              const cy = top + r + i * r * 1.75;
              const col = i % 3 === 2 ? '#FF4D00' : '#FF9800';
              return (
                <g key={i}>
                  <circle cx={x0} cy={cy} r={r} fill={col} stroke="#C43C00" strokeWidth={9} strokeDasharray="5 6" />
                  <circle cx={x0} cy={cy} r={r * 0.55} fill={i % 3 === 2 ? '#FF7A00' : '#FFC23D'} stroke="#E55B00" strokeWidth={5} strokeDasharray="3 4" />
                  {i % 4 === 3 && <ellipse cx={x0 + r * 0.9} cy={cy + r * 0.9} rx={r * 0.5} ry={r * 0.22} fill="#3FA535" transform={`rotate(35 ${x0 + r * 0.9} ${cy + r * 0.9})`} />}
                </g>
              );
            })}
          </g>
        );
      })}
    </svg>
  );
};

/** Confetti burst from a point, starting at local frame `at`. */
export const Confetti: React.FC<{at: number; x?: number; y?: number; n?: number; seed?: number; spread?: number; power?: number}> = ({
  at, x = W / 2, y = H * 0.45, n = 70, seed = 1, spread = 1, power = 1,
}) => {
  const f = useCurrentFrame();
  const t = (f - at) / FPS;
  if (t < 0 || t > 3.2) return null;
  const cols = [C.pink, C.yellow, C.blue, C.lime, C.orange, C.purple, C.cyan, C.white];
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      {Array.from({length: n}, (_, i) => {
        const a = rand(i * 3.1 + seed) * Math.PI * 2;
        const v = (700 + rand(i * 7.7 + seed) * 1500) * power;
        const vx = Math.cos(a) * v * spread;
        const vy = Math.sin(a) * v - 900 * power;
        const drag = 1 - Math.exp(-t * 2.2);
        const px = x + (vx / 2.2) * drag;
        const py = y + (vy / 2.2) * drag + 900 * t * t * 0.5;
        const rot = t * 720 * (rand(i) - 0.5) * 2;
        const flip = Math.abs(Math.cos(t * 9 + i));
        const w = 18 + rand(i * 5.3) * 18;
        const isCircle = i % 4 === 0;
        return (
          <div
            key={i}
            style={{
              position: 'absolute', left: px, top: py, width: w, height: isCircle ? w : w * 0.5,
              borderRadius: isCircle ? '50%' : 3, background: cols[i % cols.length],
              transform: `rotate(${rot}deg) scaleY(${isCircle ? 1 : flip})`, border: `2px solid ${C.ink}`,
              opacity: interpolate(t, [2.4, 3.2], [1, 0], clamp),
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/** Full-frame flash on hits. */
export const Flash: React.FC<{at: number; color?: string; dur?: number}> = ({at, color = '#fff', dur = 4}) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [at, at + dur], [1, 0], clamp);
  if (f < at || o <= 0) return null;
  return <AbsoluteFill style={{background: color, opacity: o}} />;
};

/* ------------------------------------------------------------------ elements */

type Pos = {x: number; y: number};

/** An emoji sticker with white die-cut border that pops in and boils. */
export const Sticker: React.FC<{
  k: string; at: number; x: number; y: number; size?: number; rot?: number; seed?: number; spin?: number; border?: number; out?: number;
}> = ({k, at, x, y, size = 160, rot = 0, seed = 1, spin = 0, border = 6, out}) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const p = pop(f, at, {damping: 9, stiffness: 220});
  const o = out !== undefined ? interpolate(f, [out, out + 6], [1, 0], clamp) : 1;
  const so = out !== undefined ? interpolate(f, [out, out + 6], [1, 0.3], clamp) : 1;
  const r = rot + boil(f, seed, 5) + (f - at) * spin;
  return (
    <Img
      src={emo(k)}
      style={{
        position: 'absolute', left: x - size / 2, top: y - size / 2, width: size, height: size,
        transform: `scale(${p * so}) rotate(${r}deg)`, filter: sticker(border), opacity: o,
      }}
    />
  );
};

/** Character / photo cutout with die-cut border. */
export const Cutout: React.FC<{
  src: string; at: number; x: number; y: number; h: number; from?: 'bottom' | 'left' | 'right' | 'pop' | 'top';
  rot?: number; flip?: boolean; seed?: number; border?: number; bounce?: number; absF?: number; out?: number; anchor?: 'bottom' | 'center'; beat?: number;
  style?: React.CSSProperties;
}> = ({src, at, x, y, h, from = 'pop', rot = 0, flip = false, seed = 3, border = 8, bounce = 0, absF = 0, out, anchor = 'bottom', style, beat = BEAT}) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const p = pop(f, at, {damping: 11, stiffness: 170});
  let tx = 0, ty = 0, sc = 1;
  if (from === 'bottom') ty = (1 - p) * 900;
  if (from === 'top') ty = -(1 - p) * 1400;
  if (from === 'left') tx = -(1 - p) * 1100;
  if (from === 'right') tx = (1 - p) * 1100;
  if (from === 'pop') sc = p;
  if (out !== undefined && f >= out) {
    const q = ease(f, out, 8);
    ty += q * 1400;
  }
  const b = bounce ? beatPulse(absF + f, 9, beat) * bounce : 0;
  const r = rot + boil(f, seed, 1.6);
  return (
    <div
      style={{
        position: 'absolute', left: x, top: y, height: h,
        transform: `translate(-50%, ${anchor === 'bottom' ? '-100%' : '-50%'}) translate(${tx}px, ${ty}px) rotate(${r}deg) scale(${sc * (1 + b * 0.06)}, ${sc * (1 - b * 0.03 + b * 0.09)})`,
        transformOrigin: '50% 100%',
        ...style,
      }}
    >
      <Img src={staticFile(src)} style={{height: h, transform: flip ? 'scaleX(-1)' : undefined, filter: sticker(border)}} />
    </div>
  );
};

/** Big slam text with stroke + extrusion. */
export const Slam: React.FC<{
  at: number; children: React.ReactNode; x?: number; y: number; size: number; color?: string; stroke?: string; shadow?: string;
  font?: string; rot?: number; depth?: number; strokeW?: number; mode?: 'slam' | 'pop' | 'up' | 'left' | 'right'; out?: number; letter?: number;
  width?: number; seed?: number; style?: React.CSSProperties; wobble?: number;
}> = ({
  at, children, x = W / 2, y, size, color = C.yellow, stroke = C.ink, shadow = C.ink, font = F.shrikhand, rot = 0, depth = 12, strokeW,
  mode = 'slam', out, letter = 0, width = W - 80, seed = 2, style, wobble = 1.2,
}) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const p = pop(f, at, {damping: 10, stiffness: 230});
  let sc = 1, tx = 0, ty = 0, o = 1;
  if (mode === 'slam') { sc = interpolate(p, [0, 1], [2.6, 1]); o = Math.min(1, (f - at + 1) / 2); }
  if (mode === 'pop') sc = p;
  if (mode === 'up') { ty = (1 - p) * 300; o = Math.min(1, p * 2); }
  if (mode === 'left') tx = -(1 - p) * 1200;
  if (mode === 'right') tx = (1 - p) * 1200;
  if (out !== undefined && f >= out) { const q = ease(f, out, 6); sc *= 1 - q; }
  const sw = strokeW ?? Math.max(6, size * 0.075);
  return (
    <div
      style={{
        position: 'absolute', left: x - width / 2, top: y, width, textAlign: 'center',
        fontFamily: font, fontSize: size, lineHeight: 0.98, color, letterSpacing: letter,
        WebkitTextStroke: `${sw}px ${stroke}`, paintOrder: 'stroke fill',
        textShadow: depth ? extrude(shadow, depth, 1, 1) : undefined,
        transform: `translate(${tx}px, ${ty}px) translateY(-50%) rotate(${rot + boil(f, seed, wobble)}deg) scale(${sc})`,
        opacity: o, whiteSpace: 'pre-line',
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** A label strip / tape with text. */
export const Tape: React.FC<{
  at: number; x: number; y: number; children: React.ReactNode; bg?: string; color?: string; size?: number; rot?: number;
  font?: string; pad?: string; from?: 'left' | 'right' | 'pop'; seed?: number; anchor?: 'left' | 'center'; border?: number; out?: number;
}> = ({at, x, y, children, bg = C.yellow, color = C.ink, size = 64, rot = -2, font = F.anton, pad = '10px 28px', from = 'pop', seed = 5, anchor = 'center', border = 6, out}) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const p = pop(f, at, {damping: 12, stiffness: 240});
  const tx = from === 'left' ? -(1 - p) * 1200 : from === 'right' ? (1 - p) * 1200 : 0;
  let sc = from === 'pop' ? p : 1;
  if (out !== undefined && f >= out) sc *= 1 - ease(f, out, 6);
  return (
    <div
      style={{
        position: 'absolute', left: x, top: y,
        transform: `translate(${anchor === 'center' ? '-50%' : '0'}, -50%) translate(${tx}px,0) rotate(${rot + boil(f, seed, 1)}deg) scale(${sc})`,
        background: bg, color, fontFamily: font, fontSize: size, lineHeight: 1.05, padding: pad,
        border: `${border}px solid ${C.ink}`, boxShadow: `10px 10px 0 ${C.ink}`, whiteSpace: 'nowrap',
      }}
    >
      {children}
    </div>
  );
};

/** Inline emoji image for use within text. */
export const E: React.FC<{k: string; size?: number; style?: React.CSSProperties}> = ({k, size = 1, style}) => (
  <Img src={emo(k)} style={{height: `${size}em`, width: `${size}em`, verticalAlign: '-0.15em', margin: '0 0.08em', ...style}} />
);

/** Camera shake wrapper. Hits = local frames where a hit happens. */
export const Shake: React.FC<{hits: number[]; amp?: number; children: React.ReactNode}> = ({hits, amp = 22, children}) => {
  const f = useCurrentFrame();
  let dx = 0, dy = 0, r = 0;
  for (const h of hits) {
    const t = f - h;
    if (t >= 0 && t < 12) {
      const e = Math.exp(-t / 3.5) * amp;
      dx += Math.sin(t * 2.7 + h) * e;
      dy += Math.cos(t * 3.3 + h) * e;
      r += Math.sin(t * 2.1) * e * 0.04;
    }
  }
  return <AbsoluteFill style={{transform: `translate(${dx}px, ${dy}px) rotate(${r}deg)`}}>{children}</AbsoluteFill>;
};

/** Zoom punch on beats. */
export const BeatZoom: React.FC<{absStart: number; amt?: number; beat?: number; children: React.ReactNode}> = ({absStart, amt = 0.025, beat = BEAT, children}) => {
  const f = useCurrentFrame();
  const z = 1 + beatPulse(absStart + f, 8, beat) * amt;
  return <AbsoluteFill style={{transform: `scale(${z})`}}>{children}</AbsoluteFill>;
};

export type {Pos};
