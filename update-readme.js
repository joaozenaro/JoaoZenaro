const fs = require('fs');

const readmePath = 'README.md';
const statusPath = 'bogosort-status.md';

const startMarker = '<!-- BOGOSORT-STATUS-START -->';
const endMarker = '<!-- BOGOSORT-STATUS-END -->';

const readme = fs.readFileSync(readmePath, 'utf8');
const status = fs.readFileSync(statusPath, 'utf8');

const newReadme = readme.replace(
  new RegExp(`${startMarker}[\\s\\S]*?${endMarker}`),
  `${startMarker}\n${status}\n${endMarker}`
);

fs.writeFileSync(readmePath, newReadme);