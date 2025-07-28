#!/usr/bin/env node

const path = require("path");
const fs = require("fs");
const { execSync } = require("child_process");
const { ask, rl } = require("./utils/ask");
const findGitRepos = require("./utils/gitScanner");

async function main() {
  console.clear();
  const defaultPath = process.cwd();
  const inputPath = await ask(
    `📁 Enter folder to scan [default: current directory]: `
  );
  const baseDir = inputPath.trim() === "" ? defaultPath : inputPath.trim();

  while (true) {
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
      if (statusSymbol === "🟡") {
        const action = await ask("Choose action: [1] Push changes, [2] Skip: ");
        switch (action.trim()) {
          case "1":
            try {
              execSync(
                'git add . && git commit -m "Auto-commit from git-scan" && git push',
                {
                  cwd: repo,
                  stdio: "inherit",
                }
              );
              console.log("✅ Changes pushed successfully.");
            } catch (e) {
              console.log("❌ Failed to push changes.");
            }
            break;
          case "2":
            console.log("⏭ Skipped.");
            break;
          default:
            console.log("❌ Invalid choice. Skipped.");
        }
      } else if (statusSymbol === "🔴") {
        const action = await ask("Choose action: [1] Retry access, [2] Skip: ");
        switch (action.trim()) {
          case "1":
            try {
              execSync("git status", {
                cwd: repo,
                encoding: "utf8",
              });
              console.log("✅ Access successful.");
            } catch (e) {
              console.log("❌ Still unable to access repo.");
            }
            break;
          case "2":
            console.log("⏭ Skipped.");
            break;
          default:
            console.log("❌ Invalid choice. Skipped.");
        }
      }
    }

    const action = await ask(
      "Choose action: [1] Show git status, [2] Remove .git, [3] Delete folder, [Enter] Cancel: "
    );

    switch (action.trim()) {
      case "1":
        try {
          const result = execSync("git status", {
            cwd: selected,
            encoding: "utf8",
          });
          console.log("\n📄 Git status:\n");
          console.log(result);
        } catch (e) {
          console.log("❌ Failed to run git status");
        }
        break;

      case "2":
        fs.rmSync(path.join(selected, ".git"), {
          recursive: true,
          force: true,
        });
        console.log("✅ .git folder removed.");
        break;

      case "3":
        const confirm = await ask(
          "⚠️ Are you sure you want to delete the entire folder? (yes/no): "
        );
        if (confirm.toLowerCase() === "yes") {
          fs.rmSync(selected, { recursive: true, force: true });
          console.log("🗑 Folder deleted.");
        } else {
          console.log("❌ Cancelled.");
        }
        break;

      default:
        console.log("❌ Cancelled.");
    }
  }

  rl.close();
}

main();
