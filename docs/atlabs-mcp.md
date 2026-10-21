# The Atlabs MCP

[Atlabs](https://app.atlabs.ai) is an AI video and image studio. Its MCP server ("Atlabs MiniTools") lets Claude generate and edit images, videos and music with your Atlabs credits. This skill uses it to create **the cartoon version of your person**: the same face and outfit, redrawn in a bold pop-art style across 6–10 poses.

| | |
|---|---|
| **Server URL** | `https://mcp.atlabs.ai/mcp` |
| **Transport** | HTTP (streamable) |
| **Auth** | OAuth: sign in with your Atlabs account. Claude never sees your password. |
| **Account** | Free sign-up at [app.atlabs.ai](https://app.atlabs.ai). Credits are needed for generation. |

## Add it

**Claude Code plugin users:** it's already bundled in `.mcp.json`. Run `/mcp` → **atlabs** → **Authenticate**.

**Claude Code (manual):**
```bash
claude mcp add --transport http --scope user atlabs https://mcp.atlabs.ai/mcp
```
Then `/mcp` → **atlabs** → **Authenticate**.

**Claude Desktop / claude.ai:**
1. Go to **Settings → Connectors → Add custom connector**.
2. Enter the name `Atlabs` and the URL `https://mcp.atlabs.ai/mcp`, then click **Add**.
3. Click **Connect** and sign in.
4. Enable it in the chat from the tools ("+") menu.

## What the skill uses it for

| Tool | Used for | Typical cost |
|---|---|---|
| `start_upload` + HTTP PUT | upload your reference photos | free |
| `generate_image` (`gpt_image_2_5_flare`) | each cartoon pose, using your photos as references | ~0.8 credits |
| `generate_image` (`nano_banana_pro`) | edit a pose: swap a prop, make it family-friendly | ~2.5 credits |
| `get_result` | fetch the finished image | free |
| `get_account` | check the connection and your balance | free |
| `generate_music` (optional) | a royalty-free backing track if you have no song | ~6 credits |
| `generate_video` (optional) | animate a pose into a short clip | varies by model |

A typical video uses **5–10 credits** for its whole character set. Claude reports the credits spent after generating and asks first before anything large.

## Privacy

Your photos are uploaded to your own Atlabs library to act as references, and generated images are saved there too. You can delete them from the Atlabs web app.

## The prompt that keeps the character consistent

The key is **one fixed outfit description repeated in every prompt**, with your photos (and later one already-generated pose) passed as references. The full template and the 10-pose list are in [`skills/desi-pop-motion/references/atlabs-mcp.md`](../skills/desi-pop-motion/references/atlabs-mcp.md).

## Can I use the skill without Atlabs?

Yes, partly. Claude can build and render the whole video with labelled placeholder figures (`tools/placeholder_chars.py`), and you can drop your own cut-out PNGs into `public/char/` using the same filenames. Atlabs is what turns a photo into a matching set of cartoon poses automatically.
