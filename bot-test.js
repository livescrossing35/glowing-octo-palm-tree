// Headless benchmark for the Star Hopper bot.
// Usage: node bot-test.js [games=8] [maxFrames=20000] [firstSeed=1]
const fs = require('fs');
const [games = 8, maxFrames = 20000, firstSeed = 1] = process.argv.slice(2).map(Number);

const html = fs.readFileSync(__dirname + '/index.html', 'utf8');
const code = html.split('<script>')[1].split('</script>')[0]
  .replace("reset(); state = 'title'; loop();", '');

const ctx = new Proxy({}, { get: (t, k) => (k in t ? t[k] : () => {}), set: (t, k, v) => ((t[k] = v), true) });
const cv = { width: 420, height: 640, getContext: () => ctx, addEventListener() {}, getBoundingClientRect: () => ({ left: 0, width: 420 }) };
global.document = { getElementById: () => cv, querySelectorAll: () => [] };
global.addEventListener = () => {};
global.localStorage = { getItem: () => null, setItem() {} };
global.requestAnimationFrame = () => {};

function mulberry32(a) { return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

const g = new Function(code + `; return { update, reset, bot, finalScore, get state() { return state; } };`)();
g.bot.on = true;

const results = [];
for (let i = 0; i < games; i++) {
  Math.random = mulberry32(firstSeed + i);
  g.reset();
  let f = 0;
  while (g.state === 'play' && f < maxFrames) { g.update(); f++; }
  const died = g.state === 'over';
  results.push({ seed: firstSeed + i, score: g.finalScore(), frames: f, died });
  console.log(`seed ${firstSeed + i}: score ${g.finalScore()}  frames ${f}  ${died ? 'DIED' : 'survived to cap'}`);
}
const avg = results.reduce((a, r) => a + r.score, 0) / results.length;
console.log(`\navg score ${Math.round(avg)} · deaths ${results.filter(r => r.died).length}/${games}`);
