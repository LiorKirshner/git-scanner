const fs = require("fs");
const path = require("path");

function findGitRepos(baseDir) {
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
    } catch {
      // ignore access errors
    }
  }

  search(baseDir);
  return repos;
}

module.exports = findGitRepos;
