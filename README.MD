# Git Scanner CLI Tool

Git Scanner is a Node.js command-line utility designed to scan and analyze local Git repositories. It provides insights into repository history, detects changes, and generates reports to help developers and system administrators better understand their codebase.

## Installation

To install Git Scanner globally on your system, run the following command in the root directory of the project:

```bash
npm install -g .
```

This will make the `git-scan` command available globally.

## Usage

Run the tool using the following command:

```bash
git-scan
```

The CLI will prompt you interactively to select options such as:

- The path to the local Git repository you want to scan.
- The type of analysis or report you want to generate.
- Output preferences (e.g., console output or saving to a file).

Follow the on-screen prompts to configure and execute your scan.

## Notes

- Ensure the repository path you provide is a valid local Git repository.
- The tool requires Node.js to be installed on your system.
- Git Scanner currently supports scanning only local repositories and does not support remote URLs.

## License

Git Scanner is released under the MIT License. See the [LICENSE](LICENSE) file for more details.

## Disclaimer

This tool is provided "as is" without warranty of any kind. Use it at your own risk. The authors are not responsible for any damage or data loss that may occur through its use.

# Git Scanner CLI Tool

Git Scanner is a Node.js command-line utility that scans local folders to identify Git repositories and helps manage their status. It provides a quick overview of each repo's condition (clean, has changes, or has Git issues) and offers interactive options like committing or pushing updates.

## ✨ Features

- 🟢 Detects all local Git repositories recursively from any folder.
- 🟡 Highlights uncommitted changes.
- 🔴 Flags inaccessible or invalid Git repos.
- 📦 Offers simple Git commands interactively: add, commit, push, restore.
- 🧭 Built-in CLI menu with color-coded feedback.
- 🔁 Keeps running until you choose to exit.

## 📦 Installation

To install Git Scanner globally on your system:

```bash
npm install -g .
```

Make sure you're in the root folder of the project.

Once installed, you can run it globally from anywhere using:

```bash
git-scan
```

## ▶️ Usage

```bash
git-scan
```

1. The app will ask for a folder path (defaults to your current directory).
2. It will scan recursively for Git repositories.
3. It displays each repo grouped by status:
   - 🟢 Clean repo
   - 🟡 Uncommitted changes
   - 🔴 Git error or inaccessible
4. You can choose which repo to act on.
5. For each, you’ll be prompted with actions:
   - `[1] Push changes` (add + commit + push)
   - `[2] Add all changes`
   - `[3] Restore changes`
   - `[4] Commit only`
   - `[Enter] Cancel`

## 🧠 Requirements

- Node.js (v14 or later recommended)
- Git installed and available in your PATH

## 👨‍💻 Created by

Made with ❤️ by [Lior Kirshner](https://kirshner.me)

## 🛡️ License

Released under the MIT License. See [LICENSE](LICENSE) for more info.

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
[https://github.com/LiorKirshner/git-scanner](https://github.com/LiorKirshner/git-scanner)

---

## 🛡️ License

MIT License. See [LICENSE](LICENSE) for details.
