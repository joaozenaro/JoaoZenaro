import browserSync from 'browser-sync';
import chokidar from 'chokidar';
import { generate } from './generate.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcDir = path.join(__dirname, '..', 'src');
const distDir = path.join(__dirname, '..', 'dist');

const mdFile = path.join(srcDir, process.argv[2] || 'resume.en.md');
const cssFile = path.join(srcDir, 'style.css');
const outputFile = path.join(distDir, 'index.html');

const bs = browserSync.create();

// Initial generation
generate(mdFile, cssFile, outputFile);

bs.init({
  server: distDir,
  index: "index.html",
  port: 3000,
  open: true,
  notify: false,
  ui: false
});

chokidar.watch([mdFile, cssFile, path.join(__dirname, 'generate.js')]).on('change', (changedPath) => {
  console.log(`File ${changedPath} changed, regenerating...`);
  generate(mdFile, cssFile, outputFile);
  bs.reload();
});
