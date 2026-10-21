---
name: desi-pop-motion
description: Make short vertical (9:16) motion-graphics videos in a funky desi-pop maximalist collage style, built with Remotion and AI cartoon characters from the Atlabs MCP. The look is sunburst backgrounds, die-cut sticker cutouts, chunky extruded type, marigold garlands, bunting, confetti, Hinglish Gen-Z jokes and beat-synced cuts. Use it for party or birthday invites, personalised per-guest invites, thank-you videos, wedding or event announcements, festival greetings, farewell videos, "save the date" reels and Instagram/WhatsApp story videos. Also use it when someone shares photos of a person plus a song and wants a "cool edit", "motion graphics video", "collage animation", a "Gen-Z funny video" or "something like that invite video". Requires the Atlabs MCP server for character art; this skill explains how to connect it.
---

# Desi-pop motion graphics videos

This skill turns a person's photos plus a song into a 10–50s vertical video in one consistent style: a cartoon version of the person (made with the Atlabs MCP), stickers, chunky type and cuts locked to the music's beat. `template/` is a complete, tested Remotion project. It contains a 46s house-party invite with a personalised per-guest ending, and an 11–12s "thank you for coming" video. Copy it and adapt it rather than starting from zero.

## 0. Connect the Atlabs MCP first (needed for the character art)

The cartoon character is what makes these videos personal, and it's generated through the **Atlabs MCP** ("Atlabs MiniTools"). Before anything else, check whether Atlabs tools are available. They are named like `mcp__atlabs__generate_image` or `mcp__<id>__generate_image` and are often deferred, so search with ToolSearch for `atlabs generate_image start_upload get_result`.

If they're missing, stop and tell the user, plainly and up front:

> To make the cartoon version of you I need the **Atlabs MCP** connected. It takes about a minute:
> - **Claude Code, installed as the plugin:** Atlabs is already bundled. Run `/mcp`, pick **atlabs** and sign in.
> - **Claude Code (terminal), manual install:** run `claude mcp add --transport http atlabs https://mcp.atlabs.ai/mcp`, then type `/mcp` in a Claude Code session, pick **atlabs** and sign in with your Atlabs account.
> - **Claude Desktop / claude.ai:** Settings → Connectors → **Add custom connector** → name `Atlabs`, URL `https://mcp.atlabs.ai/mcp` → **Add** → **Connect** and sign in with your Atlabs account. Then enable it for this chat (the tools/"+" menu).
> - No Atlabs account yet? Sign up at https://app.atlabs.ai. Image generation uses Atlabs credits (about 0.8 credits per character pose).

Check the connection with `get_account`, which returns the credit balance. Full details, including the character prompts, are in `references/atlabs-mcp.md`.

If the user can't connect it right now, you can still build the whole video. Run `tools/placeholder_chars.py` to get labelled stand-in figures, then swap in the real cutouts later; the filenames stay the same. Say clearly that the placeholders are temporary.

## 1. Get the brief (ask only what you can't infer)

You need:
- **Who** the video is about and the name to show. Use the name the user gives. Don't take it from an email or account; in this session the account holder and the birthday person were different people.
- **Photos:** one clear face photo, plus any others.
- **The song file:** an mp3 the user provides. Don't download copyrighted music yourself.
- **Purpose and must-say facts:** what, where, when, address, dress code, and so on.

Make sensible assumptions and state them, rather than blocking. In the original session, "8 am onwards" for a house party was assumed to mean 8 PM, and the user was told. Never invent facts like a party date. Make them template fields and leave them hidden until the user supplies them.

**Content tone:** default to the user's words. If they mention drinking or smoking, keep it cartoonish. Offer, or switch at once to, a **family-friendly** version when asked: that means removing alcohol, cigarettes and weed from the copy, the stickers and the character props. Use Atlabs image edit (`nano_banana_pro` with the pose as reference) to swap props, for example a mocktail or a party popper.

## 2. Scaffold

The template folder sits next to this SKILL.md. Use the base directory shown when the skill loads: it's `~/.claude/skills/desi-pop-motion` for a manual install, and inside `~/.claude/plugins/…` when installed as a plugin.

```bash
cp -R <this skill's base directory>/template <project-dir> && cd <project-dir>
npm install
uv venv -q --python 3.12 .venv && uv pip install --python .venv/bin/python numpy scipy pillow faster-whisper "rembg[cpu]" onnxruntime
.venv/bin/python tools/placeholder_chars.py   # stand-ins so it renders immediately
```

If `uv` isn't installed, use `python3.12 -m venv .venv`. Python 3.14's ensurepip has failed here. Put the user's files in `refs/` and run every Python tool with `-I`. The code map is in `references/style-guide.md`.

## 3. Characters (Atlabs MCP)

1. Upload the photos with `start_upload`, then `curl -X PUT --upload-file … "<upload_url>"`. The PUT's JSON response contains the `media_id`.
2. Generate 6–10 poses with `generate_image`, model `gpt_image_2_5_flare`, aspect `2:3` (or `1:1` for wide poses), `reference_media_ids=[photos…]`. Use **one fixed outfit description** in every prompt so the poses look like the same character. The proven prompt template and pose list are in `references/atlabs-mcp.md`. Submit them all at once; they finish in under a minute.
3. Fetch each one with `get_result` and download it with `curl -sL -o refs/gen/<pose>.jpg <url>`. Contact-sheet them with ffmpeg `xstack` and look at the sheet before going on.
4. Cut out the backgrounds locally: `.venv/bin/python -I tools/cutout.py isnet-general-use public/char refs/gen/*.jpg`. For real photos, use `u2net_human_seg` and crop to head and shoulders first.
5. Tell the user the model and the credits spent.

## 4. Music → beat grid → timeline

The edit feels professional because every cut, slam and sticker lands on the beat. Follow `references/music-sync.md`:
- `tools/beatgrid.py` gives BPM, beat phase, downbeats and drop candidates. `tools/transcribe.py` gives word-timed lyrics.
- Pick the **main part**: the hook or chorus, or the drop. Look for a lyric that matches the message. In this session, "tu, main, tera dost, teri GF, tera ex…" became a guest-list gag, and "hit me baby **one more time**" landed on the "next bhi aaoge? HAAN" click.
- Cut it with `tools/cut_music.sh`. The optional muffled intro gives a quiet open (for example "agli subah…") that bursts into the drop.
- Express scene boundaries in beats (`b(n) = n * 60/BPM`) so re-timing to a new song is mechanical.

## 5. Build the scenes

Read `references/style-guide.md` for the look, the kit components and the scene recipes. In short:
- 1080×1920, 30fps. Keep key text within y 150–1750 so the WhatsApp/Instagram UI doesn't cover it.
- Change the background every scene: sunburst, checker, stripes, halftone or neon. Give every scene a character cutout and 3–6 stickers that pop in on beats. Use one hero text slam per beat.
- Write the copy in the user's voice. For desi Gen-Z that means short Hinglish punchlines with a joke under each fact, e.g. "8 PM onwards / *pehle aa gaye toh bhi chalega*".
- Put changeable facts (name, date, address, guest name, photo, music) in the zod props schema so the video works as a template.

## 6. Review before the full render

- Render stills at `--scale=0.25` for key frames, or a `--scale=0.5` draft, then make a contact sheet with `tools/review.sh <video> <prefix> t1 t2 …` and **look at it**. Check for clipped text at the edges (Shrikhand runs wide, so size names by length), overlaps between stamps and cards, empty dead zones, and wrapping.
- Fix, then render full resolution. Run renders in the foreground with a long timeout, because background renders have been killed mid-way.

## 7. Render, deliver, iterate

Follow `references/render-deliver.md`:
- **Encodes:** HQ at CRF 20, a WhatsApp version at about 3.2 Mbps (~20 MB for 45s), and a 720p copy under 15 MB if you publish an Artifact player.
- **Where to save:** put the final files straight into `~/Downloads` with clear names, reveal them in Finder and send them as attachments. **Artifact pages block downloads**, so never rely on an artifact for the user to get the file.
- **Per-guest personalisation:** `node tools/render-guests.mjs` renders the shared part once and only the personal ending per guest, then outputs `<name>.mp4` plus a still `.png` card.
- **Copyright:** mention it once. A famous song in the video is fine on WhatsApp, but Instagram may mute it. If that happens, upload the video silent and add the track from Instagram's music library.
- **Feedback:** expect quick rounds of changes (swap a photo, rename, remove a line, family-friendly, new song). Make each edit surgically, re-render, re-check the changed frames, and re-deliver to the same filenames.

## Gotchas from real runs

- Remotion's bundled headless shell crashed on macOS ("icudtl.dat not found in bundle"). The template's `remotion.config.ts` switches to installed Google Chrome automatically. Concurrency 8 at full res crashed on a 16 GB Mac, so use 6.
- faster-whisper fails on audio file paths because of a PyAV mismatch. `tools/transcribe.py` passes a numpy array instead.
- Hinglish lyrics transcribe best with `--lang en` plus a `--prompt` of the words you expect. Snap the timings to the beat grid.
- Use the bundled Twemoji SVG stickers (`public/stickers`, keyed in `kit.tsx` `EMO`), not system emoji in text. System emoji render inconsistently, and text emoji wrap badly.
- Quoting the user's real photo as an "(official photo 😏)" sticker reliably gets laughs. Keep real photos to one or two reveals and use the cartoon everywhere else.
