import { readFile, writeFile } from 'node:fs/promises';

const file = new URL('../dist/index.html', import.meta.url);
const html = await readFile(file, 'utf8');
const pwaHead = [
  '  <link rel="manifest" href="./manifest.json">',
  '  <link rel="icon" href="./icon.svg" type="image/svg+xml">',
  "  <script>if('serviceWorker' in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js'))</script>",
].join('\n');

if (!html.includes('rel="manifest"')) {
  await writeFile(file, html.replace('</head>', `${pwaHead}\n</head>`));
}
