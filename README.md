# Star Hopper

A one-file endless jumper that runs in the browser. Bounce up floating platforms, grab stars (+25), dodge comets, and don't fall.

- Steer with ← → / A D, or drag on touch screens
- Green platforms are solid, blue ones slide, brown ones crumble
- Blue ring = shield (absorbs one comet), orange triangle = rocket boost
- M mutes, P pauses, best score is saved in your browser

Play it: open `index.html`, or enable GitHub Pages (Settings → Pages → Deploy from branch → `main` / root).

## The bot

Tap the **🤖 开启 BOT 自动玩** button under the game (or press **B**) to hand the controls to an autopilot, then use the **1× / 4× / 16×** buttons (or keys **1 / 2 / 3**) for speed. Its runs never touch your saved best.

How it works: every frame it simulates ~27 candidate steering plans with the game's own physics (platforms, sliding and crumbling platforms, comets, pickups) and takes the first move of the best one. Plans score by height reached, stars and shields collected, with anything that gets it killed ruled out. Two practical rules were found by testing:

- **Rockets only while holding a shield.** A rocket flies ~1400px blind and can end beside a comet that wasn't generated yet; the shield absorbs that hit.
- **Stuck-breaker.** With no upward progress for ~6 s it makes a few random but verified-safe moves to shake loose.

### Benchmark

`node bot-test.js [games] [maxFrames] [firstSeed]` runs the bot headlessly with a seeded RNG (≈1000 frames/sec). Current results:

| Test | Result |
|---|---|
| 12 seeds × 15,000 frames | 0 deaths, avg score ≈ 15,200 |
| 4 seeds × 60,000 frames | 3 survived the full run (≈ 63,000), 1 died at frame 57,000 |

A human good run is a few hundred to a couple of thousand.
