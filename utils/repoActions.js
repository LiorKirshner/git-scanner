const { exec } = require('child_process');
const { promisify } = require('util');
const { ask } = require('./ask');

const execAsync = promisify(exec);

async function runCommand(cmd, cwd) {
  try {
    const { stdout, stderr } = await execAsync(cmd, { cwd, shell: true });
    if (stdout) process.stdout.write(stdout);
    if (stderr) process.stderr.write(stderr);
    return true;
  } catch (e) {
    if (e.stdout) process.stdout.write(e.stdout);
    if (e.stderr) process.stderr.write(e.stderr);
    return false;
  }
}

async function handleRepo(repo) {
  console.log(`\nOptions for repo: ${repo}`);
  console.log('Choose action:');
  console.log('[1] Push changes (add + commit + push)');
  console.log('[2] Add all changes (git add .)');
  console.log('[3] Restore changes (git restore .)');
  console.log('[4] Commit (only if already added)');
  console.log('\x1b[31m[Enter] Cancel\x1b[0m');
  const action = await ask('> ');

  switch (action.trim()) {
    case '1': {
      const commitMsg = await ask('📝 Enter commit message: ');
      const ok = await runCommand(`git add . && git commit -m "${commitMsg}" && git push`, repo);
      console.log(ok ? '✅ Changes pushed successfully.' : '❌ Failed to push changes.');
      break;
    }
    case '2': {
      const ok = await runCommand('git add .', repo);
      console.log(ok ? '✅ Changes added.' : '❌ Failed to add changes.');
      break;
    }
    case '3': {
      const ok = await runCommand('git restore .', repo);
      console.log(ok ? '🔄 Changes restored.' : '❌ Failed to restore.');
      break;
    }
    case '4': {
      const msg = await ask('📝 Enter commit message: ');
      const ok = await runCommand(`git commit -m "${msg}"`, repo);
      console.log(ok ? '✅ Committed.' : '❌ Commit failed.');
      break;
    }
    default:
      console.log('❌ Cancelled.');
  }
}

module.exports = { handleRepo };
