import { Detail, getPreferenceValues } from '@raycast/api'
import { useEffect, useState } from 'react'
import { getCommitsCurrentBranch, getCurrentBranchName, getLastDiff, getPreviousBranchName } from '@/entities/git-data'
import { MainSidebar } from '@/widgets/main-sidebar'


function MainPage() {
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
				const commits = await getCommitsCurrentBranch()
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
			metadata={<MainSidebar />}
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

export { MainPage }
