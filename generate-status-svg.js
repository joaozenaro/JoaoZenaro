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
    svgColumns.push(`<rect width="${colWidth}" height="${barHeight}" x="${x * colWidth}" y="${y}" />`);
}

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
<style>
rect {
    fill: black;
}
@media (prefers-color-scheme: dark) {
    rect {
        fill: white;
    }
}
</style>
${svgColumns.join("\n")}
</svg>
`;

const statusMarkdown = `
![Bogosort Status](./bogosort-status.svg)

${sorted ? "IT ACTUALLY SOLVED IT!" : "Processing..."}
Attempts: ${attempts}

[![Bogosort Runner](https://github.com/joaozenaro/JoaoZenaro/actions/workflows/main.yml/badge.svg)](https://github.com/joaozenaro/JoaoZenaro/actions/workflows/main.yml)
`; 

fs.writeFileSync("bogosort-status.svg", svg);
fs.writeFileSync("bogosort-status.md", statusMarkdown);

