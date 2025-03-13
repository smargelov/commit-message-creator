# Commit Message Creator

![Commit Message Creator Logo](./assets/extension-icon.png)

> Create professional commit messages based on your changes and Jira issues using AI

## Description

Commit Message Creator is a Raycast extension that automates the creation of structured commit messages based on changes in your Git repository and information from Jira. Using the power of artificial intelligence (Anthropic Claude Sonnet), the extension analyzes your changes and generates informative commit messages that follow best practices.

## Features

- 🔄 **Automatic Jira task detection** based on current branch name
- 📝 **Jira information extraction** (task title and description)
- 🔍 **Git diff analysis** to understand the changes made
- 🤖 **AI-powered commit message generation** following conventional format
- 📋 **Copy or paste** the ready-to-use message with one click

## Requirements

- [Raycast](https://raycast.com/) version 1.93.2 or higher
- Git installed on your system
- Jira API access (optional)

## Installation

### From Raycast Store

1. Open Raycast
2. Navigate to Store (⌘+K, then type "Store")
3. Find "Commit Message Creator"
4. Click "Install"

### From Source Code

1. Clone the repository:

   ```bash
   git clone https://github.com/smargelov/commit-message-creator.git
   ```

2. Navigate to the project directory:

   ```bash
   cd commit-message-creator
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Run in development mode:

   ```bash
   npm run dev
   ```

## Configuration

After installing the extension, you'll need to configure the following parameters:

1. **Local Project Directory** - path to your Git repository
2. **Jira Integration** - enable/disable Jira usage
3. **Jira Task Prefix** - prefix for tasks in your project (e.g., "TASK" for TASK-1234)
4. **Git Main Branch Name** - name of your main branch (default is "main")

If you've enabled Jira integration, you'll also need to authorize with Jira through Raycast.

## Usage

1. Open Raycast (⌘+Space)
2. Type "Create Commit"
3. Select "Commit Message Creator: Create Commit"
4. Click "Start commit-message-generation"
5. Wait for the message generation
6. Use "Copy commit message" or "Paste commit message" to use the result

## Commit Message Format

Generated messages follow the conventional format:

```markdown
type(scope): brief description

- detailed change 1
- detailed change 2
- detailed change 3

JIRA-1234
```

Where:

- **type** - type of change (feat, fix, refactor, test, etc.)
- **scope** - area of change (module or component)
- **brief description** - essence of changes in one line
- **detailed changes** - list of specific changes
- **JIRA-1234** - Jira task number

## License

MIT

## Author

Sergey Margelov

## Feedback and Contributions

If you have suggestions for improvements or found a bug, please create an issue or pull request in the project repository.
