import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import { promisify } from 'util';
import logger from '../utils/logger.js';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const WORKSPACE_ROOT = path.join(__dirname, '../../../workspace');

export const TOOLS = {
  read_file: {
    type: 'function',
    function: {
      name: 'read_file',
      description: 'Read the contents of a file',
      parameters: {
        type: 'object',
        properties: {
          file_path: {
            type: 'string',
            description: 'The path to the file to read'
          }
        },
        required: ['file_path']
      }
    }
  },
  write_file: {
    type: 'function',
    function: {
      name: 'write_file',
      description: 'Write content to a file',
      parameters: {
        type: 'object',
        properties: {
          file_path: {
            type: 'string',
            description: 'The path to the file to write'
          },
          content: {
            type: 'string',
            description: 'The content to write to the file'
          }
        },
        required: ['file_path', 'content']
      }
    }
  },
  list_files: {
    type: 'function',
    function: {
      name: 'list_files',
      description: 'List files in a directory',
      parameters: {
        type: 'object',
        properties: {
          directory: {
            type: 'string',
            description: 'The directory to list files from'
          },
          pattern: {
            type: 'string',
            description: 'Optional pattern to filter files (e.g., *.js)'
          }
        },
        required: ['directory']
      }
    }
  },
  run_command: {
    type: 'function',
    function: {
      name: 'run_command',
      description: 'Execute a shell command',
      parameters: {
        type: 'object',
        properties: {
          command: {
            type: 'string',
            description: 'The command to execute'
          },
          cwd: {
            type: 'string',
            description: 'Working directory for the command'
          }
        },
        required: ['command']
      }
    }
  },
  create_directory: {
    type: 'function',
    function: {
      name: 'create_directory',
      description: 'Create a directory',
      parameters: {
        type: 'object',
        properties: {
          directory: {
            type: 'string',
            description: 'The directory path to create'
          }
        },
        required: ['directory']
      }
    }
  },
  delete_file: {
    type: 'function',
    function: {
      name: 'delete_file',
      description: 'Delete a file or directory',
      parameters: {
        type: 'object',
        properties: {
          file_path: {
            type: 'string',
            description: 'The path to the file or directory to delete'
          }
        },
        required: ['file_path']
      }
    }
  }
};

async function executeTool(toolName, args) {
  const safePath = (p) => {
    const resolved = path.resolve(p);
    if (!resolved.startsWith(WORKSPACE_ROOT) && !path.isAbsolute(p)) {
      return path.join(WORKSPACE_ROOT, p);
    }
    return resolved;
  };

  try {
    switch (toolName) {
      case 'read_file': {
        const filePath = safePath(args.file_path);
        logger.info(`Reading file: ${filePath}`);
        const content = fs.readFileSync(filePath, 'utf-8');
        return { success: true, content };
      }

      case 'write_file': {
        const filePath = safePath(args.file_path);
        const dir = path.dirname(filePath);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        logger.info(`Writing file: ${filePath}`);
        fs.writeFileSync(filePath, args.content, 'utf-8');
        return { success: true, message: 'File written successfully' };
      }

      case 'list_files': {
        const dir = safePath(args.directory);
        logger.info(`Listing directory: ${dir}`);
        const files = fs.readdirSync(dir);
        let result = files;
        if (args.pattern) {
          const regex = new RegExp(args.pattern.replace('*', '.*'));
          result = files.filter(f => regex.test(f));
        }
        return { success: true, files: result };
      }

      case 'run_command': {
        const cwd = args.cwd ? safePath(args.cwd) : WORKSPACE_ROOT;
        logger.info(`Running command: ${args.command} in ${cwd}`);
        const { stdout, stderr } = await execAsync(args.command, { 
          cwd,
          maxBuffer: 10 * 1024 * 1024,
          timeout: 30000
        });
        return { 
          success: true, 
          stdout: stdout.trim(),
          stderr: stderr.trim()
        };
      }

      case 'create_directory': {
        const dir = safePath(args.directory);
        logger.info(`Creating directory: ${dir}`);
        fs.mkdirSync(dir, { recursive: true });
        return { success: true, message: 'Directory created successfully' };
      }

      case 'delete_file': {
        const filePath = safePath(args.file_path);
        logger.info(`Deleting: ${filePath}`);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
          fs.rmSync(filePath, { recursive: true, force: true });
        } else {
          fs.unlinkSync(filePath);
        }
        return { success: true, message: 'Deleted successfully' };
      }

      default:
        return { success: false, error: `Unknown tool: ${toolName}` };
    }
  } catch (error) {
    logger.error(`Tool execution error: ${toolName}`, error);
    return { success: false, error: error.message };
  }
}

export async function executeTools(toolCalls) {
  const results = [];
  
  for (const toolCall of toolCalls) {
    const { function: func } = toolCall;
    const args = typeof func.arguments === 'string' 
      ? JSON.parse(func.arguments) 
      : func.arguments;
    
    const result = await executeTool(func.name, args);
    results.push({
      tool_call_id: toolCall.id,
      role: 'tool',
      content: JSON.stringify(result)
    });
  }
  
  return results;
}

export function getAvailableTools() {
  return Object.values(TOOLS);
}
