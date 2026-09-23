# The Painted Bobcat — a Pack 149 story

A whimsical, narrated JavaScript + SVG animation of a Cub Scout's Bobcat ceremony:
Family, Fun & Adventure.

**To watch:** open `index.html` in any modern browser (no install or server needed).
Turn the sound up: an original campfire tune plays in the background (🎵 toggles it) and every character
has their own voice (🔊 toggles voices). Voices are AI-generated with OpenAI text-to-speech.

## The story
1. **Welcome** – a campfire night at Pack 149, and a friendly bobcat says hello.
2. **Family** – Max arrives with Mom and Dad; Akela welcomes them.
3. **Bobcat** – the bobcat pops out of the bushes: Oath, Law and Motto.
4. **Scout Oath** – everyone gives the Scout sign while Max recites it.
5. **Scout Law** – all twelve points pop up as badges.
6. **Motto** – "Do Your Best!" with confetti.
7. **Face Paint** – the Painted Bobcat ceremony: blue paw print (forehead), yellow (under the eyes),
   white (nose), red (chin), green (each cheek).
8. **Parents** – Max paints a white stripe on Mom's and Dad's noses: love and guidance.
9. **Finale** – the whole painted family: Family · Fun · Adventure.

## Controls
⏮ / ⏭ change scenes, ⏸ pauses (or press Space), and the chips jump to any scene.
URL options: `?scene=6` starts at a scene, `?speed=2` plays faster.

## Customizing
All the ceremony words are at the top of the `<script>` in `index.html`:
`OATH`, `LAW`, `MOTTO`, `MARKS` (each paint color's meaning) and `PARENT_WHITE`.
The Scout's name is set in `makeCub('Max')` and in the scene text.

## Voices
Each line has a recorded clip in `voices/` (AI-generated with OpenAI's `gpt-4o-mini-tts`), listed in
`voices.js`. Any line without a clip falls back to the browser's built-in voice.

| Character | Voice | Direction |
|---|---|---|
| Narrator | fable | cozy picture-book storyteller |
| Akela | onyx | wise, grandfatherly campfire leader |
| Max | nova | excited 7-year-old (earnest when reciting the Oath and Law) |
| Mom | coral | loving, cheerful, giggly |
| Dad | ash | goofy, proud dad |
| Bobcat | verse | sly, mischievous cartoon cat |

**After changing any spoken line:** update `voices/lines.json` (pairs of `["Speaker", "caption text"]`,
matching the text in `index.html` exactly), then run `OPENAI_API_KEY=sk-... python3 tools/make_voices.py`.
Only new or changed lines are generated (a few cents at most). Then run `node tools/make_lips.js` (mouth
movement) and, if the Scout Law line changed, `python3 tools/word_times.py` (when each badge pops up). "149" is read aloud as "one forty-nine".

**Single-file page for sharing:** `python3 tools/build_page.py out.html` embeds all the clips into one file.

## Video (MP4)
`tools/export_video.js` records the whole story to `out/painted-bobcat.mp4` (1280×720, 30 fps, H.264 +
AAC, captions shown as subtitles). It plays `index.html?record` in headless Chromium in real time, so it
takes about as long as the story (~5 minutes):

```
cd tools
npm install                    # Playwright + ffmpeg
npx playwright install chromium
node export_video.js           # or: node export_video.js ~/Desktop/painted-bobcat.mp4
```

## Cartoon preview and backgrounds
`index.html#pilot` plays a short before/after test of the cartoon style. `assets/bg-*.jpg` are the
painted backdrops (OpenAI image model); the story uses `bg-cartoon.jpg`.
