export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'docs',
        'style',
        'refactor',
        'perf',
        'test',
        'build',
        'ci',
        'chore',
        'revert',
      ],
    ],
    'scope-enum': [
      2,
      'always',
      [
        'cli',
        'config',
        'github',
        'prompts',
        'actions',
        'detectors',
        'flows',
        'utils',
        'docs',
        'deps',
        'release',
      ],
    ],
  },
}
