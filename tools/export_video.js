#!/usr/bin/env node
// Records The Painted Bobcat to an MP4 (1280x720, 30 fps, H.264 + AAC).
//
//   cd tools && npm install && node export_video.js [out.mp4]
//
// It serves the repo locally, plays index.html?record in headless Chromium in real time,
// captures every painted frame (Chrome's screencast) and the page's own audio mix
// (voices, music and effects through one recorder), then muxes them with ffmpeg.
// Takes about as long as the story (~5 minutes). FONT_DIR=<dir> serves Google Fonts
// from a local copy (font.css + .woff2 files) when the machine can't reach them.
const fs = require('fs'), path = require('path'), http = require('http'), { spawn } = require('child_process');
const { chromium } = require('playwright');
const FFMPEG = process.env.FFMPEG || require('ffmpeg-static');
const ROOT = path.join(__dirname, '..');
const OUT = path.resolve(process.argv[2] || path.join(ROOT, 'out', 'painted-bobcat.mp4'));
const FPS = 30, W = 1280, H = 720, TAIL_MS = 7000;
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.jpg': 'image/jpeg', '.mp3': 'audio/mpeg', '.png': 'image/png' };

const run = (args, opts = {}) => new Promise((res, rej) => {
  const p = spawn(FFMPEG, ['-hide_banner', '-loglevel', 'error', '-y', ...args], { stdio: [opts.stdin ? 'pipe' : 'ignore', 'inherit', 'inherit'] });
  p.on('exit', code => code === 0 ? res() : rej(new Error('ffmpeg exited ' + code)));
  if (opts.onStart) opts.onStart(p);
});

(async () => {
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  const tmp = fs.mkdtempSync(path.join(require('os').tmpdir(), 'bobcat-'));
  // 1. serve the repo (voice clips must be same-origin so the recorder can hear them)
  const server = http.createServer((req, res) => {
    const file = path.join(ROOT, decodeURIComponent(req.url.split('?')[0]));
    if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404); return res.end(); }
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' });
    fs.createReadStream(file).pipe(res);
  }).listen(0);
  const port = server.address().port;

  // 2. headless Chromium at exactly 1280x720
  const browser = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
  const page = await browser.newPage({ viewport: { width: W, height: H } });
  if (process.env.FONT_DIR) {
    const dir = process.env.FONT_DIR;
    await page.route('https://fonts.googleapis.com/**', r => r.fulfill({ contentType: 'text/css', body: fs.readFileSync(path.join(dir, 'font.css')) }));
    await page.route('https://fonts.gstatic.com/**', r => r.fulfill({ contentType: 'font/woff2', body: fs.readFileSync(path.join(dir, path.basename(new URL(r.request().url()).pathname))) }));
  }
  page.on('pageerror', e => console.error('page error:', e.message));
  await page.goto(`http://localhost:${port}/index.html?record`);
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(() => { document.getElementById('start').style.display = 'none'; });
  await page.waitForTimeout(500);

  // 3. video: screencast frames -> constant 30 fps MJPEG stream -> H.264
  const videoFile = path.join(tmp, 'video.mp4');
  let enc, last = null, firstTs = null, written = 0;
  const encDone = run(['-f', 'mjpeg', '-framerate', String(FPS), '-i', '-', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '19',
                       '-pix_fmt', 'yuv420p', '-r', String(FPS), videoFile], { stdin: true, onStart: p => { enc = p; } });
  const cdp = await page.context().newCDPSession(page);
  cdp.on('Page.screencastFrame', ({ data, metadata, sessionId }) => {
    cdp.send('Page.screencastFrameAck', { sessionId }).catch(() => {});
    const frame = Buffer.from(data, 'base64'), ts = metadata.timestamp;
    if (firstTs === null) firstTs = ts;
    // repeat the previous frame until the output clock reaches this frame's time
    while (last && written < Math.floor((ts - firstTs) * FPS)) { enc.stdin.write(last); written++; }
    last = frame;
  });
  await cdp.send('Page.startScreencast', { format: 'jpeg', quality: 92, maxWidth: W, maxHeight: H, everyNthFrame: 1 });

  // 4. play the story with the audio recorder running
  const audioStart = await page.evaluate(() => window.__rec.start()) / 1000;
  const t0 = Date.now();
  const timer = setInterval(() => process.stdout.write(`\rrecording ${Math.round((Date.now() - t0) / 1000)} s`), 1000);
  await page.waitForFunction(() => document.querySelector('.replay'), null, { timeout: 15 * 60 * 1000, polling: 500 });
  await page.waitForTimeout(TAIL_MS);
  const audioB64 = await page.evaluate(() => window.__rec.stop());
  await cdp.send('Page.stopScreencast');
  clearInterval(timer);
  if (last) { enc.stdin.write(last); written++; }
  enc.stdin.end();
  await encDone;
  await browser.close(); server.close();
  console.log(`\rrecorded ${(written / FPS).toFixed(1)} s of video`);

  // 5. mux: line the audio up with the first video frame
  const audioFile = path.join(tmp, 'audio.webm');
  fs.writeFileSync(audioFile, Buffer.from(audioB64, 'base64'));
  const offset = audioStart - firstTs;           // seconds after the first frame that the audio began
  await run(['-i', videoFile, '-itsoffset', offset.toFixed(3), '-i', audioFile, '-map', '0:v', '-map', '1:a',
             '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', '-shortest', OUT]);
  fs.rmSync(tmp, { recursive: true, force: true });
  console.log('wrote', OUT, `(${(fs.statSync(OUT).size / 1e6).toFixed(1)} MB)`);
})().catch(e => { console.error(e); process.exit(1); });
