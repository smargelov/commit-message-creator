import { Detail, getPreferenceValues } from '@raycast/api'

const MainSidebar = () => {
  const { isUseJira, projectDirectory, taskPrefix, gitMainBranch } = getPreferenceValues()

  return (
    <Detail.Metadata>
      <Detail.Metadata.Label title="Prodject directory" text={projectDirectory} />
      <Detail.Metadata.Separator />
      <Detail.Metadata.Label title="Use Jira" text={isUseJira ? '✅ Jira is connected' : "🛑 Jira isn't connected"} />
      {isUseJira && <Detail.Metadata.Label title="Jira task prefix" text={taskPrefix} />}
      <Detail.Metadata.Separator />
      <Detail.Metadata.Label title="Git main branch name" text={gitMainBranch} />
    </Detail.Metadata>
  )
}

export { MainSidebar }
