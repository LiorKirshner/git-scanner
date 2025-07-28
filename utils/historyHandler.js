const fs = require("fs");
const path = require("path");

const HISTORY_PATH = path.join(__dirname, "..", "history.json");
function loadHistory() {
  try {
    const data = fs.readFileSync(HISTORY_PATH, "utf8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function saveHistory(entries) {
  const dir = path.dirname(HISTORY_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(HISTORY_PATH, JSON.stringify(entries, null, 2));
}

function updateHistoryEntry(newEntry, baseDir) {
  const history = loadHistory();
  const resolvedNewPath = path.resolve(newEntry.path);
  const resolvedBaseDir = baseDir ? path.resolve(baseDir) : null;

  // Check if entry already exists
  const existingIndex = history.findIndex(
    (e) => path.resolve(e.path) === resolvedNewPath
  );

  if (existingIndex !== -1) {
    const existing = history[existingIndex];
    if (existing.status !== newEntry.status) {
      history[existingIndex] = {
        ...existing,
        ...newEntry,
      };
      saveHistory(history);
    }
    return;
  }

  // Only save if it's the exact baseDir or the status is not green
  if (
    (resolvedBaseDir && resolvedNewPath === resolvedBaseDir) ||
    newEntry.status !== "🟢"
  ) {
    history.push(newEntry);
    saveHistory(history);
  }
}

module.exports = {
  updateHistoryEntry,
  loadHistory,
  saveHistory,
};
