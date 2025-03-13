import { exec } from 'child_process'
import { promisify } from 'util'
import { getPreferenceValues } from '@raycast/api'

const { projectDirectory, taskPrefix } = getPreferenceValues()

const execAsync = promisify(exec)

const getCurrentBranchName = async () => {
  try {
    const { stdout } = await execAsync('git rev-parse --abbrev-ref HEAD', {
      cwd: projectDirectory,
    })
    return stdout.trim()
  } catch (error) {
    console.error('Error getting current branch name:', error)
  }
}

const getPreviousBranchName = async () => {
  try {
    const { stdout } = await execAsync(
      "git show-branch | grep '*' | grep -v \"$(git rev-parse --abbrev-ref HEAD)\" | head -n1 | sed 's/.*\\[\\(.*\\)\\].*/\\1/' | sed 's/[\\^~].*//'",
      {
        cwd: projectDirectory,
      },
    )
    return stdout.trim()
  } catch (error) {
    console.error('Error getting previous branch name:', error)
  }
}

const getCommitsCurrentBranch = async (previousBranch: string = 'main') => {
  try {
    const { stdout } = await execAsync(`git log ${previousBranch}..HEAD --pretty=format:"%h - %s%n%b"`, {
      cwd: projectDirectory,
    })
    return stdout.trim()
  } catch (error) {
    console.error('Error getting commits from current branch:', error)
    return ''
  }
}

const getLastDiff = async () => {
  try {
    const { stdout } = await execAsync('git diff HEAD', {
      cwd: projectDirectory,
    })
    return stdout.trim()
  } catch (error) {
    console.error('Error getting last diff:', error)
  }
}

const getTaskName = async () => {
  const branchName = await getCurrentBranchName()
  if (!branchName) {
    return ''
  }
  const regex = new RegExp(`${taskPrefix}-\\d+`)
  const match = branchName.match(regex)
  if (match) {
    return match[0]
  }
  return ''
}

export { getPreviousBranchName, getCommitsCurrentBranch, getLastDiff, getTaskName }
