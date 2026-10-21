import {loadFont as loadShrikhand} from '@remotion/google-fonts/Shrikhand';
import {loadFont as loadBungee} from '@remotion/google-fonts/Bungee';
import {loadFont as loadAnton} from '@remotion/google-fonts/Anton';
import {loadFont as loadMarker} from '@remotion/google-fonts/PermanentMarker';
import {loadFont as loadModak} from '@remotion/google-fonts/Modak';
import {loadFont as loadMonoton} from '@remotion/google-fonts/Monoton';

export const FPS = 30;
export const W = 1080;
export const H = 1920;

/** seconds → frames */
export const s = (sec: number) => Math.round(sec * FPS);

/** Song beat grid (150 BPM). Video t=0 is a downbeat; beats every 0.4s, bars every 1.6s. */
export const BEAT = 0.4;
export const BAR = 1.6;

export const F = {
  shrikhand: loadShrikhand('normal', {weights: ['400'], subsets: ['latin']}).fontFamily,
  bungee: loadBungee('normal', {weights: ['400'], subsets: ['latin']}).fontFamily,
  anton: loadAnton('normal', {weights: ['400'], subsets: ['latin']}).fontFamily,
  marker: loadMarker('normal', {weights: ['400'], subsets: ['latin']}).fontFamily,
  modak: loadModak('normal', {weights: ['400'], subsets: ['latin', 'devanagari']}).fontFamily,
  monoton: loadMonoton('normal', {weights: ['400'], subsets: ['latin']}).fontFamily,
};

/** Desi pop maximalism palette */
export const C = {
  pink: '#FF2E88',
  hot: '#FF0F5B',
  marigold: '#FFB000',
  yellow: '#FFE600',
  orange: '#FF6B00',
  blue: '#1F4BFF',
  cyan: '#00D8FF',
  teal: '#00C2A8',
  lime: '#B6FF2E',
  green: '#00B84A',
  purple: '#7B2CFF',
  violet: '#4B0FA8',
  red: '#FF2A2A',
  cream: '#FFF4DC',
  ink: '#140A1F',
  white: '#FFFFFF',
};

export const CYCLE = [C.pink, C.yellow, C.blue, C.lime, C.orange, C.purple, C.cyan, C.red];
