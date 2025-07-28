const fs = require("fs");
const path = require("path");

function findGitRepos(dir) {
  let results = [];
  const files = fs.readdirSync(dir, { withFileTypes: true });

  if (files.find((f) => f.isDirectory() && f.name === ".git")) {
    results.push(dir);
  }

  for (const file of files) {
    if (
      file.isDirectory() &&
      file.name !== ".git" &&
      file.name !== "node_modules"
    ) {
      try {
        results = results.concat(findGitRepos(path.join(dir, file.name)));
      } catch (e) {
        // silently skip folders that can't be accessed
      }
    }
  }

  return results;
}

module.exports = findGitRepos;
