import { useState } from 'react'
import { getPreferenceValues, AI, environment, showToast, Toast } from '@raycast/api'
import { convertADFToMarkdown, getTaskDescription, IJiraTaskData } from '@/entities/jira'
import { getLastDiff, getTaskName } from '@/entities/git-data'
import { getPromptText } from '@/entities/prompt'

export const useCommitGenerator = () => {
  const [commitMessage, setCommitMessage] = useState<string>('')
  const [status, setStatus] = useState<string>('ready')

  const { isUseJira } = getPreferenceValues()

  const generateCommitMessage = async () => {
    try {
      showToast({
        style: Toast.Style.Animated,
        title: 'Generating commit message...',
      })
      setStatus('start')
      let taskData: IJiraTaskData | null = null
      let taskNumber: string = ''
      if (isUseJira) {
        setStatus('task-number')
        taskNumber = await getTaskName()
        if (taskNumber) {
          setStatus('jira-task')
          taskData = await getTaskDescription(taskNumber)
        }
      }
      const { result: description } = convertADFToMarkdown(taskData?.body)
      setStatus('diff')
      const diff = await getLastDiff()

      if (!diff) {
        showToast({
          style: Toast.Style.Failure,
          title: 'No changes detected',
          message: 'No changes detected in the last commit.',
        })
        setStatus('done')
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
        setStatus('done')
        setCommitMessage(promptText)
        return
      }
      setStatus('ai')
      const response = await AI.ask(promptText, {
        model: AI.Model.Anthropic_Claude_Sonnet,
      })

      setStatus('done')
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
      setStatus('done')
      setCommitMessage('Error generating commit message.')
    }
  }

  return { commitMessage, status, generateCommitMessage }
}
