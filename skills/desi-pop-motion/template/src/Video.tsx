import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile} from 'remotion';
import type {InviteProps} from './config';
import {Grain} from './kit';
import {
  S0Cold, S10Details, S11Aaj, S12Invite, S1List, S2Reveal, S3Loading, S4Drop, S5House, S6Menu, S7Naach, S8Bhai, S9Cake, SceneProps,
} from './scenes';
import {s} from './theme';

/** Scene timeline in seconds (video t=0 == song 1.74s, a downbeat; 150 BPM). */
export const TIMELINE: {from: number; to: number; C: React.FC<SceneProps>}[] = [
  {from: 0, to: 0.9, C: S0Cold},
  {from: 0.9, to: 7.4, C: S1List},
  {from: 7.4, to: 10.8, C: S2Reveal},
  {from: 10.8, to: 14.4, C: S3Loading},
  {from: 14.4, to: 17.6, C: S4Drop},
  {from: 17.6, to: 20.8, C: S5House},
  {from: 20.8, to: 24.0, C: S6Menu},
  {from: 24.0, to: 27.2, C: S7Naach},
  {from: 27.2, to: 30.4, C: S8Bhai},
  {from: 30.4, to: 33.6, C: S9Cake},
  {from: 33.6, to: 38.4, C: S10Details},
  {from: 38.4, to: 39.6, C: S11Aaj},
  {from: 39.6, to: 46.4, C: S12Invite},
];
export const DURATION = s(46.4);
/** First frame of the personalised part (everything before it is identical for every guest). */
export const PERSONAL_FROM = s(39.6);

const SFX: [number, string, number?][] = [
  [0, 'static', 0.25], [0.07, 'glitch', 0.4], [0.3, 'stamp', 0.3],
  [0.96, 'pop', 0.45], [2.0, 'pop_hi', 0.45], [2.8, 'pop', 0.45], [3.64, 'pop_hi', 0.45], [4.48, 'pop', 0.45], [5.28, 'boing', 0.45], [6.04, 'scratch', 0.5], [6.8, 'stamp', 0.55],
  [7.4, 'whoosh', 0.4], [7.9, 'impact', 0.5], [8.4, 'pop_hi', 0.4], [9.3, 'stamp', 0.5],
  [10.8, 'whoosh_down', 0.4], [11.1, 'pop', 0.4], [11.75, 'pop', 0.4], [12.4, 'pop_hi', 0.4], [13.2, 'stamp', 0.45], [13.6, 'stamp', 0.45], [14.0, 'stamp', 0.45],
  [14.4, 'airhorn', 0.3], [14.4, 'impact', 0.5],
  [17.6, 'whoosh', 0.4], [18.4, 'pop', 0.35], [19.1, 'stamp', 0.45], [19.35, 'pop_hi', 0.35],
  [20.8, 'whoosh', 0.4], [21.2, 'pop', 0.35], [21.6, 'pop_hi', 0.35], [22.0, 'pop', 0.35], [22.4, 'pop_hi', 0.35], [22.8, 'pop', 0.35], [23.2, 'boing', 0.4],
  [24.0, 'whoosh', 0.4], [24.4, 'stamp', 0.45],
  [27.2, 'whoosh_down', 0.4], [28.0, 'ding', 0.35], [28.8, 'stamp', 0.4], [29.2, 'stamp', 0.4],
  [30.4, 'whoosh', 0.4], [30.8, 'pop', 0.4], [31.6, 'stamp', 0.55], [32.4, 'pop_hi', 0.4],
  [33.6, 'whoosh', 0.4], [33.9, 'stamp', 0.4], [34.2, 'boing', 0.4], [35.2, 'whoosh_short', 0.4], [35.4, 'stamp', 0.4], [36.0, 'pop', 0.35],
  [38.4, 'impact', 0.45],
  [39.6, 'whoosh', 0.4], [40.0, 'airhorn', 0.25], [40.4, 'whoosh_down', 0.4], [40.8, 'pop', 0.4], [41.6, 'stamp', 0.5], [42.2, 'pop_hi', 0.35], [43.0, 'ding', 0.3],
];

export const Video: React.FC<InviteProps> = (p) => (
  <AbsoluteFill style={{background: '#000'}}>
    {TIMELINE.map(({from, to, C}, i) => (
      <Sequence key={i} from={s(from)} durationInFrames={s(to) - s(from)} name={C.displayName ?? `S${i}`}>
        <C abs={s(from)} p={p} />
      </Sequence>
    ))}
    <Grain />
    {p.music ? <Audio src={staticFile(p.music)} volume={0.9} /> : null}
    {SFX.map(([t, n, v], i) => (
      <Sequence key={`sfx${i}`} from={s(t)} durationInFrames={s(2)}>
        <Audio src={staticFile(`sfx/${n}.wav`)} volume={v ?? 0.4} />
      </Sequence>
    ))}
  </AbsoluteFill>
);
