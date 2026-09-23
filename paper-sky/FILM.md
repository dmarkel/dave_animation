# Paper Sky

A 72-second whimsical risograph film for Parker and Emma. They fold a paper airplane at
their school desk; it carries them off into the sky, becomes a trapeze under a floating
big top, weaves through a jungle, puffs into a paper hot-air balloon at sunset, and folds
back into a plane that glides home through the classroom window onto the desk.

Built on the riso-windowseat engine (`new-riso.mjs` scaffold + the live-plate compositor
from `films/window-seat`). One self-contained `index.html`, Canvas 2D, no images: the
kids are drawn procedurally from the reference photos in `references/` (not embedded).

## Characters (from the reference photos)

| | Emma | Parker |
|---|---|---|
| Build | older, taller; round face | younger, about a head shorter |
| Hair | long straight dark hair, thick blunt bangs, side locks framing the face, pink clip | short dark crop, jagged fringe |
| Face | big dark eyes (her wide-eyed "wow" face), small mole beside the nose | huge grin with a gap tooth |
| Clothes | lavender tee with round CD graphic, blue plaid skirt, navy sneakers with pink soles | royal-blue polo with white collar, grey shorts, red sneakers |
| Nods | taro-purple and milk-tea-pink balloon gores (their boba order); peace sign at the end | thumbs up at the end |

## Inks

Five live plates: yellow, fluorescent pink, blue, green (45°) and indigo (moved to 26.6° so
it doesn't share green's angle). No black: hair and darks are indigo + pink + blue overprints.

## Passages

| Time | Shot | Action / transition |
|---|---|---|
| 0–7.5 | Desk, top-down | A crayon-doodled sheet (balloon, big top, palm, sun, "P+E"); Emma's and Parker's hands take turns folding a dart; Emma lifts it. Cut on action. |
| 7.5–13 | Classroom | Emma winds up and throws; Parker cheers; the plane loops the room and dives at camera until its paper fills the frame. |
| 13–25 | Sky | The white becomes a cloud that parts: the kids ride the now-giant plane over town and school, loop-the-loop, reach a big top floating on a cloud, fly into its dark door (full-cover switch). |
| 25–38 | Big top | Lights snap on; the plane flattens into a trapeze bar; the kids catch it and swing higher; release, somersault, the bar re-folds into the plane and catches them; spotlight irises closed. |
| 38–51.5 | Jungle | Dark leaves part as the plane dives in; parallax jungle, a macaw flies alongside, a monkey waves, waterfall clearing; poof: the plane becomes a paper hot-air balloon and rises through the canopy. |
| 51.5–63 | Sunset | Balloon drifts over town to Spicewood Elementary; poof back to a plane that dives into a glowing classroom window (zoom cover). |
| 63–72 | Classroom at sunset | Camera pulls back from the window; the little plane glides in and lands on the desk; peace sign, thumbs up, hold. |

Why this ending: the adventure is made of one folded sheet, so it ends where the sheet
started — on the desk, in the kids' hands.

## Transitions

Every content switch happens under full cover: plane paper → cloud white; tent door dark;
spotlight iris → dark leaves iris; continuous camera rise (jungle → sky); poof clouds
over the plane/balloon swaps; window glow zoom.

## Score

Whimsical, one tune dressed per world: C major, 112 BPM, a four-bar motif (E-G-A-G-E, C-D-E … D)
and its answer. Music box at the desk (paper turn/flick on every fold, read from `FOLDS`);
plucked bass and ukulele-ish strums start on Emma's throw (the beat grid is anchored so bar 4's
downbeat is the release at 8.86 s); mallets in the sky with a rising/falling glass run over the
loop; a calliope waltz under the big top whose bars are locked to the trapeze half-swing
(`TRAP.w`); marimba ostinato, wood blocks and seeded bird chirps in the jungle; half-time glass
over a warm pad at sunset; music box home and a bell chord that rings out by 72 s.

Built from the `studies/sound.html` kit (`paper`/`tick` renamed `paperSfx`/`tickSfx` to avoid
colliding with the film's `paper` canvas and `tick` loop). In-page player: **Sound** button,
off by default.

Measured (`audio.mjs --twice`, Chromium): 72.000 s, 48 kHz, I −16.0 LUFS, LRA 5.4 LU,
TP −2.15 dBTP, clipped 0, deterministic to 1 LSB (Chromium summation jitter). Muxed MP4:
−16.0 LUFS, peak −2.2 dBFS. One deliberate hush remains at 37.4 s (−10.3 dB), where the
spotlight irises shut before the jungle leaves part.

| Mark (s) | Event | Sound |
|---|---|---|
| 8.86 | throw release | whoosh, music-box C6, groove starts |
| 19.25 | top of the loop | glass run peaks |
| 25.35 | big-top lights | bell + metal ting |
| 28.45 | kids catch the trapeze | bell + wood; waltz begins |
| 34.60 | release | riser into whoosh |
| 35.60 | landing on the plane | card contact + glass chord |
| 47.83 / 58.93 | poofs | breath + bell |
| 65.75 | plane lands on desk | card contact + paper skid |

## Status

- Rendered `out/paper-sky.mp4` (1080², 30 fps, 2160 frames, AAC) with `render.mjs` in Chromium.
  Firefox (the repo's primary engine) could not launch in this sandbox, so `verify.mjs` and the
  Firefox byte-identical audio check were not run.
- Reviewed: contact sheets across the whole film and 1:1 frames of each scene; an MP4 contact
  sheet every 5 s. Not reviewed: frame-by-frame strips at every handoff, and nobody has listened
  to the score — the mix was judged by meters only.
- A blank-frame glitch appeared when two headless browsers ran at once (GPU canvas lost its
  contents); the paper and output canvases are now CPU-backed (`willReadFrequently`).
- Known weaknesses: the in-page player runs well below 30 fps (five live plates at 1080), so the
  MP4 is the way to watch; the plane's side-view flips abruptly when it turns around in the
  classroom loop; kids' poses are rig poses, not hand-drawn acting.
