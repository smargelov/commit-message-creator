import { useState } from 'react'
import { getPreferenceValues, AI, environment, showToast, Toast } from '@raycast/api'
import { convertADFToMarkdown, getTaskDescription, IJiraTaskData } from '@/entities/jira'
import { getLastDiff, getTaskName } from '@/entities/git-data'
import { getPromptText } from '@/entities/prompt'

export const useCommitGenerator = () => {
	const [commitMessage, setCommitMessage] = useState<string>('')
	const [isLoading, setIsLoading] = useState<boolean>(false)

	const { isUseJira } = getPreferenceValues()

	const generateCommitMessage = async () => {
		try {
			showToast({
				style: Toast.Style.Animated,
				title: 'Generating commit message...',
			})
			setIsLoading(true)
			let taskData: IJiraTaskData | null = null
			let taskNumber: string = ''
			if (isUseJira) {
				taskNumber = await getTaskName()
				if (taskNumber) {
					taskData = await getTaskDescription(taskNumber)
				}
			}

			const { result: description } = convertADFToMarkdown(taskData?.body)
			const diff = await getLastDiff()

			if (!diff) {
				showToast({
					style: Toast.Style.Failure,
					title: 'No changes detected',
					message: 'No changes detected in the last commit.',
				})
				setCommitMessage('No changes detected.')
				return
			}

			const promptText = getPromptText(diff, taskNumber, description, taskData?.title)

			if (!environment.canAccess(AI)) {
				showToast({
					style: Toast.Style.Success,
					title: 'AI is not available',
					message: 'You can copy the prompt text',
				})
				setCommitMessage(promptText)
				return
			}
			const response = await AI.ask(promptText, {
				model: AI.Model.Anthropic_Claude_Sonnet
			})

			if (response) {
				setCommitMessage(response)
				showToast({
					style: Toast.Style.Success,
					title: 'Commit message generated',
					message: commitMessage,
				})
			} else {
				setCommitMessage('No commit message generated.')
			}

		} catch (error) {
			setCommitMessage('Error generating commit message.')
		} finally {
			setIsLoading(false)
		}
	}

	return { commitMessage, isLoading, generateCommitMessage }
}
