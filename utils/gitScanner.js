const fs = require('fs/promises');
const path = require('path');

async function findGitRepos(dir, depth = Infinity) {
  const results = [];
  if (depth < 0) return results;

  let files;
  try {
    files = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return results; // skip directories we cannot read
  }

  if (files.some((f) => f.isDirectory() && f.name === '.git')) {
    results.push(dir);
  }

  for (const file of files) {
    if (file.isDirectory() && file.name !== '.git' && file.name !== 'node_modules') {
      const subDir = path.join(dir, file.name);
      const subResults = await findGitRepos(subDir, depth - 1);
      results.push(...subResults);
    }
  }

  return results;
}

module.exports = findGitRepos;
