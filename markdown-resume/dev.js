import browserSync from 'browser-sync';
import chokidar from 'chokidar';
import { generate } from './generate.js';

const bs = browserSync.create();

// Initial generation
generate();

bs.init({
  server: ".",
  index: "index.html",
  port: 3000,
  open: true,
  notify: false,
  ui: false
});

chokidar.watch([process.argv[2], 'style.css', 'generate.js']).on('change', (path) => {
  console.log(`File ${path} changed, regenerating...`);
  generate();
  bs.reload();
});
