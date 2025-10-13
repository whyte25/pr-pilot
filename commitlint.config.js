import { readdirSync } from 'fs'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const getSubdirectories = (dir) => {
  try {
    return readdirSync(dir, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name)
  } catch {
    return []
  }
}

const packages = getSubdirectories(resolve(__dirname, 'packages'))
const allowedScopes = [...packages, 'monorepo', 'repo', 'ci', 'docs', 'deps', 'release']

export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'docs', 'style', 'refactor', 'perf', 'test', 'build', 'ci', 'chore', 'revert'],
    ],
    'scope-enum': [2, 'always', allowedScopes],
    'scope-empty': [2, 'never'],
    'header-max-length': [2, 'always', 100],
    'body-max-line-length': [2, 'always', 400],
  },
}
