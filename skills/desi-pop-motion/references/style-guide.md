# Style guide: desi-pop maximalist collage

## Contents
1. The look in one paragraph
2. Code map
3. Palette, type, texture
4. Kit components (src/kit.tsx)
5. Scene recipes (proven, copy from the template)
6. Layout rules for 9:16
7. Copy voice
8. Motion rules

## 1. The look

The style is a cut-and-paste collage on loud backgrounds. A cartoon version of the person (thick ink outline, flat colour, white die-cut sticker border) bounces on the beat. Around them are Twemoji stickers that pop and "boil" (jitter at 7–8 fps like stop-motion), chunky extruded headlines that slam in, tape labels, marigold garlands, triangle bunting, confetti and a film-grain overlay. The backgrounds change every scene: sunburst rays, checkerboards, truck-art stripes, halftone dots and neon nights. It reads as Bollywood poster meets meme page meets truck art.

## 2. Code map (template/)

| file | what it holds |
|---|---|
| `src/theme.ts` | W/H/FPS (1080×1920, 30), `s(sec)` seconds→frames, `BEAT`, fonts via @remotion/google-fonts, palette `C`, `CYCLE` |
| `src/anim.ts` | `pop` (spring), `ease`, `clamp`, `rand` |
| `src/kit.tsx` | every reusable element (section 4) |
| `src/config.ts` | the zod props schema for the invite: names, address, time, photos, music. These are the template fields. |
| `src/scenes.tsx` + `src/Video.tsx` | 46s invite: 13 scenes, a `TIMELINE` in seconds, an `SFX` list, `PERSONAL_FROM` |
| `src/thanks.tsx` | 12s thank-you: 4 scenes, timed in beats with `b(n)`. This is the best starting point for any short video. |
| `src/Root.tsx` | registers `BdayInvite` and `ThankYou` |
| `public/stickers/*.svg` | about 85 Twemoji SVGs (CC-BY 4.0), keyed by name in `kit.tsx` `EMO`. Any codepoint filename also works. |
| `public/sfx/*.wav` | procedural SFX from `tools/gen_sfx.py`: whoosh, pop, stamp, impact, airhorn, scratch, boing, ding, cash, glitch, static |
| `public/char/*.png` | character cutouts (from Atlabs or placeholders) |

**More stickers:**
```bash
curl -sfL -o public/stickers/<cp>.svg https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.1.0/assets/svg/<cp>.svg
```
`<cp>` is the lowercase hex codepoint, for example `1f964` for 🥤.

**New composition:**
1. Copy `thanks.tsx` and rename it.
2. Edit the `TL` scene list, the `SFX` list and the props schema.
3. Register it in `Root.tsx`.

## 3. Palette, type, texture

**Palette (`C`):**

| token | hex |
|---|---|
| pink | `#FF2E88` |
| hot | `#FF0F5B` |
| marigold | `#FFB000` |
| yellow | `#FFE600` |
| orange | `#FF6B00` |
| blue | `#1F4BFF` |
| cyan | `#00D8FF` |
| lime | `#B6FF2E` |
| green | `#00B84A` |
| purple | `#7B2CFF` |
| violet | `#4B0FA8` |
| red | `#FF2A2A` |
| cream | `#FFF4DC` |
| ink | `#140A1F` (all outlines and shadows) |

Pair the backgrounds as two-tone bursts: pink/yellow, blue/cyan, lime/green, pink/hot, red/yellow, marigold/yellow.

**Fonts (`F`):**
- `shrikhand`: the hero display face. It runs wide, so size names with `min(210, 1240/len)`.
- `bungee`: signage, buttons and tags.
- `anton`: condensed list rows.
- `marker` (Permanent Marker): handwritten asides.
- `modak`: Devanagari, e.g. हैप्पी बर्थडे, धन्यवाद, आज मेरा.
- `monoton`: neon signs.

**Text treatment:**
- thick ink `WebkitTextStroke` with `paintOrder: stroke fill`
- an `extrude(color, depth)` block shadow
- slight rotation of ±2–5°

**Texture:** `<Grain/>` goes over everything, `<Halftone/>` sits over the backgrounds, and white sticker borders go on every cutout.

## 4. Kit components (src/kit.tsx)

Times passed to components are frames, local to their `<Sequence>`.

**Backgrounds:**
- `Burst a b speed rays cx cy`: rotating sunburst
- `Checker a b size rot drift`
- `Stripes a b w angle drift`: truck-art stripes
- `Halftone color size opacity`
- `Solid color`
- `Grain`

**Decor:**
- `Bunting y sag seed`: jhandi flags that sway
- `Marigolds xs len r`: hanging genda strings
- `Confetti at x y n seed power`
- `Flash at color dur`

**Elements:**
- `Cutout src at x y h from(bottom|left|right|top|pop) flip bounce absF beat out anchor(bottom|center) border`: a character or photo with a die-cut border. With `bounce`, it squashes on each beat (pass `absF={abs}` and `beat`).
- `Sticker k at x y size rot spin out`: a Twemoji that pops in and boils.
- `Slam at y size color stroke shadow depth font rot mode(slam|pop|up|left|right) width x out`: the hero text.
- `Tape at x y bg color size font rot from anchor`: a label strip with a hard shadow.
- `E k size`: an inline sticker inside text, e.g. `FOR COMING <E k="pray"/>`.

**Motion wrappers:**
- `Shake hits amp`: camera shake on hit frames
- `BeatZoom absStart amt beat`: zoom-punches every beat
- `beatIdx(absFrame, beat)`: flip a dancing character every beat with `flip={bi % 2 === 1}`
- `boil(f, seed, amp)`: stop-motion jitter

## 5. Scene recipes

| recipe | used for | template source |
|---|---|---|
| **Cold open "BREAKING"**: TV static, red tape "🚨 BREAKING 🚨", yellow sub-tape | the first 1s hook | `S0Cold` |
| **Lyric list gag**: stacked tape strips slide in on each sung word, the background colour changes per word, the character swaps per word (point_self → point_you → dance → shocked), then a "SAB INVITED!" stamp and a screen shake | any song with a list or call-and-response | `S1List` |
| **Real-photo reveal**: "kyunki…" + giant NAME + real photo cutout with a crown sticker on the head + an "(official photo 😏)" tape + "KA BIRTHDAY HAI!!!" with confetti | introduce the person | `S2Reveal` |
| **Loading bar + 3-2-1**: the bar fills to 99% with funny status rows ("Charging speakers… 37%"), then full-screen numbers on the last three beats before the drop | the build-up | `S3Loading` |
| **Drop**: white flash, HAPPY / BDAY!! on two beats, a dancing cutout that flips on each beat, marigolds, bunting, two confetti bursts, a Devanagari tape | the chorus hit | `S4Drop` |
| **Neon sign**: flickering Monoton words with glow, rotating light beams, a disco ball | venue or night vibe | `S5House` |
| **Menu / checklist**: white cards slide in one per beat with emoji, a label and a rotated value badge | rules, menu, agenda | `S6Menu` |
| **Clone dance**: three dancing copies flipping on alternate beats, with the background colour strobing per beat | high-energy middle | `S7Naach` |
| **Swag**: diagonal truck stripes, a red radial glow, a sunglasses glint, a "HORN OK PLEASE" sign | the attitude beat | `S8Bhai` |
| **Address / details**: KAHAN? / KAB? headers, a white address card with a pin dropping on it, a yellow time card, a marker joke, a rickshaw driving across | logistics | `S10Details` |
| **Personal card**: HEY {NAME}!, a polaroid holding the guest photo (or a 🥳 placeholder), a welcoming character, a "YOU'RE INVITED!" stamp, an info card | per-guest ending | `S12Invite` |
| **Morning after**: desaturated lavender, a sleeping character, floating Zzz, a typed "agli subah…" and an "11:47 AM" tape, with muffled music | quiet open before a drop | `T1Morning` |
| **Polaroid memories**: three polaroids of poses drop on beats with handwritten captions | recap or "hope you enjoyed" | `T3Memories` |
| **Runaway-NO poll**: "NEXT BHI AAOGE NA?" with HAAN / NAHI buttons. The cursor chases NAHI, which runs away twice ("nope!"), then the cursor clicks HAAN on a lyric hit, with confetti | a call to action people screenshot | `T4Next` |

## 6. Layout rules for 9:16 (1080×1920)

- **Safe text zone:** y 150–1750 and x 40–1040. Instagram and WhatsApp put the profile row at the top and the reply bar at the bottom.
- **Characters:** anchor them to the bottom edge (`y={H+30}`, `h` 800–1350), off-centre when text sits beside them.
- **Text over characters:** stack text in the top half. Text strips may overlap a character's body; that collage overlap is the style. They must never cover the face.
- **Long strings:** wrap or size them down. Check `TERI GF KA EX`-length strings at their final size. Anything over about 12 characters in Shrikhand at 200px clips.
- **Dead space:** fill empty quadrants with 1–2 stickers or a small secondary cutout. Empty bands of 400px or more look unfinished.

## 7. Copy voice

- **Default voice:** Gen-Z Hinglish, punchy, self-roasting and warm. Pair every fact with a joke:
  - "8 PM ONWARDS" + *pehle aa gaye toh bhi chalega*
  - "DRESS CODE: KAPDE" + *(haan, seriously)*
  - "ATTENDANCE: COMPULSORY!!" + *no excuses accepted*
- **Lyrics:** borrow the song's own words where they land, e.g. "tera ex 💀", or the **one more time** HAAN click.
- **Family-friendly mode:**
  - menu: cold drink, biryani, cake, music, antakshari, games
  - subtitle: "(100% mummy approved)"
  - no alcohol, smoking or weed props anywhere
- **Facts:** put them in props, never in hardcoded strings, so a template edit is a one-line change.

## 8. Motion rules

- **Timing:** every entrance lands on a beat or a sung word. Use one hero slam per beat, and add a sticker on the off-beats.
- **Backgrounds:** change on scene cuts (on bar lines). Within a scene, move them (burst rotation, drift) without changing them.
- **SFX:** pop or pop_hi on stickers and tapes, stamp on stamps, impact plus airhorn on the drop (airhorn suits desi songs, not Western pop), whoosh on cuts, boing on comedic beats. Keep SFX at 0.25–0.5 volume under the music.
- **Flashes:** one white or colour `Flash` per drop, no more.
