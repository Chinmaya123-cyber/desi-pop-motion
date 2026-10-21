<div align="center">

# 🎉 desi-pop-motion

**A Claude skill that turns a few photos and a song into a funky desi-pop motion-graphics video.**

Party invites · personalised guest invites · thank-you videos · event & festival reels · Instagram/WhatsApp stories

<img src="examples/01-birthday-invite/preview-intro.gif" width="200" alt="Guest-list lyric gag"> <img src="examples/01-birthday-invite/preview-drop.gif" width="200" alt="Happy bday drop"> <img src="examples/01-birthday-invite/preview-personal-card.gif" width="200" alt="Personalised guest card"> <img src="examples/02-thank-you/preview.gif" width="200" alt="Thank-you video">

*Made entirely by Claude with this skill: Remotion code, AI cartoon characters via the [Atlabs MCP](https://app.atlabs.ai), and cuts synced to the music's beat.*

</div>

---

## What it makes

Sunburst backgrounds, die-cut sticker cutouts, chunky extruded type, marigold garlands, jhandi bunting, confetti, film grain and Hinglish Gen-Z punchlines, all cut to the beat of a song you choose. The star is a **cartoon version of your person**, generated from their photos in a consistent pop-art style across 6–10 poses.

| | |
|---|---|
| **Format** | 1080×1920 vertical, 30 fps, 10–50 s, H.264 MP4 (WhatsApp-ready ~20 MB + HQ) |
| **Input** | 1–2 photos of the person, a song mp3, the facts (name, place, time…) |
| **Output** | Finished video(s) in `~/Downloads`, plus one personalised version per guest if you want |
| **Under the hood** | [Remotion](https://remotion.dev) (React → video), Atlabs MCP for character art, Python tools for beat-grid / lyrics / cut-outs |

## Examples

| | Example | What it shows |
|---|---|---|
| <img src="examples/01-birthday-invite/still-drop.jpg" width="140"> | **[01 · Birthday house-party invite](examples/01-birthday-invite/)** (46 s) | Lyric-synced guest-list gag, real-photo reveal, loading bar + 3-2-1 countdown, the drop, neon house party, menu, dance clones, address card, **personalised "HEY {NAME}!" ending per guest** |
| <img src="examples/02-thank-you/preview.gif" width="140"> | **[02 · Thank you for coming](examples/02-thank-you/)** (12 s) | Muffled "agli subah…" morning-after open, beat-drop THANK YOU, polaroid memories, runaway-NO "next bhi aaoge?" poll clicked on *"one more time"* |

▶️ Full videos (with music): [invite.mp4](examples/01-birthday-invite/invite.mp4) · [invite-personalised-demo.mp4](examples/01-birthday-invite/invite-personalised-demo.mp4) · [thank-you.mp4](examples/02-thank-you/thank-you.mp4)

---

## Install

You need **two things**: the skill, and the **Atlabs MCP** connected (that's what draws the cartoon characters).

### Option A: Claude Code plugin (recommended, includes the Atlabs MCP)

```text
/plugin marketplace add Chinmaya123-cyber/desi-pop-motion
/plugin install desi-pop-motion@desi-pop-motion
```
Restart Claude Code, run `/mcp`, choose **atlabs** → **Authenticate**, and sign in with your Atlabs account. Done: the plugin ships the Atlabs server config, so there's nothing else to add.

### Option B: Claude Code, manual

```bash
git clone https://github.com/Chinmaya123-cyber/desi-pop-motion.git
cp -R desi-pop-motion/skills/desi-pop-motion ~/.claude/skills/
claude mcp add --transport http --scope user atlabs https://mcp.atlabs.ai/mcp
```
Then in Claude Code: `/mcp` → **atlabs** → **Authenticate**.

### Option C: Claude Desktop app / claude.ai

1. Download **`desi-pop-motion.skill`** from the [latest release](https://github.com/Chinmaya123-cyber/desi-pop-motion/releases/latest).
2. Open it in Claude, or go to **Settings → Capabilities → Skills → Upload skill**.
3. Add the Atlabs connector: **Settings → Connectors → Add custom connector** → Name `Atlabs`, URL `https://mcp.atlabs.ai/mcp` → **Add** → **Connect** and sign in.
4. In a chat, make sure both the skill and the Atlabs connector are enabled (the "+" / tools menu).

> Rendering video needs a computer, not a phone: the skill runs Node + Python locally. It works in Claude Code and in the Claude Desktop app's Code tab. See [docs/installation.md](docs/installation.md) for prerequisites (Node 18+, Python 3.12, ffmpeg, Google Chrome).

### Atlabs account & credits

Sign up at **[app.atlabs.ai](https://app.atlabs.ai)**. Each cartoon pose costs about **0.8 credits** (GPT Image 2.5), and a prop edit about 2.5 credits, so a full video's character set is typically **5–10 credits**. Full setup and troubleshooting are in [docs/atlabs-mcp.md](docs/atlabs-mcp.md).

---

## Use it

Just ask Claude in plain language, attach photos and an mp3:

```text
Make a funky desi-pop motion graphics birthday invite for my house party.
This is me [2 photos]. Use the main part of this song [song.mp3].
Address: Carlton Estate 4, Tower C, C-65. 8 PM onwards. Gen-Z funny vibe.
At the end, a personalised card for each guest with their photo.
```

```text
Party's over — make a 10-second "thank you for coming, hope you enjoyed last night,
next bhi aaoge?" video in the same style with this song [song.mp3]
```

More prompts (wedding, Diwali, farewell, launch, save-the-date) in **[docs/example-prompts.md](docs/example-prompts.md)**.

### What Claude does

1. **Checks the Atlabs MCP** is connected, and tells you how to connect it if not.
2. **Asks only what it can't infer**: name to show, the facts, family-friendly or not.
3. **Generates your cartoon** in 6–10 poses from your photos (consistent outfit), and cuts out the backgrounds.
4. **Reads the song**: BPM, beat grid, drops and word-timed lyrics. It then picks the hook and aligns the big moments to it.
5. **Builds the scenes** in Remotion from a tested kit and recipes, and reviews contact sheets of frames to fix clipped or overlapping text.
6. **Renders** an HQ file and a WhatsApp-sized file to `~/Downloads`, plus one video and still card per guest if requested.
7. **Iterates** on your feedback: swap a photo, rename, drop a line, make it family-friendly, change the song.

Deep dive: **[docs/how-it-works.md](docs/how-it-works.md)**.

---

## Repo layout

```
desi-pop-motion/
├── .claude-plugin/            # plugin.json + marketplace.json (Claude Code plugin install)
├── .mcp.json                  # bundles the Atlabs MCP server with the plugin
├── skills/
│   └── desi-pop-motion/
│       ├── SKILL.md           # the instructions Claude follows
│       ├── references/        # atlabs-mcp · style-guide · music-sync · render-deliver
│       └── template/          # complete Remotion project (2 example compositions + tools)
│           ├── src/           # kit.tsx (components), scenes.tsx, thanks.tsx, theme.ts …
│           ├── tools/         # beatgrid.py, transcribe.py, cut_music.sh, cutout.py, render-guests.mjs …
│           └── public/        # 85 Twemoji stickers, procedural SFX, grain textures
├── examples/
│   ├── 01-birthday-invite/    # videos, GIF previews, character sheet, breakdown
│   └── 02-thank-you/
└── docs/                      # installation, Atlabs MCP, how it works, example prompts
```

Try the template without Claude (placeholder characters, no music):

```bash
cp -R skills/desi-pop-motion/template my-video && cd my-video
npm install && python3 -m venv .venv && .venv/bin/pip install pillow
.venv/bin/python tools/placeholder_chars.py
npm run studio        # opens Remotion Studio: pick BdayInvite or ThankYou
```

---

## Credits & licence

- Code, skill and docs: **MIT** (see [LICENSE](LICENSE)).
- Stickers: [Twemoji](https://github.com/jdecked/twemoji) by Twitter/X and contributors, **CC-BY 4.0**.
- Fonts: Google Fonts (Shrikhand, Bungee, Anton, Permanent Marker, Modak, Monoton), **SIL OFL**.
- The example videos use clips of *"Aww Tera Happy Bday"* (ABCD 2, Sachin–Jigar) and *"...Baby One More Time"* (Britney Spears). Those songs belong to their rights holders and are **not** covered by this repo's licence. They're included only as a demo of the sync. Use your own licensed music in anything you publish. On Instagram, upload silent and add the track from the in-app music library.
- Character art in the examples was generated with the Atlabs MCP from the birthday person's own photos.

Built with [Claude Code](https://claude.com/claude-code) by [@Chinmaya123-cyber](https://github.com/Chinmaya123-cyber).
