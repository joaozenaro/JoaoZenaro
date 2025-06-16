const fs = require("fs");

const statusFile = "./bogosort-status.json";

function isSorted(arr) {
  for (let i = 1; i < arr.length; i++) {
    if (arr[i - 1] > arr[i]) {
        return false;
    }
  }
  return true;
}

function fisherYatesShuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Initialize status
let array = Array.from({ length: 20 }, (_, ix) => ix + 1);
array = fisherYatesShuffle(array);

let status = {
  array,
  attempts: 0,
  sorted: false,
};

if (fs.existsSync(statusFile)) {
  status = JSON.parse(fs.readFileSync(statusFile, "utf8"));
}

if (!status.sorted) {
  status.array = fisherYatesShuffle(status.array);
  status.attempts += 1;
  status.sorted = isSorted(status.array);
}

fs.writeFileSync(statusFile, JSON.stringify(status, null, 2));