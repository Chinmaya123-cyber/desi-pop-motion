#!/usr/bin/env node
/**
 * Render one personalised invite per guest.
 *
 *   node tools/render-guests.mjs                 # everyone in guests.json
 *   node tools/render-guests.mjs --only "Rahul"  # one guest
 *   node tools/render-guests.mjs --fresh         # re-render the shared part too
 *
 * The first 39.6s are the same for every guest, so they are rendered once and cached.
 * Only the final personal card (6.8s) is rendered per guest, then stitched + mixed.
 * Output: out/guests/<name>.mp4 (WhatsApp/Insta ready) and out/guests/<name>.png (still card).
 */
import {bundle} from '@remotion/bundler';
import {renderMedia, renderStill, selectComposition} from '@remotion/renderer';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'out', 'guests');
const CACHE = path.join(ROOT, 'out', 'cache');
fs.mkdirSync(OUT, {recursive: true});
fs.mkdirSync(CACHE, {recursive: true});

const args = process.argv.slice(2);
const only = args.includes('--only') ? args[args.indexOf('--only') + 1] : null;
const fresh = args.includes('--fresh');
const noStill = args.includes('--no-still');

const cfg = JSON.parse(fs.readFileSync(path.join(ROOT, 'guests.json'), 'utf8'));
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const browserExecutable = fs.existsSync(CHROME) ? CHROME : null;
const PERSONAL_FROM = Math.round(39.6 * 30);

const slug = (n) => n.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'guest';

/** Copy a guest photo into public/guests if it lives elsewhere. Returns the public-relative path. */
const preparePhoto = (photo, name) => {
  if (!photo) return '';
  if (!path.isAbsolute(photo) && fs.existsSync(path.join(ROOT, 'public', photo))) return photo;
  const src = path.isAbsolute(photo) ? photo : path.resolve(ROOT, photo);
  if (!fs.existsSync(src)) {
    console.warn(`  ! photo not found for ${name}: ${photo} (using placeholder)`);
    return '';
  }
  const rel = `guests/${slug(name)}${path.extname(src).toLowerCase() || '.jpg'}`;
  fs.copyFileSync(src, path.join(ROOT, 'public', rel));
  return rel;
};

const ff = (a) => execFileSync('ffmpeg', ['-v', 'error', '-y', ...a], {stdio: 'inherit'});

console.log('Bundling…');
const serveUrl = await bundle({entryPoint: path.join(ROOT, 'src', 'index.ts')});
const party = cfg.party ?? {};
const baseProps = (guest) => ({
  guestName: 'YOU', guestPhoto: '', host: 'YOUR NAME', date: '', time: '8 PM ONWARDS',
  timeJoke: 'pehle aa gaye toh bhi chalega', addressLine1: 'YOUR BUILDING', addressLine2: 'FLAT · TOWER', hostPhoto: 'img/host_photo.png', music: '',
  ...party, ...guest,
});
const common = {serveUrl, browserExecutable, chromiumOptions: {gl: 'angle'}, concurrency: 6, imageFormat: 'jpeg', jpegQuality: 95};

// 1) shared part (cached by party settings)
const key = createHash('md5').update(JSON.stringify(party)).digest('hex').slice(0, 8);
const shared = path.join(CACHE, `shared_${key}.mp4`);
const audio = path.join(CACHE, `audio_${key}.wav`);
const comp0 = await selectComposition({...common, id: 'BdayInvite', inputProps: baseProps({})});
if (fresh || !fs.existsSync(shared)) {
  console.log('Rendering shared part (once)…');
  await renderMedia({...common, composition: comp0, inputProps: baseProps({}), codec: 'h264', crf: 17, muted: true,
    frameRange: [0, PERSONAL_FROM - 1], outputLocation: shared,
    onProgress: ({progress}) => process.stdout.write(`\r  ${(progress * 100).toFixed(0)}%   `)});
  console.log('');
}
if (fresh || !fs.existsSync(audio)) {
  await renderMedia({...common, composition: comp0, inputProps: baseProps({}), codec: 'wav', outputLocation: audio});
}

// 2) per guest
const guests = (cfg.guests ?? []).filter((g) => !only || g.name.toLowerCase() === only.toLowerCase());
for (const g of guests) {
  const name = g.name.trim();
  const props = baseProps({guestName: name.toUpperCase(), guestPhoto: preparePhoto(g.photo, name)});
  const id = slug(name);
  console.log(`→ ${name}`);
  const comp = await selectComposition({...common, id: 'BdayInvite', inputProps: props});
  const end = path.join(CACHE, `end_${id}.mp4`);
  await renderMedia({...common, composition: comp, inputProps: props, codec: 'h264', crf: 17, muted: true,
    frameRange: [PERSONAL_FROM, comp.durationInFrames - 1], outputLocation: end});
  const list = path.join(CACHE, `list_${id}.txt`);
  fs.writeFileSync(list, `file '${shared}'\nfile '${end}'\n`);
  const joined = path.join(CACHE, `joined_${id}.mp4`);
  ff(['-f', 'concat', '-safe', '0', '-i', list, '-c', 'copy', joined]);
  ff(['-i', joined, '-i', audio, '-map', '0:v', '-map', '1:a', '-c:v', 'libx264', '-preset', 'medium', '-b:v', '3500k', '-maxrate', '5000k', '-bufsize', '10000k', '-pix_fmt', 'yuv420p', '-af', 'loudnorm=I=-14:TP=-1.2', '-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart', path.join(OUT, `${id}.mp4`)]);
  if (!noStill) {
    const {jpegQuality: _q, imageFormat: _f, ...stillOpts} = common;
    await renderStill({...stillOpts, composition: comp, inputProps: props, frame: comp.durationInFrames - 20, output: path.join(OUT, `${id}.png`), imageFormat: 'png'});
  }
  console.log(`  ✓ out/guests/${id}.mp4`);
}
console.log('Done.');
