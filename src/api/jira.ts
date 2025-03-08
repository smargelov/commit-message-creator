import { getPreferenceValues } from '@raycast/api'
import fetch from 'node-fetch'
import JiraApi from 'jira-client'

const getTaskDescription = async (taskNumber: string) => {
	const { jiraEmail, jiraToken, jiraUrl } = getPreferenceValues()

	const auth = Buffer.from(`${jiraEmail}:${jiraToken}`).toString('base64')

	const response: JiraApi.JsonResponse = await fetch(
		`https://${jiraUrl}/rest/api/3/issue/${taskNumber}?fields=summary,description`,
		{
			method: 'GET',
			headers: {
				Authorization: `Basic ${auth}`,
				Accept: 'application/json',
			},
		},
	)

	if (!response.ok) {
		throw new Error(`Failed to fetch task description: ${response.statusText}`)
	}

	const data = await response.json()
	console.log('data', data.fields.description)
	return { title: data.fields.summary, body: data.fields.description }
}

export { getTaskDescription }
