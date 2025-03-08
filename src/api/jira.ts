import fetch from 'node-fetch'
import JiraApi from 'jira-client'
import { getJiraCredentials } from '../auth/jira'

interface TaskResponse {
  fields: {
    summary: string
    description: Record<string, unknown>
  }
}

const getTaskDescription = async (taskNumber: string) => {
  const { cloudId, authorizationHeader } = getJiraCredentials()
  const url = `https://api.atlassian.com/ex/jira/${cloudId}/rest/api/3/issue/${taskNumber}?fields=summary,description`

  const headers = {
    Authorization: authorizationHeader,
    Accept: 'application/json',
  }

  const response: JiraApi.JsonResponse = await fetch(url, {
    method: 'GET',
    headers,
  })

  if (!response.ok) {
    throw new Error(`Error fetching task description: ${response.statusText}`)
  }

  const data = (await response.json()) as TaskResponse
  return { title: data.fields.summary, body: data.fields.description }
}

export { getTaskDescription }
