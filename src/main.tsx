import { Detail, getPreferenceValues, useNavigation } from '@raycast/api'
import { withAccessToken } from '@raycast/utils'
import { useEffect, useState } from 'react'
import { jira } from '@/entities/jira'
import { getCommitsCurrentBranch, getCurrentBranchName, getLastDiff, getPreviousBranchName } from '@/entities/git-data'

const { isUseJira } = getPreferenceValues()

function TaskForm() {
  const [isLoading, setIsLoading] = useState(false)

  const [previousBranchName, setPreviousBranchName] = useState('')
  const [currentBranchName, setCurrentBranchName] = useState('')
  const [lastDiff, setLastDiff] = useState('')
  const [commits, setCommits] = useState('')

  const { taskPrefix, projectDirectory } = getPreferenceValues()

  useEffect(() => {
    const getBranchesName = async () => {
      try {
        setIsLoading(true)
        const branchName = await getCurrentBranchName()
        setCurrentBranchName(branchName || '')
        const previousBranchName = await getPreviousBranchName()
        setPreviousBranchName(previousBranchName || '')
        const commits = await getCommitsCurrentBranch(previousBranchName)
        setCommits(commits || '')
        const lastDiff = await getLastDiff()
        setLastDiff(lastDiff || '')
      } catch (error) {
        console.error('Error getting current branch name:', error)
      } finally {
        setIsLoading(false)
      }
    }
    getBranchesName()
  }, [])

  return (
    <Detail
      isLoading={isLoading}
      markdown={`# Jira Task Description Fetcher

  - Task Prefix: ${taskPrefix}
  - Project Directory: ${projectDirectory}
  - Current Branch Name: ${currentBranchName}
  - Previous Branch Name: ${previousBranchName}

  Commits from Current Branch:

\`\`\`bash
${commits}
\`\`\`

  Last Diff:

\`\`\`bash
${lastDiff}
\`\`\`
  `}
    />
  )
}

export default isUseJira ? withAccessToken(jira)(TaskForm) : TaskForm
