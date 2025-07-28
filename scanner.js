#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const readline = require("readline");
const { execSync } = require("child_process");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const ask = (q) => new Promise((res) => rl.question(q, res));

async function findGitRepos(baseDir) {
  const repos = [];

  function search(dir) {
    try {
      const files = fs.readdirSync(dir, { withFileTypes: true });
      for (const file of files) {
        if (file.isDirectory()) {
          const fullPath = path.join(dir, file.name);
          if (file.name === ".git") {
            repos.push(path.dirname(fullPath));
          } else {
            search(fullPath);
          }
        }
      }
    } catch (err) {
      // ignore access errors
    }
  }

  search(baseDir);
  return repos;
}

async function main() {
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

    if (isNaN(index) || !repos[index]) {
      console.log("👋 Bye.");
      break;
    }

    const selected = repos[index];
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
