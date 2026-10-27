import fs from 'fs-extra';
import path from 'node:path';
import os from 'node:os';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';
import * as p from '@clack/prompts';
import pc from 'picocolors';

const execFileAsync = promisify(execFile);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const GITHUB_REPO = 'ivannofick/employee-agents';
const GITHUB_BRANCH = 'main';
const TARBALL_URL = `https://codeload.github.com/${GITHUB_REPO}/tar.gz/refs/heads/${GITHUB_BRANCH}`;

export interface AssetRoots {
  templateBase: string;
  adapterBase: string;
}

function findLocalAssetRoots(): AssetRoots | null {
  // If forced remote testing, skip local check
  if (process.env.EMPLOYEE_AGENTS_FORCE_REMOTE === 'true') {
    return null;
  }

  // 1. Environment variable override
  if (process.env.EMPLOYEE_AGENTS_DEV_ROOT) {
    const tPath = path.join(process.env.EMPLOYEE_AGENTS_DEV_ROOT, 'templates', 'myemployee');
    const aPath = path.join(process.env.EMPLOYEE_AGENTS_DEV_ROOT, 'adapters');
    if (fs.existsSync(tPath) && fs.existsSync(aPath)) {
      return { templateBase: tPath, adapterBase: aPath };
    }
  }

  // 2. Local dev-root marker file in user home (~/.employee-agents/dev-root)
  try {
    const devRootFile = path.join(os.homedir(), '.employee-agents', 'dev-root');
    if (fs.existsSync(devRootFile)) {
      const devPath = fs.readFileSync(devRootFile, 'utf8').trim();
      if (devPath) {
        const tPath = path.join(devPath, 'templates', 'myemployee');
        const aPath = path.join(devPath, 'adapters');
        if (fs.existsSync(tPath) && fs.existsSync(aPath)) {
          return { templateBase: tPath, adapterBase: aPath };
        }
      }
    }
  } catch {}

  // 3. Check relative to binary or execution directory
  const possibleRoots = [
    path.resolve(__dirname, '..'), // dist
    path.resolve(__dirname, '../..'), // dist/core or root
    path.resolve(__dirname, '../../..'),
    process.cwd(),
  ];

  for (const root of possibleRoots) {
    const tPath = path.join(root, 'templates', 'myemployee');
    const aPath = path.join(root, 'adapters');
    if (fs.existsSync(tPath) && fs.existsSync(aPath)) {
      return { templateBase: tPath, adapterBase: aPath };
    }
  }

  return null;
}

/**
 * Downloads latest templates and adapters from GitHub tarball.
 * Zero external tar dependencies; uses native Node fetch and OS tar.
 */
export async function downloadRemoteAssets(): Promise<AssetRoots> {
  const spinner = p.spinner();
  spinner.start(pc.cyan(`Fetching latest squad blueprints from GitHub (${GITHUB_REPO})...`));

  const tempDir = path.join(os.tmpdir(), `employee-agents-${Date.now()}`);
  const tarPath = path.join(tempDir, 'repo.tar.gz');
  const extractDir = path.join(tempDir, 'extracted');

  try {
    await fs.ensureDir(tempDir);
    await fs.ensureDir(extractDir);

    const response = await fetch(TARBALL_URL);
    if (!response.ok) {
      throw new Error(`Failed to download from GitHub (${response.status} ${response.statusText})`);
    }

    const arrayBuffer = await response.arrayBuffer();
    await fs.writeFile(tarPath, Buffer.from(arrayBuffer));

    // Extract tarball using OS native tar (--strip-components=1 to ignore root folder in archive)
    await execFileAsync('tar', ['-xzf', tarPath, '-C', extractDir, '--strip-components=1']);

    const templateBase = path.join(extractDir, 'templates', 'myemployee');
    const adapterBase = path.join(extractDir, 'adapters');

    if (!(await fs.pathExists(templateBase)) || !(await fs.pathExists(adapterBase))) {
      throw new Error('Downloaded archive does not contain expected templates and adapters.');
    }

    // Clean up downloaded tar file to save disk space
    await fs.remove(tarPath);

    spinner.stop(pc.green('Downloaded latest squad blueprints from GitHub!'));
    return { templateBase, adapterBase };
  } catch (error) {
    spinner.stop(pc.red('Failed to fetch blueprints from GitHub.'));
    // Clean up on failure
    await fs.remove(tempDir).catch(() => {});
    throw error;
  }
}

/**
 * Resolves asset roots:
 * 1. Uses local files if running inside the source development repository.
 * 2. Otherwise downloads fresh templates directly from GitHub.
 */
export async function resolveAssetRoots(): Promise<AssetRoots> {
  // If running in development source tree with templates present, use local
  const localRoots = findLocalAssetRoots();
  if (localRoots) {
    return localRoots;
  }

  // Running as installed npm package: fetch directly from GitHub
  return await downloadRemoteAssets();
}
