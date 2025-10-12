import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

/**
 * Executes a shell command and returns stdout
 * Throws error if command fails
 */
export async function runCommand(command: string, cwd: string): Promise<string> {
  const { stdout } = await execAsync(command, { cwd })
  return stdout.trim()
}

/**
 * Executes a command and returns success/failure
 * Does not throw on error
 */
export async function tryCommand(
  command: string,
  cwd: string
): Promise<{ success: boolean; output?: string; error?: string }> {
  try {
    const output = await runCommand(command, cwd)
    return { success: true, output }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || String(error),
    }
  }
}

/**
 * Checks if a command exists in PATH
 */
export async function commandExists(command: string): Promise<boolean> {
  const checkCommand = process.platform === 'win32' ? `where ${command}` : `command -v ${command}`

  const result = await tryCommand(checkCommand, process.cwd())
  return result.success
}
