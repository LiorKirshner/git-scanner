# Git Scanner CLI Tool

Git Scanner is a cross-platform Node.js command-line utility for scanning and managing local Git repositories. It provides a clean interactive experience with status overview, actionable Git commands, and real-time feedback.

---

## ✨ Features

- 🟢 Detects all Git repositories recursively from any directory
- 🟡 Highlights repositories with uncommitted changes
- 🔴 Flags invalid or inaccessible repositories
- 🧭 Interactive CLI menu with color-coded feedback
- 🧹 Sorts repos by status (clean → dirty → error)
- 🔄 Actions: `add`, `commit`, `push`, `restore`, `skip`
- 🔁 Stays running until the user exits
- ✅ Confirmation prompts for sensitive actions

---

## 📦 Installation

1. Clone the repository:

   ```bash
   git clone git@github.com:LiorKirshner/git-scanner.git
   cd git-scanner
   ```

2. Install globally:
   ```bash
   sudo npm install -g .
   ```

> Now you can run `git-scan` from any terminal window.

### 🔧 Local Usage (Alternative)

You can also run Git Scanner locally without installing globally:

```bash
node scanner.js
```

> Make sure you're inside the `git-scanner` directory.

---

## ▶️ Usage

```bash
git-scan
```

1. Choose the folder you want to scan (defaults to current working directory).
2. Git Scanner will recursively detect all Git repositories.
3. It will group and display them by status:
   - 🟢 Clean
   - 🟡 Uncommitted changes
   - 🔴 Errors or inaccessible
4. You’ll then choose which repository to act on.
5. Available actions:
   - `[1] Push changes` (add + commit + push)
   - `[2] Add all changes`
   - `[3] Restore changes`
   - `[4] Commit only`
   - `[5] Skip` ❌
   - `[Enter] Exit`

---

## 🧠 Requirements

- Node.js v14+
- Git installed and available in your `PATH`
- Works on macOS, Windows, and Linux

---

## 👨‍💻 Created By

Made with ❤️ by [Lior Kirshner](https://kirshner.me)  
[https://kirshner.me](https://kirshner.me)

---

## 🛡️ License

MIT License. See [LICENSE](LICENSE) for details.
