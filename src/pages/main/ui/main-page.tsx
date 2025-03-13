import { Action, ActionPanel, Detail } from '@raycast/api'
import { MainSidebar } from '@/widgets/main-sidebar'
import { useCommitGenerator } from '@/features/commit-generator'
import { welcome } from './welcome'

function MainPage() {
  const { commitMessage, isLoading, generateCommitMessage } = useCommitGenerator()

  return !commitMessage ? (
    <Detail
      actions={
        <ActionPanel title="Welcome Actions">
          <Action title="Start commit-message-generation" onAction={() => generateCommitMessage()} />
        </ActionPanel>
      }
      metadata={<MainSidebar />}
      markdown={`${welcome}`}
    />
  ) : (
    <Detail
      isLoading={isLoading}
      markdown={`# Commit message\n\n${commitMessage}`}
      metadata={<MainSidebar />}
      actions={
        <ActionPanel>
          <Action.CopyToClipboard title="Copy commit message" content={commitMessage} />
          <Action.Paste title="Paste commit message" content={commitMessage} />
        </ActionPanel>
      }
    />
  )
}

export { MainPage }
