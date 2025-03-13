const start = `
I need you to analyze the following information and generate a well-formatted Git commit message.

## Input Information:
`

const jiraPath = (title: string, description: string, taskNumber: string) => `
- Jira Task Title:
\`\`\`
${title}
\`\`\`

- Jira Task Description:
\`\`\`
${description}
\`\`\`

- Jira Task Number:
\`\`\`
${taskNumber}
\`\`\`
`

const end = (diff: string, taskNumber: string) => `
- Git Diff:
\`\`\`
${diff}
\`\`\`

## Instructions:

Based on the provided information, generate a commit message that follows this format:

\`\`\`
type(scope): brief description
[blank line]
- detailed change 1
- detailed change 2
- detailed change 3
...
[blank line]
${taskNumber}
\`\`\`

Guidelines:
- Analyze the git diff to determine the appropriate type (feat, fix, refactor, test, etc.)
- Identify the scope (module or component affected) from the file paths in the diff
- Write a clear, concise description starting with lowercase (first line should be under 72 characters)
- List detailed changes as bullet points, each starting with a verb in imperative mood in lowercase
${taskNumber ? '- Include the Jira task number at the end' : ''}

Please generate only the commit message without any additional explanation.
	`

export const getPromptText = (diff: string, taskNumber: string, description: string, title?: string) => {
  let promptText = start
  if (title && description && taskNumber) {
    promptText += jiraPath(title, description, taskNumber)
  }
  promptText += end(diff, taskNumber)
  return promptText
}
