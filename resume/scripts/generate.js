import fs from 'fs';
import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';
import MarkdownIt from 'markdown-it';
import MarkdownItDeflist from 'markdown-it-deflist';
import LinkAttributes from 'markdown-it-link-attributes';
import frontmatter from '@renovamen/front-matter';

const md = new MarkdownIt({ html: true });
md.use(MarkdownItDeflist);
md.use(LinkAttributes, {
  matcher: (link) => /^https?:\/\//.test(link),
  attrs: {
    target: "_blank",
    rel: "noopener",
  },
});

const resolveDeflist = (html) => {
  const dlReg = /<dl>([\s\S]*?)<\/dl>/g;
  const dlList = html.match(dlReg);
  if (dlList === null) return html;

  let result = html;
  for (const dl of dlList) {
    const newDl = dl.replace(/<\/dd>\n<dt>/g, "</dd>\n</dl>\n<dl>\n<dt>");
    result = result.replace(dl, newDl);
  }
  return result;
};

const resolveHeader = (html, attributes) => {
  let header = "";
  if (attributes.name) header += `<h1>${attributes.name}</h1>\n`;

  if (attributes.header) {
    const n = attributes.header.length;
    for (let i = 0; i < n; i++) {
      const item = attributes.header[i];
      if (!item) continue;
      header += item.newLine ? "<br>\n" : "";
      header += `<span class="resume-header-item${i === n - 1 || (attributes.header[i + 1] && attributes.header[i + 1].newLine) ? " no-separator" : ""}">`;
      if (item.link) header += `<a href="${item.link}" target="_blank" rel="noopener noreferrer">${item.text}</a>`;
      else header += item.text;
      header += `</span>\n`;
    }
  }

  if (!header) return html;
  return `<div class="resume-header">${header}</div>\n` + html;
};

export const generate = (mdFile, cssFile, outputFile) => {
  try {
    let mdContent = fs.readFileSync(mdFile, 'utf-8');
    const cssContent = fs.readFileSync(cssFile, 'utf-8');

    // Filter out lines that contain placeholders for which no environment variable is defined
    mdContent = mdContent.split('\n').filter(line => {
      const placeholders = line.match(/\{\{(\w+)\}\}/g);
      if (!placeholders) return true;

      // Keep the line only if ALL placeholders in it are defined in process.env
      return placeholders.every(ph => {
        const key = ph.slice(2, -2);
        return process.env[key] !== undefined;
      });
    }).join('\n');

    // Replace placeholders: {{VAR_NAME}} -> process.env.VAR_NAME
    mdContent = mdContent.replace(/\{\{(\w+)\}\}/g, (match, p1) => {
      return process.env[p1] || "";
    });

    const { body, attributes } = frontmatter(mdContent);
    let renderedHtml = md.render(body);
    renderedHtml = resolveDeflist(renderedHtml);
    renderedHtml = resolveHeader(renderedHtml, attributes);

    const finalHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${attributes.name || 'Resume'}</title>
    <style>
        ${cssContent}
    </style>
</head>
<body>
    <div class="resume-body">
        ${renderedHtml}
    </div>
</body>
</html>
`;

    const outDir = path.dirname(outputFile);
    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir, { recursive: true });
    }

    fs.writeFileSync(outputFile, finalHtml);
    console.log(`Successfully generated ${outputFile}`);
  } catch (err) {
    console.error(`Error generating ${outputFile}:`, err);
  }
};

// Run if called directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  
  const mdFile = path.join(__dirname, '..', 'src', process.argv[2] || 'resume.en.md');
  const cssFile = path.join(__dirname, '..', 'src', 'style.css');
  const outputFile = path.join(__dirname, '..', 'dist', 'index.html');
  
  generate(mdFile, cssFile, outputFile);
}
