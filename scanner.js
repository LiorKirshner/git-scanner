#!/usr/bin/env node

const path = require("path");
const fs = require("fs");
const { execSync } = require("child_process");
const { ask, handleRepo, rl, close } = require("./utils/ask.js");
const findGitRepos = require("./utils/gitScanner");
const { updateHistoryEntry } = require("./utils/historyHandler");
const { loadHistory } = require("./utils/historyHandler");

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
      const entry = {
        path: repo,
        date: new Date().toISOString(),
        status: statusSymbol,
        changes: [],
      };
      updateHistoryEntry(entry);
      reposWithStatus.push({ repo, statusSymbol });
    }

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
      const { close } = require("./utils/ask.js");
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

    // For repos that are not green, display numbered options for user actions
    const nonGreenRepos = reposWithStatus.filter(
      (r) => r.statusSymbol === "🟡" || r.statusSymbol === "🔴"
    );

    for (let i = 0; i < nonGreenRepos.length; i++) {
      const { repo, statusSymbol } = nonGreenRepos[i];
      if (repo !== selected) continue;
      console.log(`\nOptions for repo: ${repo}`);
      console.log("Choose action:");
      console.log("[1] Push changes (add + commit + push)");
      console.log("[2] Add all changes (git add .)");
      console.log("[3] Restore changes (git restore .)");
      console.log("[4] Commit (only if already added)");
      console.log("\x1b[31m[Enter] Cancel\x1b[0m"); // Red colored cancel
      const action = await ask("> ");

      switch (action.trim()) {
        case "1":
          const commitMsg = await ask("📝 Enter commit message: ");
          try {
            execSync(`git add . && git commit -m "${commitMsg}" && git push`, {
              cwd: repo,
              stdio: "inherit",
            });
            console.log("✅ Changes pushed successfully.");
          } catch (e) {
            console.log("❌ Failed to push changes.");
          }
          break;
        case "2":
          try {
            execSync(`git add .`, { cwd: repo, stdio: "inherit" });
            console.log("✅ Changes added.");
          } catch (e) {
            console.log("❌ Failed to add changes.");
          }
          break;
        case "3":
          try {
            execSync(`git restore .`, { cwd: repo, stdio: "inherit" });
            console.log("🔄 Changes restored.");
          } catch (e) {
            console.log("❌ Failed to restore.");
          }
          break;
        case "4":
          const msg = await ask("📝 Enter commit message: ");
          try {
            execSync(`git commit -m "${msg}"`, {
              cwd: repo,
              stdio: "inherit",
            });
            console.log("✅ Committed.");
          } catch (e) {
            console.log("❌ Commit failed.");
          }
          break;
        default:
          console.log("❌ Cancelled.");
      }
    }

    await handleRepo(selected);
  }
}

main();
