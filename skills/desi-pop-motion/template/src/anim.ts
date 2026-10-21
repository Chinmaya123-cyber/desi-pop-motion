import {Easing, interpolate, spring} from 'remotion';
import {FPS} from './theme';

export const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/** Springy 0→1 (with overshoot) starting at frame `start`. */
export const pop = (f: number, start: number, cfg: {damping?: number; stiffness?: number; mass?: number} = {}) =>
  spring({frame: f - start, fps: FPS, config: {damping: cfg.damping ?? 13, stiffness: cfg.stiffness ?? 190, mass: cfg.mass ?? 0.9}});

/** Smooth 0→1 without overshoot. */
export const ease = (f: number, start: number, dur: number, e: (t: number) => number = Easing.bezier(0.2, 0.8, 0.2, 1)) =>
  interpolate(f, [start, start + dur], [0, 1], {...clamp, easing: e});

export const easeIn = Easing.bezier(0.6, 0, 0.9, 0.4);
export const easeOut = Easing.bezier(0.1, 0.9, 0.2, 1);

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Velocity (units/frame) of an animated value, for motion blur. */
export const vel = (fn: (f: number) => number, f: number) => fn(f) - fn(f - 1);

/** Deterministic pseudo-random. */
export const rand = (seed: number) => {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

/** Idle blink: returns 0..1 closed amount, blinking every ~`every` frames. */
export const blinkAt = (f: number, every = 150, offset = 0) => {
  const p = (f + offset) % every;
  return p < 4 ? p / 4 : p < 8 ? 1 - (p - 4) / 4 : 0;
};
