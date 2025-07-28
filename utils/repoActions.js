const { execSync } = require("child_process");
const { ask } = require("./ask");

async function handleRepo(repo) {
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

module.exports = { handleRepo };
