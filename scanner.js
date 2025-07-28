#!/usr/bin/env node

const { execSync } = require("child_process");
const { ask, rl, close } = require("./utils/ask.js");
const { handleRepo } = require("./utils/repoActions");
const findGitRepos = require("./utils/gitScanner");
const { updateHistoryEntry, loadHistory } = require("./utils/historyHandler");

async function main() {
  console.clear();
  // Show recent scan locations (history)
  const history = loadHistory().slice(-3).reverse(); // last 3 runs, latest first
  let baseDir;
  if (history.length > 0) {
    console.log("📜 Recent scan locations:");
    history.forEach((entry, index) => {
      console.log(`[${index + 1}] ${entry.path} (${entry.status})`);
    });
    const histChoice = await ask(
      "\n🔁 Choose a location to re-scan (1-3) or press Enter to choose manually: "
    );
    const histIndex = parseInt(histChoice.trim(), 10);
    if (histIndex >= 1 && histIndex <= history.length) {
      baseDir = history[histIndex - 1].path;
    }
  }
  console.log("-------------------------");
  console.log(" ");
  const defaultPath = process.cwd();
  if (!baseDir) {
    const inputPath = await ask(
      `📁 Enter folder to scan [default: current directory]: `
    );
    baseDir = inputPath.trim() === "" ? defaultPath : inputPath.trim();
  }

  while (true) {
    console.clear();
    console.log(`\n🔍 Scanning: ${baseDir}...\n`);
    const repos = await findGitRepos(baseDir);

    if (repos.length === 0) {
      console.log("❌ No Git repositories found.");
      break;
    }

    const reposWithStatus = [];
    let baseDirStatus = "🟢";

    for (let i = 0; i < repos.length; i++) {
      const repo = repos[i];
      let statusSymbol = "🟢";
      try {
        const status = execSync("git status --porcelain", {
          cwd: repo,
          encoding: "utf8",
          stdio: ["ignore", "pipe", "ignore"],
        });
        if (status.trim()) statusSymbol = "🟡";
      } catch {
        statusSymbol = "🔴";
      }

      if (repo === require("path").resolve(baseDir)) {
        baseDirStatus = statusSymbol;
      }

      reposWithStatus.push({ repo, statusSymbol });
    }

    // Only update history once for baseDir itself
    updateHistoryEntry(
      {
        path: baseDir,
        date: new Date().toISOString(),
        status: baseDirStatus,
        changes: [],
      },
      baseDir
    );

    // Sort repos: green (🟢) first, then yellow (🟡), then red (🔴)
    reposWithStatus.sort((a, b) => {
      const order = { "🟢": 0, "🟡": 1, "🔴": 2 };
      return order[a.statusSymbol] - order[b.statusSymbol];
    });

    for (let i = 0; i < reposWithStatus.length; i++) {
      const { repo, statusSymbol } = reposWithStatus[i];
      console.log(`${statusSymbol} 📁 ${i + 1}. ${repo}`);
    }

    console.log("\nLegend:");
    console.log("🟢 Clean repo");
    console.log("🟡 Uncommitted changes");
    console.log("🔴 Git error or inaccessible\n");

    const choice = await ask(
      "🔢 Enter number of repo to act on (or press Enter to exit): "
    );
    const index = parseInt(choice.trim(), 10) - 1;

    if (isNaN(index) || !reposWithStatus[index]) {
      console.log("👋 Bye.");
      close();
      console.log("\n💡 You may now continue using the terminal.\n");
      break;
    }

    const selected = reposWithStatus[index].repo;
    console.log(`\n➡️ Selected: ${selected}\n`);
    try {
      const result = execSync("git status", {
        cwd: selected,
        encoding: "utf8",
      });
      console.log("📄 Git status:\n");
      console.log(result);
    } catch (e) {
      console.log("❌ Failed to run git status");
    }

    await handleRepo(selected);
  }
}

main();
