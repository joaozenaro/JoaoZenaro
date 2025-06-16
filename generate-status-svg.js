const fs = require("fs");
const status = JSON.parse(fs.readFileSync("bogosort-status.json", "utf8"));

const { array, attempts, sorted } = status;

const [width, height] = [800, 200];
const cols = array.length;
const colWidth = width / cols;

const maxVal = Math.max(...array);
const scale = height / maxVal;

const svgColumns = [];

for (let x = 0; x < cols; x++) {
    const barHeight = array[x] * scale;
    const y = height - barHeight;
    svgColumns.push(`<rect width="${colWidth}" height="${barHeight}" x="${x * colWidth}" y="${y}" fill="white" />`);
}

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
    ${svgColumns.join("\n")}
</svg>
`;

const statusMarkdown = `
![Bogosort Status](./bogosort-status.svg)

${sorted ? "IT ACTUALLY SOLVED IT!" : "Processing..."}
Attempts: ${attempts}}

![Run Bogosort](https://img.shields.io/badge/Run%20Bogosort-Click%20Here-brightgreen?logo=github-actions&style=for-the-badge)](https://github.com/JoaoZenaro/JoaoZenaro/actions/workflows/bogosort.yml)
`; 

fs.writeFileSync("bogosort-status.svg", svg);
fs.writeFileSync("bogosort-status.md", statusMarkdown);

