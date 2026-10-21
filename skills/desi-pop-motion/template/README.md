# Desi-pop motion video template

This is a Remotion project for 1080×1920, 30fps vertical videos in a funky desi-pop collage style. It comes from the `desi-pop-motion` skill, and that skill's `SKILL.md` and `references/` cover the full workflow.

## Quick start

```bash
npm install
uv venv -q --python 3.12 .venv && uv pip install --python .venv/bin/python numpy scipy pillow faster-whisper "rembg[cpu]" onnxruntime
.venv/bin/python tools/placeholder_chars.py      # stand-in characters until the Atlabs art is ready
npm run studio                                   # live preview
```

Two compositions are included:
- `BdayInvite`: a 46s party invite with a personalised guest ending.
- `ThankYou`: a 12s "thank you for coming" video.

## Tools

| tool | use |
|---|---|
| `tools/beatgrid.py <song>` | BPM, beat phase, downbeats, drops and a loudness map |
| `tools/transcribe.py <song>` | word-timed lyrics |
| `tools/cut_music.sh <song> <start> <len> <out.wav> [muffle]` | music slice, with an optional muffled intro |
| `tools/cutout.py <model> <outdir> <imgs…>` | background removal: `isnet-general-use` for cartoons, `u2net_human_seg` for photos |
| `tools/review.sh <video> <prefix> t1 t2 …` | contact sheets of frames for review |
| `tools/render-guests.mjs` | one personalised invite per guest in `guests.json` |
| `tools/gen_sfx.py` | regenerate the procedural SFX kit |
| `tools/placeholder_chars.py` | labelled stand-in cutouts |

The character art comes from the **Atlabs MCP** (`https://mcp.atlabs.ai/mcp`). See the skill's `references/atlabs-mcp.md` for how to connect it and for the prompts.

Stickers are [Twemoji](https://github.com/jdecked/twemoji) (CC-BY 4.0).
