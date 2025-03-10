import { getPreferenceValues } from '@raycast/api'
import { withAccessToken } from '@raycast/utils'
import { jira } from '@/entities/jira'
import { MainPage } from '@/pages/main'

const { isUseJira } = getPreferenceValues()

export default isUseJira ? withAccessToken(jira)(MainPage) : MainPage
