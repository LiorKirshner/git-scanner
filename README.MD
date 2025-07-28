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
