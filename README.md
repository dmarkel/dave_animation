# The Painted Bobcat — a Pack 149 story

A whimsical, narrated JavaScript + SVG animation of a Cub Scout's Bobcat ceremony:
Family, Fun & Adventure.

**To watch:** open `index.html` in any modern browser (no install or server needed).
Turn the sound up: an original campfire tune plays in the background (🎵 toggles it) and the browser reads the story aloud (🔊 toggles voices).

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
