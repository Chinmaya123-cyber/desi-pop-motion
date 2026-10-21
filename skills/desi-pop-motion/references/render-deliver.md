# Review, render, deliver

## Review loop (before any full-res render)

**Draft:**
```bash
npx remotion render src/index.ts <Comp> out/draft.mp4 --scale=0.5 --crf=23   # ~2.5 min for 46s
tools/review.sh out/draft.mp4 d 0.4 1.5 2.5 4 5.5 ...                     # 10 frames per sheet → out/review/d0.jpg
```
- Then **Read** the sheets and look.
- For a single frame: `npx remotion still src/index.ts <Comp> out/x.jpg --frame=N --scale=0.25`.
- Frames sampled mid-animation look odd (half-slammed text, falling polaroids), so judge the settled frames.

**Fix list to check every time:**
- text clipped at the left or right edge
- unexpected wrapping
- stamps covering cards or faces
- empty quadrants
- a sticker hiding a key word
- long-running tags that only appear in the last 0.2s of a scene

## Full render

```bash
npx remotion render src/index.ts <Comp> out/raw.mp4 --crf=17 --concurrency=6
```
- Run it in the **foreground** with a long timeout (up to 10 min). Backgrounded renders have died silently mid-way.
- On macOS, `remotion.config.ts` uses installed Google Chrome, because the bundled headless shell crashed with "icudtl.dat not found".
- "Visited … but got no response" is a transient Chrome hiccup: re-run, and check the output's timestamp before trusting it.

**Encodes:**
```bash
# HQ
ffmpeg -i out/raw.mp4 -c:v libx264 -preset slow -crf 20 -pix_fmt yuv420p -af loudnorm=I=-14:TP=-1.2 -c:a aac -b:a 256k -movflags +faststart ~/Downloads/<Name>_HQ.mp4
# WhatsApp / share (~20 MB per 45 s)
ffmpeg -i out/raw.mp4 -c:v libx264 -preset slow -b:v 3200k -maxrate 4500k -bufsize 9000k -pix_fmt yuv420p -af loudnorm=I=-14:TP=-1.2 -c:a aac -b:a 160k -movflags +faststart ~/Downloads/<Name>.mp4
# Artifact player copy (<15 MB per file)
ffmpeg -i ~/Downloads/<Name>.mp4 -c:v libx264 -preset slow -b:v 2100k -maxrate 3000k -bufsize 6000k -vf scale=720:1280 -c:a aac -b:a 128k -movflags +faststart artifact/video.mp4
```

## Delivering

- **Where to save:** put the finished files directly in `~/Downloads` with clear names (`<Person>_Bday_Invite.mp4`, `<Person>_Thank_You.mp4`). Reveal them in Finder (`reveal_path`) and send them with SendUserFile using `display: "attach"`.
- **Artifact player:** a page with a phone-frame `<video>`, tabs for each version and a party-details card is a nice way to watch. Videos and posters go in as `files`. **Viewers can't download from an artifact** (the sandbox blocks it), so always deliver the mp4 files separately. Republish to the same file path to keep the URL.
- **On each change:** re-render, re-encode, and overwrite the same Downloads filenames and artifact files.
- **Copyright note** (say it once): WhatsApp is fine. Instagram may mute a copyrighted track, in which case post the video silent and add the song from Instagram's music library.

## Per-guest personalisation

1. Fill in `guests.json`:
   - `party`: the shared props (host, date, time, address, hostPhoto, music)
   - `guests`: a list of `{name, photo}`, where photo is an absolute path anywhere on disk
2. Run:
   ```bash
   node tools/render-guests.mjs            # all guests
   node tools/render-guests.mjs --only Rahul
   node tools/render-guests.mjs --fresh    # after changing party props or any scene
   ```

How it works:
- It renders frames `0..PERSONAL_FROM-1` once (cached by a hash of `party`) and the audio once.
- Per guest it renders only the personal ending, concatenates the two with `-c copy`, then mixes and encodes.
- Output is `out/guests/<slug>.mp4` (about 30s per guest) plus a `<slug>.png` still card.
- Add `{"name": "YOU", "photo": ""}` to get the generic version from the same pass.
- If you change where the personal part starts, update the `39.6` in `PERSONAL_FROM` in both `Video.tsx` and `render-guests.mjs`.
