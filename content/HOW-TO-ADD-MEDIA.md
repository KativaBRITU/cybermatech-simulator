# No-code media & content (like a custom lab folder)

Edit JSON + drop files here. **No coding required.** Restart the server after changes (`npm start`).

## Folders

| Path | What to put there |
|------|-------------------|
| `public/media/backgrounds/` | Hero / page background images (`.jpg`, `.png`, `.webp`) |
| `public/media/videos/` | Training or intro videos (`.mp4`, `.webm`) |
| `public/media/posters/` | Video poster/thumbnail images |
| `public/media/brand/` | Logo / favicon |
| `content/site-media.json` | Which page uses which media |
| `content/modules.json` | Modules, descriptions, optional per-module video, quiz questions |

## Add a home background (example)

1. Copy your image to:
   `public/media/backgrounds/home-hero.jpg`
2. Open `content/site-media.json`
3. Set:

```json
"home": {
  "hero_background": "/media/backgrounds/home-hero.jpg",
  "hero_video": "",
  "overlay": "rgba(11, 36, 48, 0.72)"
}
```

4. Restart server. Refresh `/`.

## Add a homepage hero video

1. Put file in `public/media/videos/welcome.mp4`
2. Optional poster: `public/media/posters/welcome.jpg`
3. In `site-media.json` → `pages.home`:

```json
"hero_video": "/media/videos/welcome.mp4",
"hero_video_poster": "/media/posters/welcome.jpg"
```

If both background and video are set, **video wins** on the home hero.

## Add a training module video (no code)

1. Put `public/media/videos/phishing-intro.mp4`
2. Open `content/modules.json`
3. Find the module (`"id": "phishing"`) and set:

```json
"video": "/media/videos/phishing-intro.mp4",
"video_poster": "/media/posters/phishing.jpg",
"background_image": "/media/backgrounds/phishing.jpg"
```

4. Restart. Open `/training/phishing` while logged in.

## Add a whole new module later

Copy an existing module block in `content/modules.json`, change `id`, `title`, `description`, `questions`, and optional `video`. It appears on the dashboard automatically after restart.

## Rules

- Paths must start with `/media/...` (files live under `public/media/`).
- Keep filenames simple: letters, numbers, dashes.
- Guests never see module videos or quiz routes — login required.
- Quiz answers stay on the server; do not put answer keys in public HTML.
