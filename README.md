# Brutal Eye

An ongoing body of work in cement, glass, and metal, each piece built around the eye — and a browser game built out of it.

Glass and metal by Mathew Morgan. Cement forms by Mighty Mauls in collaboration with Brutally Smart Tech.

## The site

| File | What it is |
| --- | --- |
| `index.html` | Landing page — a living 3×3 grid of cement tiles, plus panels for the game, the art, and the studio log |
| `game.html` | The game. `game.html` is 3×3; `game.html?grid=6` is 6×6 |

No build step, no dependencies. Open `index.html` in a browser, or serve the folder:

```
python3 -m http.server
```

## The game

Nine (or thirty-six) cement tiles, scattered. Drag them back into the grid.

- **Magnetic pull** — tiles that belong next to each other strain toward one another as they get close
- **Blanking** — tiles that don't belong together go blank rather than be seen out of position
- **Snapping** — release a tile near its correct neighbor and it locks in; joined tiles drag as one cluster
- **Completion** — assemble the grid and every eye turns toward the center

Tiles size themselves to the viewport, so both levels are playable on phones. Touch and mouse are both supported.

## The eyes

Each tile holds an eye that runs independently of the game:

- **Blinking** — JS-scheduled one-shots, not a CSS loop. Every interval (5.5–14s) and every blink speed (380–540ms) is randomized, so the grid never falls into a rhythm. The lids are an animated `clip-path` aperture rather than drawn shapes, so the card's texture shows through mid-blink with no visible lid edges. Each blink includes a synced eyeball squash and iris dip.
- **Wandering** — pupils drift on independent offsets
- **Gaze events** — every 25–55 seconds, either all eyes sweep to the same direction, or they all turn toward one tile while that one stares dead ahead and trembles until the others look away

`prefers-reduced-motion` is respected throughout.

## Deploying to GitHub Pages

Push to a repo, then in **Settings → Pages** set the source to your default branch, root folder. The site will be at `https://<user>.github.io/<repo>/`.

## License

**Proprietary — all rights reserved.** See [`LICENSE`](LICENSE).

This code is published for viewing, not for reuse. The only permission granted is to view and run the Software as deployed on Mighty Mauls properties. Copying, publishing, mirroring, deploying elsewhere, modifying, reselling, or including it in any product or template is prohibited without a written usage license, and carries liquidated damages of $2,500–$25,000 per instance in addition to copyright remedies.

Licensing inquiries: mishan@mightymauls.com
