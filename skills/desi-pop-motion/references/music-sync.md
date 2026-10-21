# Music sync: from an mp3 to a beat-locked timeline

The user supplies the song as an mp3, usually ripped from YouTube; copy it into `refs/`. Never download copyrighted music yourself. If they ask "which song?", suggest a few famous tracks whose hook fits the message:
- "Abhi Toh Party Shuru Hui Hai": party
- "Phir Milenge Chalte Chalte": see you again
- "One More Time" (Daft Punk) or "...Baby One More Time": come again
- "Gallan Goodiyaan": friends and family

Let them provide the file.

## 1. Read the song

```bash
.venv/bin/python -I tools/beatgrid.py refs/song.mp3              # whole song
.venv/bin/python -I tools/beatgrid.py refs/song.mp3 --from 55 --to 85
.venv/bin/python -I tools/transcribe.py refs/song.mp3 --lang en --to 100 [--prompt "expected words"]
```

From these, find:
- **Structure:** in the loudness bars, the intro is low, the chorus is high and steady, and a **breakdown is a short dip of 2–3s before a drop**. "Official video" rips often have 15–30s of non-music at the start, so skip it.
- **Tempo:** take the reported BPM. Check the octave alternatives against what you hear in the numbers: dance tracks are usually 115–155, ballads 70–100. In real runs: ABCD-2 "Happy Birthday" is 150, "One More Time" 123.06, "...Baby One More Time" 93.02.
- **Grid:** `beat = 60/BPM`, phase `first + k*beat`, and downbeats every 4 beats. Treat the strongest onset at the drop as a downbeat.
- **Lyric hits:** the words worth a visual. Whisper timings are about ±0.15s, so snap each to the nearest beat.

## 2. Choose the slice ("the main part")

Pick the 10–50s that carries the hook. Then align it:
1. Decide the video time where the big visual hit happens, e.g. the THANK YOU drop at 1.9–2.4s.
2. Set `start = song_time_of_hit − video_time_of_hit`, rounded so `start` is a beat.
3. Put the CTA moment on the best lyric, e.g. a HAAN click on "one more time", or a final card on chorus 2.

Patterns that worked:
- **Long invite (46s):** intro gag → build → drop at 14.4s → chorus scenes → verse for details → chorus 2 for the personal card. Fade out the last 1.2s.
- **Short (10–12s):** a muffled 2–3 beat open → drop → 2 scenes → CTA on the hook word. 15–20 beats total.

```bash
tools/cut_music.sh refs/song.mp3 <start> <length> public/audio/song_cut.wav [muffle_seconds]
```
`muffle_seconds` low-passes the opening, which reads as "sleepy / next morning / waiting", then opens up at the drop. Use it when the slice has no natural breakdown.

## 3. Timeline in beats

In the composition:
```ts
const B = 60 / 93.02;            // beat length from beatgrid
const b = (n: number) => n * B;  // beats → seconds
const TL = [{from: 0, to: b(3), C: Open}, {from: b(3), to: b(8), C: Drop}, ...];
export const DURATION = s(19 * B);
```
- Times inside a scene are `s(b(1))`, `s(b(1.5))` and so on. Off-beats (x.5) are good for secondary stickers.
- Pass `beat={B}` to `BeatZoom` and to bouncing `Cutout`s, and `beatIdx(abs + f, B)` for the dance flips. They default to the template's 150 BPM.
- **Re-timing to a new song:** change `B`, the slice and the beat counts per scene, and keep the scene code. Then move any hit that was tied to a lyric word.

## 4. SFX and mix

- **SFX list:** `[timeSec, 'name', volume]`. Volumes are 0.25–0.5; the song plays at 0.9.
- **Final encode:** apply `loudnorm=I=-14:TP=-1.2`. This is where the levels get finished; the composition itself isn't normalised.
- **Airhorn:** use it only on desi/Bollywood drops.
- **Western-pop drops:** use impact + pop instead.
