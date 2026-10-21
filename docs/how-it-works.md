# How it works

The skill (`skills/desi-pop-motion/SKILL.md`) is a playbook Claude follows. It points Claude to a tested Remotion template and four reference guides, so every video comes out in the same style, synced to the music and checked before render.

```
photos ──► Atlabs MCP ──► 6–10 cartoon poses ──► background removal ──► public/char/*.png ─┐
song.mp3 ──► beatgrid.py (BPM, beats, drops) + transcribe.py (word timings) ──► slice ─────┤
facts (name, place, time…) ──► zod props (template fields) ───────────────────────────────┤
                                                                                          ▼
                                          Remotion scenes (kit + recipes, timed in beats)
                                                                                          │
                                          draft → contact sheets → fixes → full render ◄──┘
                                                                                          │
                                   ~/Downloads/*.mp4 (HQ + WhatsApp) · per-guest videos + cards
```

## 1. Characters
Claude uploads your photos to Atlabs and generates the poses with GPT Image 2.5, passing your photos as references. Every prompt repeats one fixed outfit description, so all the poses look like the same character. `rembg` then cuts each one out, and the scenes add a white die-cut sticker border.

## 2. Music → beat grid
- `tools/beatgrid.py` measures the tempo, the beat phase, the downbeats and the loudness jumps (the drops).
- `tools/transcribe.py` (Whisper) timestamps every sung word.

Claude picks the "main part" (usually the hook or chorus), cuts it with `tools/cut_music.sh` (optionally muffling the first beats so the drop bursts open), and expresses every scene boundary in **beats**. Changing the song is then mostly arithmetic.

Examples from the demos:
- **150 BPM**, ABCD-2 *Happy Birthday*: the drop at 14.4 s is where *HAPPY BDAY* slams in. The intro lyric *"tu, main, mera yaar, tere friends, teri GF, tera ex, teri GF ka ex"* became a guest list, one tape strip per word.
- **93 BPM**, *...Baby One More Time*: the HAAN button is clicked exactly on *"one more time"*.

## 3. Scenes
`template/src/kit.tsx` holds the reusable pieces:
- **Backgrounds:** sunburst, checker, stripes, halftone, grain
- **Decor:** bunting, marigold garlands, confetti, flashes
- **Elements:** character cutouts that bounce on the beat, Twemoji stickers that pop and boil, slam text, tape labels
- **Motion:** camera shake and beat-zoom

`references/style-guide.md` lists 14 proven scene recipes, plus layout rules for 9:16 safe areas and the copy voice: a Hinglish joke under every fact.

## 4. Review before render
Claude renders a half-res draft or stills, tiles frames into contact sheets (`tools/review.sh`) and looks at them. It's checking for clipped or overlapping text, dead space, and tags that appear too late. Then it fixes those and renders full resolution.

## 5. Delivery & personalisation
- **Main files:** an HQ MP4 and a WhatsApp-sized MP4 go to `~/Downloads`.
- **Per guest:** `tools/render-guests.mjs` renders the shared 40 s once, then only the personal ending for each guest. Each guest takes about 30 s and gets a video plus a still card.

## Customising the look
| Want | Change |
|---|---|
| New colours | `C` in `template/src/theme.ts` |
| New fonts | the `@remotion/google-fonts` imports in `theme.ts` |
| A new scene | copy a component in `scenes.tsx` / `thanks.tsx`, then add it to the timeline (`TIMELINE` / `TL`) |
| More stickers | download a Twemoji SVG by codepoint into `public/stickers/` |
| New SFX | edit `tools/gen_sfx.py` and re-run it |
| Different length | change the scene boundaries in beats, and the music slice |
