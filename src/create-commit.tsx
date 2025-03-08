import { Detail, ActionPanel, Action, Form, useNavigation } from '@raycast/api'
import { withAccessToken } from '@raycast/utils'
import { useState } from 'react'
import { getTaskDescription } from './api/jira'
import { convertADFToMarkdown } from './utils/adf-to-md'
import { jira } from './auth/jira'

interface ADFNode {
  type: string
  content?: ADFNode[]
  text?: string
  attrs?: Record<string, unknown>
}

interface ADFDocument extends ADFNode {
  type: 'doc'
  version: number
}

interface TaskFormValues {
  taskNumber: string
}

function TaskForm() {
  const { push } = useNavigation()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (values: TaskFormValues) => {
    try {
      setIsLoading(true)
      const { title, body } = await getTaskDescription(values.taskNumber)
      const adfDocument = body as unknown as ADFDocument
      const text = `# ${title}\n\n${convertADFToMarkdown(adfDocument).result}`
      const sourceDescription = JSON.stringify(body)

      push(
        <Detail
          markdown={text}
          actions={
            <ActionPanel>
              <Action.CopyToClipboard title="Copy to Clipboard" content={sourceDescription} />
              <Action title="Back to Form" onAction={() => push(<TaskForm />)} />
            </ActionPanel>
          }
        />,
      )
    } catch (error) {
      console.error('Error fetching task description:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form
      isLoading={isLoading}
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Get Task Description" onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.TextField
        id="taskNumber"
        title="Jira Task Number"
        placeholder="Enter task number (e.g. MD-1408)"
        autoFocus
      />
    </Form>
  )
}

export default withAccessToken(jira)(TaskForm)
