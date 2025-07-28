const fs = require("fs");
const path = require("path");

const HISTORY_PATH = path.join(process.cwd(), ".git-scanner", "history.json");

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

function updateHistoryEntry(newEntry) {
  const history = loadHistory();
  const index = history.findIndex((e) => e.path === newEntry.path);
  if (index !== -1) {
    history[index] = newEntry;
  } else {
    history.push(newEntry);
  }
  saveHistory(history);
}

module.exports = {
  loadHistory,
  saveHistory,
  updateHistoryEntry,
};
