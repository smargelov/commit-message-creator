import { Action, ActionPanel, Detail } from '@raycast/api'
import { MainSidebar } from '@/widgets/main-sidebar'
import { useCommitGenerator } from '@/features/commit-generator'
import { welcome } from './welcome'
import { useState, useEffect } from 'react'

function MainPage() {
  const { commitMessage, status, generateCommitMessage } = useCommitGenerator()
  const [text, setText] = useState<string>('')

  useEffect(() => {
    switch (status) {
      case 'start':
        setText('Generating commit message...')
        break
      case 'task-number':
        setText('Getting task number...')
        break
      case 'jira-task':
        setText('Getting Jira task description...')
        break
      case 'diff':
        setText('Getting last diff...')
        break
      case 'ai':
        setText('Generating commit message using AI...')
        break
      case 'done':
        setText(`# Commit message\n\n${commitMessage}`)
        break
    }
  }, [status])

  return !text ? (
    <Detail
      actions={
        <ActionPanel title="Welcome Actions">
          <Action title="Start Commit Message Generation" onAction={() => generateCommitMessage()} />
        </ActionPanel>
      }
      metadata={<MainSidebar />}
      markdown={`${welcome}`}
    />
  ) : (
    <Detail
      markdown={text}
      actions={
        <ActionPanel>
          <Action.CopyToClipboard title="Copy Commit Message" content={commitMessage} />
          <Action.Paste title="Paste Commit Message" content={commitMessage} />
        </ActionPanel>
      }
    />
  )
}

export { MainPage }
