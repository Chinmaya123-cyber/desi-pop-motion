import React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {clamp, ease, pop, rand} from './anim';
import type {InviteProps} from './config';
import {
  beatIdx, beatPulse, boil, Bunting, Burst, BeatZoom, Checker, Confetti, Cutout, E, emo, extrude, Flash, Halftone, Marigolds,
  Shake, Slam, Solid, Sticker, sticker, Stripes, Tape,
} from './kit';
import {C, CYCLE, F, H, s, W} from './theme';

export type SceneProps = {abs: number; p: InviteProps};

const char = (n: string) => `char/${n}.png`;

/* ================================================================== S0 · cold open (0–0.9s) */
export const S0Cold: React.FC<SceneProps> = () => {
  const f = useCurrentFrame();
  const noiseSeed = Math.floor(f / 1);
  return (
    <AbsoluteFill style={{background: C.ink, overflow: 'hidden'}}>
      <svg width={W} height={H} style={{position: 'absolute', opacity: 0.55}}>
        <filter id="tv">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={noiseSeed} />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width={W} height={H} filter="url(#tv)" />
      </svg>
      {Array.from({length: 8}, (_, i) => (
        <div key={i} style={{position: 'absolute', left: 0, width: W, top: rand(i + f * 3) * H, height: 6 + rand(i * 2 + f) * 30, background: CYCLE[(i + f) % CYCLE.length], opacity: 0.5, mixBlendMode: 'screen'}} />
      ))}
      <Tape at={2} x={W / 2} y={820} bg={C.red} color={C.white} size={96} font={F.bungee} rot={-3}>
        <E k="siren" /> BREAKING <E k="siren" />
      </Tape>
      <Tape at={8} x={W / 2} y={1010} bg={C.yellow} size={70} font={F.anton} rot={2}>
        GUEST LIST LEAKED!!
      </Tape>
    </AbsoluteFill>
  );
};

/* ================================================================== S1 · guest list gag (0.9–7.4s) */
const LIST = [
  {t: 0.06, txt: 'MAIN', k: 'crown', bg: C.yellow, fg: C.ink},
  {t: 1.1, txt: 'TU', k: 'right', bg: C.cyan, fg: C.ink},
  {t: 1.9, txt: 'MERA YAAR', k: 'mandance', bg: C.lime, fg: C.ink},
  {t: 2.74, txt: 'TERE FRIENDS', k: 'dancer', bg: C.pink, fg: C.white},
  {t: 3.58, txt: 'TERI GF', k: 'kiss', bg: C.orange, fg: C.white},
  {t: 4.38, txt: 'TERA EX', k: 'skull', bg: C.white, fg: C.red},
  {t: 5.14, txt: 'TERI GF KA EX', k: 'skull', bg: C.red, fg: C.yellow},
];
const BGS: [string, string][] = [
  [C.pink, C.hot], [C.yellow, C.marigold], [C.blue, C.violet], [C.lime, C.green], [C.orange, C.red], [C.purple, C.violet], [C.ink, '#2a1440'], [C.red, '#b30000'],
];

export const S1List: React.FC<SceneProps> = ({abs}) => {
  const f = useCurrentFrame();
  const idx = LIST.reduce((a, l, i) => (f >= s(l.t) ? i : a), 0);
  const [a, b] = BGS[idx % BGS.length];
  const hits = LIST.map((l) => s(l.t));
  const lastHit = s(5.14);
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <Shake hits={[lastHit, s(5.9)]} amp={26}>
        <Burst a={a} b={b} speed={0.5} rays={22} cy="60%" />
        <Halftone color={C.ink} opacity={0.12} />
        {/* characters (behind the list) */}
        <Cutout src={char('point_self')} at={s(0.06)} x={810} y={H + 30} h={1100} from="bottom" out={s(1.1)} />
        <Cutout src={char('point_you')} at={s(1.1)} x={780} y={H + 40} h={1250} from="right" out={s(2.74)} />
        <Cutout src={char('dance')} at={s(2.74)} x={820} y={H + 30} h={1080} from="bottom" bounce={1} absF={abs} out={s(4.38)} />
        <Cutout src={char('shocked')} at={s(4.38)} x={760} y={H + 20} h={interpolate(f, [lastHit, lastHit + 6], [880, 1120], clamp)} from="bottom" seed={9} />
        <Tape at={0} x={60} y={240} anchor="left" bg={C.white} size={88} font={F.bungee} rot={-3} from="left">
          GUEST LIST <E k="eyes" />
        </Tape>
        {LIST.map((l, i) => (
          <Tape key={i} at={hits[i]} x={56 + (i % 2) * 20} y={430 + i * 152} anchor="left" bg={l.bg} color={l.fg} size={100} rot={i % 2 ? 2.5 : -2} from="left" seed={i * 3}>
            {l.txt} <E k={l.k} />{i === 6 && <E k="skull" />}
          </Tape>
        ))}
        <Sticker k="sob" at={s(4.5)} x={980} y={360} size={170} seed={4} />
        <Sticker k="skull" at={s(5.2)} x={150} y={1610} size={190} rot={-14} seed={7} />
        <Sticker k="skull" at={s(5.3)} x={930} y={1050} size={150} rot={18} seed={8} />
        <Slam at={s(5.25)} y={1470} x={330} width={600} size={130} color={C.white} font={F.bungee} depth={8} rot={-8} mode="pop">
          BRUH
        </Slam>
        {/* stamp */}
        <Slam at={s(5.9)} y={1000} size={150} color={C.red} stroke={C.white} shadow={C.ink} depth={10} rot={-13} font={F.shrikhand}>
          SAB INVITED!
        </Slam>
        <Sticker k="check" at={s(6.05)} x={900} y={880} size={170} rot={10} seed={2} />
      </Shake>
    </AbsoluteFill>
  );
};

/* ================================================================== S2 · reveal (7.4–10.8s) */
export const S2Reveal: React.FC<SceneProps> = ({abs, p}) => {
  const f = useCurrentFrame();
  const flip = f >= s(1.9);
  const name = p.host.toUpperCase();
  const size = Math.min(210, 1240 / Math.max(4, name.length));
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <Shake hits={[s(0.5), s(1.9)]} amp={24}>
        {flip ? <Burst a={C.pink} b={C.yellow} speed={1.2} rays={26} /> : <Burst a={C.blue} b={C.cyan} speed={0.8} rays={20} />}
        <Halftone color={flip ? C.hot : C.violet} opacity={0.18} />
        <Slam at={0} y={210} size={84} font={F.marker} color={C.white} depth={0} strokeW={10} rot={-4} mode="up">
          kyunki...
        </Slam>
        <Sticker k="eyes" at={s(0.15)} x={830} y={200} size={120} seed={3} />
        {/* real photo cutout, the OG */}
        <Cutout src={p.hostPhoto} at={s(0.5)} x={540} y={1060} h={880} anchor="center" from="pop" border={12} seed={11} />
        <Sticker k="crown" at={s(1.0)} x={560} y={600} size={250} rot={-8} seed={5} />
        <Sticker k="nazar" at={s(1.15)} x={180} y={1250} size={140} seed={6} />
        <Sticker k="sparkles" at={s(1.2)} x={900} y={760} size={150} seed={9} />
        <Tape at={s(1.0)} x={820} y={1430} bg={C.white} size={52} font={F.marker} rot={6}>
          (official photo <E k="smirk" />)
        </Tape>
        <Slam at={s(0.5)} y={470} size={size} color={C.yellow} shadow={C.hot} depth={14} rot={-3}>
          {name}
        </Slam>
        <Slam at={s(1.9)} y={1610} size={124} color={C.white} shadow={C.hot} depth={12} rot={3} font={F.shrikhand}>
          {'KA BIRTHDAY HAI!!!'}
        </Slam>
        <Confetti at={s(1.9)} y={1200} n={80} seed={4} />
      </Shake>
      <Flash at={s(1.9)} color={C.yellow} dur={3} />
    </AbsoluteFill>
  );
};

/* ================================================================== S3 · loading + countdown (10.8–14.4s) */
const STATUS = [
  {t: 0.3, k: 'speaker', txt: 'Charging speakers', pct: '37%'},
  {t: 0.95, k: 'shirt', txt: 'Ironing kapde', pct: '68%'},
  {t: 1.6, k: '1f9f9', txt: 'Cleaning the house', pct: '99%'},
];
export const S3Loading: React.FC<SceneProps> = ({abs}) => {
  const f = useCurrentFrame();
  const prog = interpolate(f, [s(0.15), s(1.9)], [0, 99], {...clamp, easing: (t) => 1 - (1 - t) ** 2});
  const shown = f >= s(2.2) ? 100 : Math.floor(prog);
  const cd = [
    {t: 2.4, n: '3', bg: C.pink, fg: C.yellow},
    {t: 2.8, n: '2', bg: C.yellow, fg: C.blue},
    {t: 3.2, n: '1', bg: C.blue, fg: C.lime},
  ];
  const cur = cd.filter((c) => f >= s(c.t)).pop();
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <Checker a={C.violet} b={C.ink} size={140} rot={12} drift={1.2} />
      <Bunting y={-30} sag={70} seed={2} />
      <Slam at={0} y={330} size={110} font={F.bungee} color={C.lime} shadow={C.pink} depth={8} mode="up" rot={-2}>
        PARTY{'\n'}LOADING...
      </Slam>
      {/* progress bar */}
      <div style={{position: 'absolute', left: 80, top: 560, width: 920, height: 120, border: `8px solid ${C.ink}`, background: C.white, boxShadow: `12px 12px 0 ${C.pink}`, transform: `rotate(${-1 + boil(f, 3, 0.6)}deg)`}}>
        <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: `${shown}%`, background: `repeating-linear-gradient(-45deg, ${C.pink} 0 30px, ${C.yellow} 30px 60px)`, backgroundPosition: `${f * 3}px 0`}} />
        <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: F.bungee, fontSize: 70, color: C.ink, WebkitTextStroke: `10px ${C.white}`, paintOrder: 'stroke fill'}}>
          {shown}%
        </div>
      </div>
      <div style={{position: 'absolute', left: 80, top: 760, width: 920}}>
        {STATUS.map((st, i) =>
          f >= s(st.t) ? (
            <div key={i} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: F.anton, fontSize: 56, color: C.white, marginBottom: 26, transform: `translateX(${(1 - pop(f, s(st.t))) * -900}px)`}}>
              <span><E k={st.k} /> {st.txt}...</span>
              <span style={{color: C.lime, fontFamily: F.bungee, fontSize: 58}}>{st.pct}</span>
            </div>
          ) : null,
        )}
      </div>
      <Cutout src={char('dj')} at={s(0.2)} x={560} y={H + 20} h={760} from="bottom" bounce={1} absF={abs} seed={4} />
      <Sticker k="headphones" at={s(0.5)} x={140} y={1380} size={150} seed={3} rot={-10} />
      <Sticker k="speaker" at={s(0.7)} x={950} y={1360} size={160} seed={5} rot={8} />
      {f >= s(2.2) && f < s(2.4) && (
        <Slam at={s(2.2)} y={960} size={120} font={F.bungee} color={C.yellow} shadow={C.pink} depth={8} rot={-6}>
          LET'S GOOO
        </Slam>
      )}
      {cur && (
        <AbsoluteFill style={{background: cur.bg}}>
          <Burst a={cur.bg} b={C.white} rays={30} speed={3} />
          <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: F.bungee, fontSize: 900, color: cur.fg, WebkitTextStroke: `28px ${C.ink}`, paintOrder: 'stroke fill', textShadow: extrude(C.ink, 22), transform: `scale(${interpolate(f - s(cur.t), [0, 5], [1.6, 1], clamp)}) rotate(${(Number(cur.n) - 2) * 6}deg)`}}>
            {cur.n}
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

/* ================================================================== S4 · DROP: happy bday (14.4–17.6s) */
export const S4Drop: React.FC<SceneProps> = ({abs}) => {
  const f = useCurrentFrame();
  const second = f >= s(1.6);
  const bi = beatIdx(abs + f);
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <BeatZoom absStart={abs} amt={0.035}>
        {second ? <Burst a={C.blue} b={C.cyan} speed={2} rays={24} /> : <Burst a={C.pink} b={C.yellow} speed={1.6} rays={24} />}
        <Halftone color={second ? C.violet : C.hot} opacity={0.2} />
        <Marigolds xs={[40, 140, 940, 1040]} len={8} />
        <Bunting y={-20} sag={80} seed={bi} />
        <Cutout src={char('dance')} at={0} x={540} y={H + 30} h={1180} from="bottom" flip={bi % 2 === 1} bounce={1.4} absF={abs} seed={2} />
        <Slam at={0} y={380} size={250} color={C.yellow} shadow={C.hot} depth={16} rot={-4}>
          HAPPY
        </Slam>
        <Slam at={s(0.4)} y={630} size={250} color={C.cyan} shadow={C.blue} depth={16} rot={3}>
          BDAY!!
        </Slam>
        <Tape at={s(1.6)} x={W / 2} y={840} bg={C.purple} color={C.yellow} size={96} font={F.modak} rot={-5} pad="0px 34px">
          हैप्पी बर्थडे
        </Tape>
        <Sticker k="tada" at={s(0.2)} x={140} y={1020} size={190} seed={1} rot={-12} />
        <Sticker k="party" at={s(0.6)} x={940} y={1000} size={200} seed={2} rot={10} />
        <Sticker k="firecracker" at={s(1.0)} x={130} y={1520} size={200} seed={3} rot={-20} />
        <Sticker k="disco" at={s(1.4)} x={950} y={1500} size={200} seed={4} spin={2} />
        <Sticker k="cake" at={s(1.8)} x={160} y={1250} size={150} seed={5} />
        <Sticker k="balloon" at={s(2.2)} x={930} y={1260} size={170} seed={6} />
        <Sticker k="fire" at={s(2.6)} x={540} y={1050} size={130} seed={7} />
        <Confetti at={0} y={700} n={110} seed={2} power={1.2} />
        <Confetti at={s(1.6)} y={700} n={90} seed={9} />
      </BeatZoom>
      <Flash at={0} dur={5} />
      <Flash at={s(1.6)} dur={3} color={C.cyan} />
    </AbsoluteFill>
  );
};

/* ================================================================== S5 · house party + dress code (17.6–20.8s) */
const Neon: React.FC<{at: number; y: number; text: string; color: string; size: number; seed: number}> = ({at, y, text, color, size, seed}) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const t = f - at;
  const flick = t < 10 ? (rand(t * 7 + seed) > 0.45 ? 1 : 0.15) : rand(Math.floor(f / 3) + seed) > 0.96 ? 0.4 : 1;
  return (
    <div style={{position: 'absolute', left: 0, width: W, top: y, textAlign: 'center', fontFamily: F.monoton, fontSize: size, color: '#fff', opacity: flick, textShadow: `0 0 8px ${color}, 0 0 22px ${color}, 0 0 48px ${color}, 0 0 90px ${color}`, transform: 'translateY(-50%)', lineHeight: 1}}>
      {text}
    </div>
  );
};

export const S5House: React.FC<SceneProps> = ({abs}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{overflow: 'hidden', background: '#16052e'}}>
      {/* light beams */}
      <AbsoluteFill style={{background: `repeating-conic-gradient(from ${f * 2.5}deg at 50% 14%, rgba(255,46,136,.35) 0deg 8deg, transparent 8deg 30deg, rgba(0,216,255,.3) 30deg 38deg, transparent 38deg 60deg)`}} />
      <Halftone color="#ffffff" opacity={0.06} size={26} />
      <Sticker k="disco" at={0} x={540} y={250} size={300} spin={3} seed={1} />
      <Neon at={s(0.15)} y={560} text="HOUSE" color={C.pink} size={210} seed={1} />
      <Neon at={s(0.45)} y={780} text="PARTY" color={C.cyan} size={210} seed={5} />
      <Tape at={s(0.8)} x={W / 2} y={960} bg={C.yellow} size={66} font={F.bungee} rot={-3}>
        <E k="house" /> AT MY PLACE
      </Tape>
      <Cutout src={char('dj')} at={s(0.1)} x={700} y={H + 30} h={860} from="right" bounce={1} absF={abs} seed={8} />
      <Tape at={s(1.5)} x={60} y={1170} anchor="left" bg={C.pink} color={C.white} size={70} font={F.bungee} rot={-4} from="left">
        DRESS CODE:
      </Tape>
      <Tape at={s(1.75)} x={80} y={1310} anchor="left" bg={C.lime} size={96} font={F.shrikhand} rot={3} from="left" pad="0 30px 10px">
        KAPDE <E k="shirt" />
      </Tape>
      <Slam at={s(2.2)} x={300} width={560} y={1460} size={56} font={F.marker} color={C.white} depth={0} strokeW={9} rot={-6} mode="pop">
        (haan, seriously)
      </Slam>
      <Sticker k="notes" at={s(0.9)} x={150} y={780} size={130} seed={3} />
      <Sticker k="speaker" at={s(1.1)} x={930} y={1060} size={150} seed={4} rot={12} />
      <Sticker k="moon" at={s(0.4)} x={930} y={160} size={140} seed={5} />
    </AbsoluteFill>
  );
};

/* ================================================================== S6 · the menu (20.8–24.0s) */
const MENU = [
  {k: '1f964', txt: 'COLD DRINK', tag: 'UNLIMITED*', col: C.yellow},
  {k: 'biryani', txt: 'BIRYANI', tag: 'PAKKA', col: C.lime},
  {k: 'cake', txt: 'CAKE', tag: '2 TIER', col: C.pink},
  {k: 'speaker', txt: 'MUSIC', tag: 'FULL VOLUME', col: C.cyan},
  {k: 'mic', txt: 'ANTAKSHARI', tag: 'COMPULSORY', col: C.orange},
  {k: '1f3ae', txt: 'GAMES', tag: 'TEAM BANA LO', col: C.yellow},
];
export const S6Menu: React.FC<SceneProps> = ({abs}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <Solid color={C.yellow} />
      <Halftone color={C.orange} opacity={0.35} size={30} />
      <Stripes a={C.pink} b={C.ink} w={28} angle={90} drift={0} />
      <AbsoluteFill style={{top: 40, background: C.yellow}}>
        <Halftone color={C.orange} opacity={0.35} size={30} />
      </AbsoluteFill>
      <Cutout src={char('swag')} at={s(0.05)} x={850} y={H + 40} h={1380} from="right" seed={6} />
      <Slam at={0} y={210} size={128} color={C.pink} shadow={C.ink} depth={10} rot={-3} mode="up">
        TONIGHT'S MENU
      </Slam>
      <Slam at={s(0.2)} y={340} size={54} font={F.marker} color={C.ink} stroke={C.white} depth={0} strokeW={10} rot={2} mode="pop">
        (100% mummy approved)
      </Slam>
      {MENU.map((m, i) => {
        const at = s(0.4 + i * 0.4);
        if (f < at) return null;
        const pp = pop(f, at, {damping: 12, stiffness: 260});
        return (
          <div key={i} style={{position: 'absolute', left: 40, top: 450 + i * 168, width: 650, height: 136, transform: `translateX(${(1 - pp) * -800}px) rotate(${(i % 2 ? 1.5 : -1.5) + boil(f, i, 0.8)}deg)`}}>
            <div style={{position: 'absolute', inset: 0, background: C.white, border: `7px solid ${C.ink}`, boxShadow: `10px 10px 0 ${C.ink}`, display: 'flex', alignItems: 'center', paddingLeft: 22, gap: 18, fontFamily: F.anton, fontSize: m.txt.length > 8 ? 66 : 84, color: C.ink}}>
              <Img src={emo(m.k)} style={{width: 92, height: 92}} />
              {m.txt}
            </div>
            <div style={{position: 'absolute', right: -40, top: -24, background: m.col, border: `6px solid ${C.ink}`, padding: '4px 16px', fontFamily: F.bungee, fontSize: 40, color: C.ink, transform: `rotate(${i % 2 ? -8 : 7}deg) scale(${pop(f, at + 4)})`, whiteSpace: 'nowrap'}}>
              
              {m.tag}
            </div>
          </div>
        );
      })}
      <Slam at={s(2.85)} x={330} width={620} y={1500} size={50} font={F.marker} color={C.ink} stroke={C.white} depth={0} strokeW={9} rot={-4} mode="pop">
        *second helping bhi milega <E k="smirk" />
      </Slam>
    </AbsoluteFill>
  );
};

/* ================================================================== S7 · naachna compulsory (24.0–27.2s) */
export const S7Naach: React.FC<SceneProps> = ({abs}) => {
  const f = useCurrentFrame();
  const bi = beatIdx(abs + f);
  const col = CYCLE[bi % CYCLE.length];
  const col2 = CYCLE[(bi + 3) % CYCLE.length];
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <BeatZoom absStart={abs} amt={0.04}>
        <Burst a={col} b={col2} rays={16} speed={-2} cy="62%" />
        <Checker a="rgba(0,0,0,.18)" b="transparent" size={160} rot={-20} drift={2} />
        <Cutout src={char('dance')} at={0} x={190} y={H + 10} h={780} flip={bi % 2 === 0} from="left" bounce={1.4} absF={abs + 6} seed={1} />
        <Cutout src={char('dance')} at={0} x={890} y={H + 10} h={780} flip={bi % 2 === 0} from="right" bounce={1.4} absF={abs + 6} seed={2} />
        <Cutout src={char('dance')} at={s(0.1)} x={540} y={H + 40} h={1150} flip={bi % 2 === 1} from="bottom" bounce={1.6} absF={abs} seed={3} />
        <Slam at={0} y={330} size={220} color={C.yellow} shadow={C.ink} depth={14} rot={-4}>
          NAACHNA
        </Slam>
        <Tape at={s(0.4)} x={W / 2} y={560} bg={C.red} color={C.white} size={104} font={F.bungee} rot={3}>
          COMPULSORY
        </Tape>
        <Slam at={s(1.2)} y={720} size={60} font={F.marker} color={C.white} depth={0} strokeW={11} rot={-3} mode="pop">
          (sharam ghar pe chhod ke aana)
        </Slam>
        <Sticker k="dancer" at={s(0.6)} x={110} y={880} size={150} seed={4} />
        <Sticker k="mandance" at={s(0.8)} x={970} y={880} size={150} seed={5} />
        <Sticker k="notes" at={s(1.6)} x={540} y={900} size={120} seed={6} />
        <Sticker k="fire" at={s(2.0)} x={120} y={1150} size={130} seed={7} />
        <Sticker k="fire" at={s(2.2)} x={960} y={1150} size={130} seed={8} />
      </BeatZoom>
    </AbsoluteFill>
  );
};

/* ================================================================== S8 · tere bhai ka birthday (27.2–30.4s) */
export const S8Bhai: React.FC<SceneProps> = ({abs}) => {
  const f = useCurrentFrame();
  const glint = f >= s(0.8) ? Math.max(0, 1 - Math.abs(f - s(0.95)) / 6) : 0;
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <Stripes a={C.ink} b={C.marigold} w={60} angle={-35} drift={1.5} />
      <AbsoluteFill style={{background: `radial-gradient(circle at 50% 62%, ${C.red} 0 30%, transparent 58%)`}} />
      <Cutout src={char('swag')} at={0} x={540} y={H + 40} h={1340} from="bottom" seed={4} />
      {/* sunglasses glint */}
      <div style={{position: 'absolute', left: 600 - 120, top: 708 - 120, width: 240, height: 240, opacity: glint, transform: `scale(${0.5 + glint}) rotate(${f * 4}deg)`, background: 'conic-gradient(from 0deg, transparent 0 40deg, #fff 45deg, transparent 50deg 130deg, #fff 135deg, transparent 140deg 220deg, #fff 225deg, transparent 230deg 310deg, #fff 315deg, transparent 320deg)', borderRadius: '50%', filter: 'blur(1px)'}} />
      <Slam at={0} y={230} size={120} color={C.white} shadow={C.red} depth={10} rot={-3}>
        TERE BHAI KA
      </Slam>
      <Slam at={s(0.4)} y={420} size={150} color={C.yellow} shadow={C.red} depth={14} rot={2}>
        BIRTHDAY HAI
      </Slam>
      <Sticker k="cool" at={s(0.7)} x={930} y={580} size={160} seed={2} rot={12} />
      <Tape at={s(1.6)} x={250} y={1330} bg={C.lime} size={64} font={F.bungee} rot={-8}>
        BOSS MODE: ON
      </Tape>
      <div style={{position: 'absolute', left: 90, top: 1640, width: 900, height: 150, transform: `scale(${pop(f, s(2.0))}) rotate(-2deg)`, background: C.yellow, border: `8px solid ${C.ink}`, boxShadow: `10px 10px 0 ${C.ink}`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 22, fontFamily: F.shrikhand, fontSize: 82, color: C.red, WebkitTextStroke: `3px ${C.ink}`}}>
        <span style={{fontSize: 52, color: C.blue}}>✿</span> HORN OK PLEASE <span style={{fontSize: 52, color: C.blue}}>✿</span>
      </div>
      <Sticker k="popcorn" at={s(1.2)} x={140} y={1030} size={140} seed={5} rot={-10} />
      <Sticker k="hundred" at={s(2.4)} x={940} y={1200} size={150} seed={6} rot={8} />
    </AbsoluteFill>
  );
};

/* ================================================================== S9 · cake, gifts, attendance (30.4–33.6s) */
export const S9Cake: React.FC<SceneProps> = ({abs}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <Shake hits={[s(1.2)]} amp={20}>
        <Burst a={C.pink} b={C.hot} rays={20} speed={0.7} cx="30%" cy="55%" />
        <Halftone color={C.yellow} opacity={0.25} size={36} />
        <Bunting y={-20} sag={90} seed={4} />
        <Cutout src={char('cake')} at={0} x={300} y={H + 30} h={1320} from="left" seed={3} />
        <Tape at={s(0.4)} x={760} y={560} bg={C.white} size={92} font={F.bungee} rot={-4}>
          CAKE <E k="check" />
        </Tape>
        <Tape at={s(1.2)} x={700} y={850} bg={C.red} color={C.yellow} size={62} font={F.bungee} rot={-5}>
          ATTENDANCE:<br />COMPULSORY!!
        </Tape>
        <Slam at={s(2.0)} x={740} width={600} y={1080} size={56} font={F.marker} color={C.white} depth={0} strokeW={9} rot={3} mode="pop">
          no excuses accepted
        </Slam>
        <Sticker k="balloon" at={s(0.6)} x={960} y={300} size={170} seed={3} />
        <Sticker k="party" at={s(1.4)} x={560} y={1500} size={150} seed={4} rot={-8} />
        <Sticker k="fire" at={s(1.6)} x={960} y={1560} size={150} seed={5} rot={12} />
      </Shake>
    </AbsoluteFill>
  );
};

/* ================================================================== S10 · details (33.6–38.4s) */
export const S10Details: React.FC<SceneProps> = ({p}) => {
  const f = useCurrentFrame();
  const rx = interpolate(f, [s(0.8), s(4.8)], [-260, W + 260]);
  const pinY = interpolate(pop(f, s(0.6), {damping: 8, stiffness: 160}), [0, 1], [-300, 290]);
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <Solid color={C.blue} />
      <Halftone color={C.cyan} opacity={0.3} size={32} />
      <Checker a={C.yellow} b={C.ink} size={60} drift={1} />
      <AbsoluteFill style={{inset: 34, background: C.blue}}>
        <Halftone color={C.cyan} opacity={0.3} size={32} />
      </AbsoluteFill>
      <Slam at={0} y={190} size={120} color={C.yellow} shadow={C.ink} depth={10} rot={-3} mode="up">
        KAHAN?
      </Slam>
      {/* address card */}
      <div style={{position: 'absolute', left: 70, top: 300, width: 940, transform: `scale(${pop(f, s(0.3))}) rotate(${-1.5 + boil(f, 2, 0.6)}deg)`, background: C.white, border: `9px solid ${C.ink}`, boxShadow: `14px 14px 0 ${C.pink}`, padding: '34px 30px', textAlign: 'center'}}>
        <div style={{fontFamily: F.bungee, fontSize: 80, color: C.ink, lineHeight: 1.05}}>{p.addressLine1}</div>
        <div style={{fontFamily: F.bungee, fontSize: 96, color: C.pink, lineHeight: 1.1, WebkitTextStroke: `3px ${C.ink}`}}>{p.addressLine2}</div>
      </div>
      {f >= s(0.6) && <Img src={emo('pin')} style={{position: 'absolute', left: 880, top: pinY - 120, width: 150, height: 150, filter: sticker(6), transform: 'rotate(12deg)'}} />}
      <Slam at={s(1.6)} y={780} size={120} color={C.lime} shadow={C.ink} depth={10} rot={2} mode="up">
        KAB?
      </Slam>
      <div style={{position: 'absolute', left: 120, top: 870, width: 840, transform: `scale(${pop(f, s(1.8))}) rotate(${1.5 + boil(f, 5, 0.6)}deg)`, background: C.yellow, border: `9px solid ${C.ink}`, boxShadow: `14px 14px 0 ${C.ink}`, padding: '22px 20px', textAlign: 'center', fontFamily: F.bungee, fontSize: 80, color: C.ink, whiteSpace: 'nowrap'}}>
        <E k="alarm" /> {p.time}
      </div>
      <Slam at={s(2.4)} y={1135} size={54} font={F.marker} color={C.white} depth={0} strokeW={11} rot={-4} mode="pop">
        {p.timeJoke} <E k="smirk" />
      </Slam>
      {p.date ? (
        <Tape at={s(2.9)} x={W / 2} y={1290} bg={C.pink} color={C.white} size={78} font={F.bungee} rot={3}>
          <E k="cal" /> {p.date}
        </Tape>
      ) : null}
      <Cutout src={char('point_you')} at={s(2.6)} x={830} y={H + 40} h={760} from="right" seed={12} />
      <Sticker k="house" at={s(0.9)} x={150} y={1420} size={150} seed={3} rot={-8} />
      <Img src={emo('rickshaw')} style={{position: 'absolute', left: rx - 150, top: 1500 + Math.abs(Math.sin(f / 2)) * -8, width: 300, height: 300, filter: sticker(7), transform: 'scaleX(-1)'}} />
      <Tape at={s(3.3)} x={W / 2} y={1800} bg={C.lime} size={60} font={F.bungee} rot={-2}>
        AUTO KARO, AA JAO!
      </Tape>
    </AbsoluteFill>
  );
};

/* ================================================================== S11 · aaj mera birthday (38.4–39.6s) */
export const S11Aaj: React.FC<SceneProps> = ({abs}) => {
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <BeatZoom absStart={abs} amt={0.05}>
        <Burst a={C.red} b={C.yellow} rays={28} speed={4} cy="55%" />
        <Cutout src={char('point_self')} at={0} x={540} y={H + 30} h={1350} from="pop" seed={2} />
        <Slam at={0} y={300} size={170} font={F.modak} color={C.white} shadow={C.red} depth={10} rot={-4} style={{lineHeight: 1.2}}>
          आज मेरा
        </Slam>
        <Slam at={s(0.2)} y={520} size={150} color={C.yellow} shadow={C.ink} depth={14} rot={3}>
          BIRTHDAY!!
        </Slam>
      </BeatZoom>
      <Flash at={0} dur={4} color={C.yellow} />
    </AbsoluteFill>
  );
};

/* ================================================================== S12 · personal invite card (39.6–46.4s) */
export const S12Invite: React.FC<SceneProps> = ({abs, p}) => {
  const f = useCurrentFrame();
  const name = (p.guestName || 'YOU').toUpperCase();
  const nameSize = Math.min(230, 1500 / Math.max(3, name.length + 1));
  const polP = pop(f, s(0.8), {damping: 11, stiffness: 120});
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <Burst a={C.marigold} b={C.yellow} rays={24} speed={0.4} cy="42%" />
      <Halftone color={C.pink} opacity={0.22} size={34} />
      <Marigolds xs={[38, 128, 952, 1042]} len={10} r={24} />
      <Bunting y={-24} sag={70} seed={1} />
      <Slam at={0} y={210} size={140} color={C.white} shadow={C.pink} depth={10} rot={-4}>
        HEY
      </Slam>
      <Slam at={s(0.4)} y={390} size={nameSize} color={C.pink} stroke={C.ink} shadow={C.ink} depth={14} rot={2} width={W - 60}>
        {name}!
      </Slam>
      {/* polaroid */}
      {f >= s(0.8) && (
        <div style={{position: 'absolute', left: 90, top: 540, width: 540, height: 640, background: '#fffdf6', border: `6px solid ${C.ink}`, boxShadow: `16px 16px 0 rgba(20,10,31,.55)`, transform: `translateY(${(1 - polP) * -1400}px) rotate(${-7 + boil(f, 4, 0.8)}deg)`}}>
          <div style={{position: 'absolute', left: 26, top: 26, width: 476, height: 476, overflow: 'hidden', border: `4px solid ${C.ink}`, background: C.cyan}}>
            {p.guestPhoto ? (
              <Img src={staticFile(p.guestPhoto)} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 25%'}} />
            ) : (
              <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
                <Burst a={C.cyan} b={C.blue} rays={16} speed={1} />
                <Img src={emo('party')} style={{width: 300, height: 300, position: 'relative', filter: sticker(6)}} />
              </AbsoluteFill>
            )}
          </div>
          <div style={{position: 'absolute', left: 0, right: 0, bottom: 34, textAlign: 'center', fontFamily: F.marker, fontSize: 54, color: C.ink}}>
            VIP GUEST <E k="star" />
          </div>
          <div style={{position: 'absolute', left: -40, top: -20, width: 170, height: 52, background: 'rgba(182,255,46,.85)', transform: 'rotate(-30deg)', border: `3px solid ${C.ink}`}} />
          <div style={{position: 'absolute', right: -40, top: -14, width: 170, height: 52, background: 'rgba(255,46,136,.85)', transform: 'rotate(28deg)', border: `3px solid ${C.ink}`}} />
        </div>
      )}
      <Cutout src={char('welcome')} at={s(1.2)} x={800} y={1195} h={800} from="right" seed={7} />
      <Slam at={s(2.0)} y={1262} x={W / 2} width={W} size={80} color={C.red} stroke={C.white} shadow={C.ink} depth={8} rot={-5} font={F.bungee} strokeW={9}>
        YOU'RE INVITED!
      </Slam>
      {/* info card */}
      <div style={{position: 'absolute', left: 60, top: 1360, width: 960, transform: `translateY(${(1 - pop(f, s(2.6))) * 900}px) rotate(${1 + boil(f, 9, 0.5)}deg)`, background: C.white, border: `8px solid ${C.ink}`, boxShadow: `12px 12px 0 ${C.ink}`, padding: '22px 26px', fontFamily: F.anton, fontSize: 60, color: C.ink, lineHeight: 1.22}}>
        <div><E k="pin" /> {p.addressLine1} · {p.addressLine2}</div>
        <div><E k="alarm" /> {p.time} <span style={{fontFamily: F.marker, fontSize: 40, color: C.pink}}>(pehle bhi chalega)</span></div>
        {p.date ? <div><E k="cal" /> {p.date}</div> : null}
      </div>
      <Slam at={s(3.4)} y={p.date ? 1740 : 1665} size={58} font={F.marker} color={C.ink} stroke={C.white} depth={0} strokeW={10} rot={-2} mode="pop">
        bas aa jaana, bas! <E k="pray" />
      </Slam>
      <Sticker k="balloon" at={s(1.6)} x={150} y={1850} size={160} seed={3} rot={-10} />
      <Sticker k="cake" at={s(1.8)} x={400} y={1860} size={140} seed={4} />
      <Sticker k="disco" at={s(2.0)} x={680} y={1855} size={150} seed={5} spin={2} />
      <Sticker k="love" at={s(2.2)} x={930} y={1850} size={160} seed={6} rot={10} />
      <Confetti at={s(0.4)} y={500} n={90} seed={3} />
      <Confetti at={s(2.0)} y={1100} n={70} seed={8} power={0.9} />
      <Flash at={0} dur={4} />
    </AbsoluteFill>
  );
};
