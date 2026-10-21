# Installation

You need **the skill** and the **Atlabs MCP**, plus a few local tools that do the rendering.

## 1. Prerequisites (on the computer that renders)

| Tool | Why | Install (macOS) |
|---|---|---|
| Node.js 18+ | Remotion (React → video) | `brew install node` or [nodejs.org](https://nodejs.org) |
| Python 3.12 | beat grid, lyrics, background removal | `brew install python@3.12` (or [uv](https://docs.astral.sh/uv/): `brew install uv`) |
| ffmpeg | cutting music, encoding, previews | `brew install ffmpeg` |
| Google Chrome | rendering (more stable than Remotion's bundled browser on macOS) | [google.com/chrome](https://www.google.com/chrome/) |
| ~2 GB free disk | render frames + Python models | |

On Windows or Linux, install the same tools with your package manager. If Chrome isn't at the macOS path, Remotion falls back to its own browser.

Claude installs the Node and Python packages itself the first time (`npm install`, a `.venv` with numpy, scipy, pillow, faster-whisper, rembg). The background-removal and lyrics models download on first use (~350 MB total).

## 2. Install the skill

### Claude Code: plugin (recommended)
```text
/plugin marketplace add Chinmaya123-cyber/desi-pop-motion
/plugin install desi-pop-motion@desi-pop-motion
```
This installs the skill **and registers the Atlabs MCP server**. Restart Claude Code, then do step 3.

To update later: `/plugin marketplace update desi-pop-motion`.

### Claude Code: manual
```bash
git clone https://github.com/Chinmaya123-cyber/desi-pop-motion.git
cp -R desi-pop-motion/skills/desi-pop-motion ~/.claude/skills/
claude mcp add --transport http --scope user atlabs https://mcp.atlabs.ai/mcp
```
For a single project only, put the skill in `<project>/.claude/skills/` and drop `--scope user`.

### Claude Desktop / claude.ai
1. Download `desi-pop-motion.skill` from [Releases](https://github.com/Chinmaya123-cyber/desi-pop-motion/releases/latest).
2. **Settings → Capabilities → Skills → Upload skill**, and choose the file. You can also open the file in Claude and click **Save skill**.
3. Add the Atlabs connector (step 3).

Rendering needs a local machine. The Claude Desktop app's **Code** tab works. A plain claude.ai web chat can plan and write the code, but can't run the render.

## 3. Connect and sign in to the Atlabs MCP

Atlabs generates the cartoon character poses. You need an account at **[app.atlabs.ai](https://app.atlabs.ai)**.

**Claude Code**
1. Run `/mcp`.
2. Select **atlabs** (with the plugin it shows as `plugin:desi-pop-motion:atlabs`).
3. Choose **Authenticate** and sign in in the browser window that opens.

**Claude Desktop / claude.ai**
1. Go to **Settings → Connectors → Add custom connector**.
2. Enter the name `Atlabs` and the URL `https://mcp.atlabs.ai/mcp`, then click **Add**.
3. Click **Connect** and sign in.
4. In each chat, turn it on from the tools ("+") menu.

**Check it works:** ask Claude *"check my Atlabs credits"*. It calls `get_account` and replies with your balance.

## 4. First video

Attach 1–2 photos and an mp3, then ask:
```text
Make a desi-pop motion graphics invite for my birthday house party using these photos and the main part of this song.
```
The finished videos land in `~/Downloads`.

## Troubleshooting

| Symptom | Fix |
|---|---|
| Claude says the Atlabs tools aren't available | Run `/mcp` and check atlabs shows **connected**. Re-authenticate if it shows *needs auth*. In Desktop, enable the connector for the chat. |
| `Target closed` / `icudtl.dat not found in bundle` while rendering | Install Google Chrome. The template's `remotion.config.ts` uses it automatically. |
| Render dies partway with no error | Out of memory. Lower concurrency (`--concurrency=4`) and run it in the foreground. |
| `ensurepip … returned non-zero` | Use Python 3.12 (`uv venv --python 3.12 .venv`), not 3.14. |
| faster-whisper `metadata_errors` error | Use the template's `tools/transcribe.py`, which passes audio as an array to avoid it. |
| Instagram mutes the video | That's the copyrighted song. Upload silent and add the track from Instagram's music picker. |
