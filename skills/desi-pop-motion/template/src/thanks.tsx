import React from 'react';
import {AbsoluteFill, Audio, Img, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {z} from 'zod';
import {clamp, ease, pop} from './anim';
import {
  beatIdx, boil, Bunting, Burst, BeatZoom, Confetti, Cutout, E, emo, Flash, Grain, Halftone, Marigolds, Slam, Solid, Sticker,
  sticker, Tape,
} from './kit';
import {C, F, H, s, W} from './theme';

export const thanksSchema = z.object({
  /** Optional guest name: "THANK YOU RAHUL". Empty = generic. */
  guestName: z.string(),
  host: z.string(),
  /** Song slice in public/audio (swap for any track). */
  music: z.string(),
});
export type ThanksProps = z.infer<typeof thanksSchema>;
export const defaultThanks: ThanksProps = {guestName: '', host: 'Your Name', music: ''};
/** ...Baby One More Time chorus: 93.02 BPM; video t=0 is song 67.77s, music opens on beat 3 ("And I'm not with you"), HAAN click on "one more time". */
const B = 60 / 93.02;
const b = (n: number) => n * B;
export const THANKS_DURATION = s(19 * (60 / 93.02));

const char = (n: string) => `char/${n}.png`;
type P = {abs: number; p: ThanksProps};

/* 0–2.4s · agli subah (muffled music) */
const T1Morning: React.FC<P> = () => {
  const f = useCurrentFrame();
  const typed = 'agli subah...'.slice(0, Math.floor(interpolate(f, [s(0.05), s(0.75)], [0, 13], clamp)));
  const zoom = interpolate(f, [0, s(b(3))], [1, 1.06]);
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `scale(${zoom})`}}>
        <Solid color="#cfc3e8" />
        <Halftone color="#9d8cc7" opacity={0.35} size={30} drift={0.2} />
        <Sticker k="sun" at={s(0.4)} x={870} y={interpolate(f, [s(0.4), s(b(3))], [420, 320], clamp)} size={210} seed={2} spin={0.6} />
        <Cutout src={char('sleepy')} at={0} x={540} y={H - 120} h={1050} from="pop" seed={3} border={10} />
        {['z', 'Z', 'Z'].map((z, i) => {
          const t = ((f / 30 + i * 0.45) % 1.4) / 1.4;
          return (
            <div key={i} style={{position: 'absolute', left: 700 + i * 60 + t * 60, top: 820 - i * 70 - t * 140, fontFamily: F.bungee, fontSize: 80 + i * 26, color: C.blue, WebkitTextStroke: `6px ${C.white}`, paintOrder: 'stroke fill', opacity: Math.sin(t * Math.PI)}}>
              {z}
            </div>
          );
        })}
        {/* scattered aftermath */}
        <Sticker k="balloon" at={0} x={140} y={1720} size={150} rot={-70} seed={4} />
        <Sticker k="confetti" at={0} x={930} y={1760} size={140} rot={20} seed={5} />
        <Sticker k="popcorn" at={0} x={360} y={1820} size={110} rot={-30} seed={6} />
      </AbsoluteFill>
      <div style={{position: 'absolute', left: 0, right: 0, top: 260, textAlign: 'center', fontFamily: F.marker, fontSize: 104, color: C.ink, WebkitTextStroke: `14px ${C.white}`, paintOrder: 'stroke fill', transform: `rotate(${-3 + boil(f, 1, 0.8)}deg)`}}>
        {typed}
      </div>
      <Tape at={s(0.85)} x={W / 2} y={460} bg={C.white} size={70} font={F.bungee} rot={3}>
        <E k="alarm" /> 11:47 AM
      </Tape>
    </AbsoluteFill>
  );
};

/* 2.4–5.6s · THANK YOU (drop) */
const T2Thanks: React.FC<P> = ({abs, p}) => {
  const f = useCurrentFrame();
  const bi = beatIdx(abs + f, B);
  const name = p.guestName.trim().toUpperCase();
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <BeatZoom absStart={abs} amt={0.035} beat={B}>
        <Burst a={C.pink} b={C.yellow} speed={1.4} rays={24} cy="52%" />
        <Halftone color={C.hot} opacity={0.2} />
        <Marigolds xs={[40, 140, 940, 1040]} len={8} />
        <Bunting y={-20} sag={80} seed={bi} />
        <Cutout src={char('namaste')} at={s(b(0.25))} x={540} y={H + 30} h={1080} from="bottom" bounce={1.2} absF={abs} seed={2} beat={B} />
        <Slam at={0} y={350} size={250} color={C.yellow} shadow={C.hot} depth={16} rot={-4}>
          THANK
        </Slam>
        <Slam at={s(b(1.0))} y={590} size={250} color={C.cyan} shadow={C.blue} depth={16} rot={3}>
          {name ? 'YOU' : 'YOU!!'}
        </Slam>
        {name ? (
          <Tape at={s(b(2.0))} x={W / 2} y={790} bg={C.lime} size={Math.min(110, 900 / Math.max(4, name.length))} font={F.shrikhand} rot={-3} pad="0 34px 10px">
            {name}!
          </Tape>
        ) : null}
        <Tape at={s(name ? 1.2 : 0.8)} x={W / 2} y={name ? 930 : 800} bg={C.white} size={80} font={F.bungee} rot={name ? 3 : -3}>
          FOR COMING <E k="pray" />
        </Tape>
        <Tape at={s(b(4.5))} x={230} y={1240} bg={C.purple} color={C.yellow} size={84} font={F.modak} rot={-8} pad="0 26px">
          धन्यवाद
        </Tape>
        <Sticker k="love" at={s(b(3.0))} x={930} y={1180} size={170} seed={3} rot={12} />
        <Sticker k="sparkles" at={s(b(4.0))} x={140} y={1560} size={150} seed={4} />
        <Sticker k="party" at={s(b(4.5))} x={950} y={1520} size={170} seed={5} />
        <Confetti at={0} y={650} n={110} seed={2} power={1.2} />
      </BeatZoom>
      <Flash at={0} dur={5} />
    </AbsoluteFill>
  );
};

/* 5.6–8.0s · hope you enjoyed last night :) */
const POLAROIDS = [
  {src: 'dance', cap: 'bhangra king', x: 230, y: 960, rot: -9},
  {src: 'dj', cap: 'DJ ON DUTY', x: 540, y: 1060, rot: 4},
  {src: 'cake', cap: 'cake time!', x: 850, y: 960, rot: 10},
];
const T3Memories: React.FC<P> = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <Burst a={C.blue} b={C.cyan} rays={20} speed={0.6} cy="65%" />
      <Halftone color={C.violet} opacity={0.2} />
      <Slam at={0} y={250} size={92} font={F.marker} color={C.white} depth={0} strokeW={13} rot={-3} mode="up">
        hope you enjoyed
      </Slam>
      <Slam at={s(b(0.75))} y={430} size={160} color={C.yellow} shadow={C.pink} depth={14} rot={2}>
        LAST NIGHT
      </Slam>
      <Slam at={s(b(1.5))} x={900} width={300} y={600} size={150} font={F.bungee} color={C.lime} shadow={C.ink} depth={10} rot={90} mode="pop">
        :)
      </Slam>
      {POLAROIDS.map((pl, i) => {
        const at = s(b(1 + i));
        if (f < at) return null;
        const pp = pop(f, at, {damping: 11, stiffness: 150});
        return (
          <div key={i} style={{position: 'absolute', left: pl.x - 165, top: pl.y - 200, width: 330, height: 400, background: '#fffdf6', border: `5px solid ${C.ink}`, boxShadow: `12px 12px 0 rgba(20,10,31,.5)`, transform: `translateY(${(1 - pp) * -1500}px) rotate(${pl.rot + boil(f, i * 5, 1)}deg)`}}>
            <div style={{position: 'absolute', left: 18, top: 18, width: 284, height: 284, border: `4px solid ${C.ink}`, overflow: 'hidden', background: [C.pink, C.yellow, C.lime][i]}}>
              <Img src={staticFile(char(pl.src))} style={{position: 'absolute', left: '50%', top: 10, height: 520, transform: 'translateX(-50%)'}} />
            </div>
            <div style={{position: 'absolute', left: 0, right: 0, bottom: 22, textAlign: 'center', fontFamily: F.marker, fontSize: 36, color: C.ink}}>{pl.cap}</div>
            <div style={{position: 'absolute', left: 105, top: -18, width: 120, height: 40, background: 'rgba(255,230,0,.85)', border: `3px solid ${C.ink}`, transform: 'rotate(-4deg)'}} />
          </div>
        );
      })}
      <Sticker k="fire" at={s(b(3))} x={180} y={1400} size={150} seed={7} rot={-10} />
      <Sticker k="dancer" at={s(b(3.25))} x={900} y={1420} size={150} seed={8} rot={10} />
      <Tape at={s(b(2.5))} x={W / 2} y={1560} bg={C.pink} color={C.white} size={64} font={F.bungee} rot={-2}>
        KYA RAAT THI YAAR <E k="fire" />
      </Tape>
    </AbsoluteFill>
  );
};

/* 8.0–10.4s · next bhi aaoge na? */
const Cursor: React.FC<{x: number; y: number; press: number}> = ({x, y, press}) => (
  <svg width={110} height={130} viewBox="0 0 22 26" style={{position: 'absolute', left: x, top: y, transform: `scale(${1 - press * 0.15})`, transformOrigin: '0 0', filter: 'drop-shadow(5px 6px 0 rgba(20,10,31,.45))'}}>
    <path d="M1 1 L1 20 L6 15.5 L9.5 23.5 L13 22 L9.6 14.2 L16 14 Z" fill="#fff" stroke={C.ink} strokeWidth={1.6} strokeLinejoin="round" />
  </svg>
);

const T4Next: React.FC<P> = ({abs, p}) => {
  const f = useCurrentFrame();
  // cursor path: drifts toward NAHI, NAHI runs away, cursor clicks HAAN
  const cx = interpolate(f, [s(1.0), s(1.45), s(2.1), s(2.75)], [700, 760, 600, 300], {...clamp, easing: (t) => 1 - (1 - t) ** 3});
  const cy = interpolate(f, [s(1.0), s(1.45), s(2.1), s(2.75)], [1500, 1010, 1080, 1010], {...clamp, easing: (t) => 1 - (1 - t) ** 3});
  const flee = ease(f, s(1.4), 6);
  const flee2 = ease(f, s(2.05), 5);
  const nahiX = 790 + flee * 120 - flee2 * 30;
  const nahiY = 980 + flee * 380 + flee2 * 260;
  const nahiRot = flee * 18 + flee2 * 40;
  const clicked = f >= s(3.0);
  const press = f >= s(2.93) && f < s(3.1) ? 1 : 0;
  const yesScale = clicked ? 1 + Math.max(0, 1 - (f - s(3.0)) / 8) * 0.18 : 1;
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <BeatZoom absStart={abs} amt={0.02} beat={B}>
        <Burst a={C.lime} b={C.green} rays={22} speed={0.8} cy="55%" />
        <Halftone color={C.ink} opacity={0.1} />
        <Bunting y={-24} sag={70} seed={3} />
        <Slam at={0} y={320} size={170} color={C.white} shadow={C.ink} depth={14} rot={-3}>
          NEXT BHI
        </Slam>
        <Slam at={s(b(1))} y={540} size={150} color={C.yellow} shadow={C.pink} depth={14} rot={2}>
          AAOGE NA?
        </Slam>
        <Cutout src={char('point_you')} at={s(b(0.5))} x={820} y={H + 40} h={820} from="right" seed={6} />
        {/* buttons */}
        <div style={{position: 'absolute', left: 300 - 200, top: 980 - 70, width: 400, height: 140, transform: `scale(${pop(f, s(b(1))) * yesScale}) rotate(-3deg)`, background: clicked ? C.pink : C.yellow, color: clicked ? C.white : C.ink, border: `8px solid ${C.ink}`, boxShadow: `${press ? 3 : 12}px ${press ? 3 : 12}px 0 ${C.ink}`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, fontFamily: F.bungee, fontSize: 76}}>
          HAAN <E k="hundred" />
        </div>
        <div style={{position: 'absolute', left: nahiX - 150, top: nahiY - 60, width: 300, height: 120, transform: `scale(${pop(f, s(b(1.25))) * (1 - flee2 * 0.35)}) rotate(${4 + nahiRot}deg)`, background: C.white, color: C.ink, border: `7px solid ${C.ink}`, boxShadow: `10px 10px 0 ${C.ink}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: F.bungee, fontSize: 60, opacity: 1 - flee2 * 0.3}}>
          NAHI
        </div>
        {f >= s(1.45) && f < s(3.0) && (
          <Slam at={s(1.45)} x={860} width={400} y={1170} size={48} font={F.marker} color={C.ink} stroke={C.white} depth={0} strokeW={9} rot={8} mode="pop">
            nope!
          </Slam>
        )}
        {f >= s(1.0) && f < s(3.6) && <Cursor x={cx} y={cy} press={press} />}
        <Slam at={s(3.4)} y={1640} x={330} width={620} size={78} font={F.marker} color={C.ink} stroke={C.white} depth={0} strokeW={12} rot={-4} mode="up">
          {`love, ${p.host}`} <E k="love" />
        </Slam>
        <Confetti at={s(3.0)} x={300} y={980} n={90} seed={6} />
      </BeatZoom>
      <Flash at={0} dur={3} color={C.lime} />
    </AbsoluteFill>
  );
};

const TL: {from: number; to: number; C: React.FC<P>}[] = [
  {from: 0, to: b(3), C: T1Morning},
  {from: b(3), to: b(8), C: T2Thanks},
  {from: b(8), to: b(12), C: T3Memories},
  {from: b(12), to: b(19), C: T4Next},
];

const SFX: [number, string, number][] = [
  [0.05, 'pop', 0.2], [0.85, 'ding', 0.25],
  [b(3), 'impact', 0.4], [b(4), 'pop_hi', 0.3], [b(5), 'stamp', 0.35], [b(7), 'pop', 0.3],
  [b(8), 'whoosh', 0.3], [b(9), 'whoosh_down', 0.28], [b(10), 'whoosh_down', 0.28], [b(11), 'whoosh_down', 0.28],
  [b(12), 'whoosh', 0.3], [b(12) + 1.4, 'boing', 0.35], [b(12) + 2.05, 'boing', 0.3], [b(12) + 3.0, 'stamp', 0.45],
];

export const ThankYou: React.FC<ThanksProps> = (p) => (
  <AbsoluteFill style={{background: '#000'}}>
    {TL.map(({from, to, C: Scene}, i) => (
      <Sequence key={i} from={s(from)} durationInFrames={s(to) - s(from)}>
        <Scene abs={s(from)} p={p} />
      </Sequence>
    ))}
    <Grain />
    {p.music ? <Audio src={staticFile(p.music)} volume={0.9} /> : null}
    {SFX.map(([t, n, v], i) => (
      <Sequence key={i} from={s(t)} durationInFrames={s(1.8)}>
        <Audio src={staticFile(`sfx/${n}.wav`)} volume={v} />
      </Sequence>
    ))}
  </AbsoluteFill>
);
