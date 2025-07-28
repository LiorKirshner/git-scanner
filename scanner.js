#!/usr/bin/env node

const { exec } = require('child_process');
const { promisify } = require('util');
const path = require('path');
const { ask, rl, close } = require('./utils/ask.js');
const { handleRepo } = require('./utils/repoActions');
const findGitRepos = require('./utils/gitScanner');
const { updateHistoryEntry, loadHistory } = require('./utils/historyHandler');

const execAsync = promisify(exec);

function parseArgs() {
  const args = process.argv.slice(2);
  let target = null;
  let depth = Infinity;
  for (const arg of args) {
    if (arg.startsWith('--depth=')) {
      depth = parseInt(arg.split('=')[1], 10);
    } else if (!target) {
      target = arg;
    }
  }
  return { target, depth: isNaN(depth) ? Infinity : depth };
}

async function main() {
  console.clear();
  const { target, depth } = parseArgs();
  const history = loadHistory().slice(-3).reverse();

  let baseDir = target;
  if (!baseDir && history.length > 0) {
    console.log('📜 Recent scan locations:');
    history.forEach((entry, index) => {
      console.log(`[${index + 1}] ${entry.path} (${entry.status})`);
    });
    const histChoice = await ask('\n🔁 Choose a location to re-scan (1-3) or press Enter to choose manually: ');
    const histIndex = parseInt(histChoice.trim(), 10);
    if (histIndex >= 1 && histIndex <= history.length) {
      baseDir = history[histIndex - 1].path;
    }
  }

  const defaultPath = process.cwd();
  if (!baseDir) {
    const inputPath = await ask(`📁 Enter folder to scan [default: current directory]: `);
    baseDir = inputPath.trim() === '' ? defaultPath : inputPath.trim();
  }

  while (true) {
    console.clear();
    console.log(`\n🔍 Scanning: ${baseDir}...\n`);
    const repos = await findGitRepos(baseDir, depth);

    if (repos.length === 0) {
      console.log('❌ No Git repositories found.');
      break;
    }

    const reposWithStatus = [];
    let baseDirStatus = '🟢';

    for (const repo of repos) {
      let statusSymbol = '🟢';
      try {
        const { stdout } = await execAsync('git status --porcelain', { cwd: repo });
        if (stdout.trim()) statusSymbol = '🟡';
      } catch {
        statusSymbol = '🔴';
      }

      if (path.resolve(repo) === path.resolve(baseDir)) {
        baseDirStatus = statusSymbol;
      }

      reposWithStatus.push({ repo, statusSymbol });
    }

    updateHistoryEntry(
      {
        path: baseDir,
        date: new Date().toISOString(),
        status: baseDirStatus,
        changes: [],
      },
      baseDir
    );

    reposWithStatus.sort((a, b) => {
      const order = { '🟢': 0, '🟡': 1, '🔴': 2 };
      return order[a.statusSymbol] - order[b.statusSymbol];
    });

    reposWithStatus.forEach(({ repo, statusSymbol }, i) => {
      console.log(`${statusSymbol} 📁 ${i + 1}. ${repo}`);
    });

    console.log('\nLegend:');
    console.log('🟢 Clean repo');
    console.log('🟡 Uncommitted changes');
    console.log('🔴 Git error or inaccessible\n');

    const choice = await ask('🔢 Enter number of repo to act on (or press Enter to exit): ');
    const index = parseInt(choice.trim(), 10) - 1;

    if (isNaN(index) || !reposWithStatus[index]) {
      console.log('👋 Bye.');
      close();
      console.log('\n💡 You may now continue using the terminal.\n');
      break;
    }

    const selected = reposWithStatus[index].repo;
    console.log(`\n➡️ Selected: ${selected}\n`);
    try {
      const { stdout } = await execAsync('git status', { cwd: selected });
      console.log('📄 Git status:\n');
      console.log(stdout);
    } catch {
      console.log('❌ Failed to run git status');
    }

    await handleRepo(selected);
  }
}

main();
