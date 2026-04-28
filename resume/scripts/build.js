import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generate } from './generate.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcDir = path.join(__dirname, '..', 'src');
const distDir = path.join(__dirname, '..', 'dist');

const cssFile = path.join(srcDir, 'style.css');

// English Markdown
const mdEn = path.join(srcDir, 'resume.en.md');
// Portuguese Markdown
const mdPt = path.join(srcDir, 'resume.pt.md');

console.log('Building Resume Site...');

// 1. Root English (/dist/index.html)
generate(mdEn, cssFile, path.join(distDir, 'index.html'));

// 2. English under /en (/dist/en/index.html)
generate(mdEn, cssFile, path.join(distDir, 'en', 'index.html'));

// 3. Portuguese under /pt (/dist/pt/index.html)
generate(mdPt, cssFile, path.join(distDir, 'pt', 'index.html'));

console.log('Build complete.');
