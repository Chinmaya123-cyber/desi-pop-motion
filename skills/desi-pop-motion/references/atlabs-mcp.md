# Atlabs MCP: setup and character recipes

The Atlabs MCP ("Atlabs MiniTools") generates and edits images, videos and music with the user's Atlabs credits. This skill uses it for the cartoon character poses, and optionally for prop edits, music and image-to-video.

## Connect it (one time)

**Endpoint:** `https://mcp.atlabs.ai/mcp` (HTTP transport, OAuth sign-in with the Atlabs account)

**Claude Code CLI**
```bash
claude mcp add --transport http atlabs https://mcp.atlabs.ai/mcp
```
Then start `claude`, type `/mcp`, select **atlabs**, choose **Authenticate**, and finish the sign-in in the browser. To make it available in every project, add `--scope user` to the command.

**Claude Desktop app / claude.ai**
1. Open Settings → **Connectors** → **Add custom connector**.
2. Enter the name `Atlabs` and the URL `https://mcp.atlabs.ai/mcp`, then click **Add**.
3. Click **Connect** and sign in with the Atlabs account.
4. In the chat, open the tools ("+") menu and make sure Atlabs is switched on.

**Account and credits:** sign up at https://app.atlabs.ai. Typical costs from real runs:
- character pose, `gpt_image_2_5_flare` 1K: 0.8 credits
- prop edit, `nano_banana_pro`: 2.5 credits

**Check it works:** call `get_account`, which returns the name, credit balance and plan. The tools are often deferred, so load them with ToolSearch first, e.g. `select:mcp__atlabs__start_upload,mcp__atlabs__generate_image,mcp__atlabs__get_result,mcp__atlabs__get_account,mcp__atlabs__list_models`. The server prefix can also be a UUID (`mcp__3e8bb1ff-…__generate_image`), so search by keyword if `atlabs` doesn't match.

**Cost etiquette:** current tools charge on submit. There is no separate price step, but each call reports `credits_required`. Before a big batch (more than about 10 images, or any video), tell the user the expected total. For the usual 6–10 poses, go ahead and report the credits spent afterwards. Never show media_ids or expiring URLs to the user.

## Upload reference photos

```text
start_upload(file_name="photo1.jpg", content_type="image/jpeg")  → upload_url
curl -s -X PUT -H "Content-Type: image/jpeg" --upload-file refs/photo1.jpg "<upload_url>"  → {"media_id": …}
```
- Use the user's two best photos: one clear front-facing portrait, and optionally one full-body shot.
- `.webp` and `.png` files work too; set the matching content type.
- If the PUT can't connect, the sandbox has no network. Use `upload_from_browser` + `get_upload_result` instead.

## Character poses (the proven prompt)

Use `generate_image` with these settings:
- `model="gpt_image_2_5_flare"`
- `aspect_ratio="2:3"`, or `"1:1"` for wide poses such as a bean bag
- `reference_media_ids=[photo ids]`. For later poses, also add one already-generated pose so the style stays locked.

Leave quality and resolution at their defaults.

```
The exact same young <man/woman> from the reference photos (same face, same <hair>, same <facial hair>, same <skin tone>, same eyes and nose), redrawn as a bold Indian pop-art cartoon character: thick clean black ink outlines, flat vivid saturated colors, cel shading, slightly exaggerated big head and expressive face, Gen-Z sticker style. Outfit (keep identical): <ONE fixed outfit, e.g. hot-pink short-sleeve shirt with yellow marigold and paisley print, open collar, thin gold chain, black jeans, white sneakers, round black sunglasses pushed up on his head>. POSE: <pose>. Isolated on a plain solid flat white background, full figure with margin around it, no text, no shadows on the background.
```

These poses cover almost every scene recipe. The filenames are the ones the template's scenes expect:

| file | pose line |
|---|---|
| `point_you` | full body, energetically pointing his index finger straight at the viewer, leaning forward, huge excited grin, eyebrows raised, like "YOU!" |
| `point_self` | full body, both thumbs pointing proudly at his own chest, smug cocky smirk, one eyebrow raised |
| `dance` | full body, dancing a desi bhangra move, one arm raised holding a party popper, other hand twisting, one knee lifted, eyes closed, singing |
| `dj` | waist-up DJ, headphones around neck with one cup to his ear, other hand scratching a vinyl on a small turntable deck, "ooh" party face |
| `swag` | full body, ultra cool pose wearing the sunglasses, leaning back, peace sign near face, holding a tall orange mocktail with a striped straw |
| `shocked` | waist-up, comically shocked meme face, jaw dropped, eyes bulging, hands on cheeks, cartoon sweat drops |
| `cake` | full body, striped cone party hat, holding a big pink-and-yellow cake with lit candles, cheeks puffed to blow |
| `welcome` | full body, arms spread wide in a warm "aao aao, come in!" welcome, huge laugh |
| `namaste` | full body, hands folded in namaste at chest, slight bow, closed-eye happy smile, small blush, little hearts around head |
| `sleepy` (1:1) | the morning after a party, asleep slumped on a yellow bean bag, mouth open snoring, crooked party hat, hugging a balloon, confetti on shirt |

Then:
- `get_result(request_id)` returns `outputs[0].url`. Download each with `curl -sL -o refs/gen/<pose>.jpg "<url>"`.
- Contact-sheet them and look at the sheet: check the face matches the photos and the outfit is identical.
- Regenerate any outliers with the same prompt.
- Cut out: `.venv/bin/python -I tools/cutout.py isnet-general-use public/char refs/gen/*.jpg`. This saves trimmed PNGs named after the source files.

**Real-photo cutout (for the "official photo" gag):**
1. Crop the photo to head and shoulders.
2. Run `tools/cutout.py u2net_human_seg public/img refs/crop.jpg`.
3. Point the `hostPhoto` prop at the result.

## Editing a pose (swap props, make it family friendly)

Upload the pose JPG (the white-background original, not the cutout). Then call `generate_image(model="nano_banana_pro", aspect_ratio="2:3", reference_media_ids=[pose_id])` with this prompt:

```
Edit this exact cartoon illustration. Keep everything identical (same character, face, hair, outfit, pose, same bold pop-art ink style, plain white background). ONLY change <the raised hand>: <remove the cigarette and smoke; hand flashes a peace sign> / <replace the beer bottle with a colorful party popper bursting with confetti>. Full body, no text.
```

Re-run the cutout under the **same filename**, so every scene picks up the change.

## Optional extras

- `generate_music` (`elevenlabs_music`, instrumental, state the BPM in the prompt): a royalty-free bed if the user has no song, or wants Instagram-safe audio.
- `generate_video` with `start_frame_media_id`: animate a pose for a 3–5s live-action-ish insert.
- `list_models(tool=…)`: check aspect ratios and reference limits before using an unfamiliar model.
