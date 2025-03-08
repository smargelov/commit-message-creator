import { Detail, ActionPanel, Action } from '@raycast/api'
import { useState, useEffect } from 'react'
import { getTaskDescription } from './api/jira'
import { convertADFToMarkdown } from './utils/adf-to-md'
// import { useAI } from '@raycast/utils'

export default function Command() {
	const [sourceDescription, setSourceDescription] = useState('')
	const [description, setDescription] = useState('')
	const [isLoading, setIsLoading] = useState(true)
	useEffect(() => {
		const fetchData = async () => {
			try {
				setIsLoading(true)
				const { title, body } = await getTaskDescription('MD-1408')
				const text = `# ${title}\n\n${convertADFToMarkdown(body).result}`
				setSourceDescription(JSON.stringify(body))

				setDescription(text)
			} catch (error) {
				console.error('Error fetching task description:', error)
			} finally {
				setIsLoading(false)
			}
		}
		fetchData().then()
	}, [])
	// const { data, isLoading } = useAI('Suggest 5 jazz songs')

	return (
		<Detail
			isLoading={isLoading}
			markdown={description}
			actions={
				<ActionPanel>
					<Action.CopyToClipboard title="Copy" content={sourceDescription} />
				</ActionPanel>
			}
		/>
	)
}
