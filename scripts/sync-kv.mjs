import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const DATA_KEYS = ['history', 'skills', 'projects', 'topics', 'mindmap', 'about'];
const VALID_ACTIONS = new Set(['push', 'pull']);
const VALID_TARGETS = new Set(['local', 'remote']);

const [, , action, target = 'local'] = process.argv;

if (!VALID_ACTIONS.has(action) || !VALID_TARGETS.has(target)) {
  console.error('Usage: node scripts/sync-kv.mjs <push|pull> <local|remote>');
  process.exit(1);
}

const targetFlag = `--${target}`;

function runWrangler(args) {
  const result = spawnSync('npx', ['wrangler', ...args], {
    cwd: process.cwd(),
    encoding: 'utf8',
  });

  if (result.status !== 0) {
    if (result.stdout) process.stdout.write(result.stdout);
    if (result.stderr) process.stderr.write(result.stderr);
    process.exit(result.status ?? 1);
  }

  return result.stdout;
}

function assertJson(text, label) {
  try {
    return JSON.parse(text);
  } catch (error) {
    throw new Error(`${label} is not valid JSON: ${error.message}`);
  }
}

if (action === 'push') {
  const tempDir = mkdtempSync(join(tmpdir(), 'portfolio-kv-'));

  try {
    for (const key of DATA_KEYS) {
      const dataPath = join('data', `${key}.json`);
      const raw = readFileSync(dataPath, 'utf8');
      const formatted = `${JSON.stringify(assertJson(raw, dataPath), null, 2)}\n`;
      const tempPath = join(tempDir, `${key}.json`);

      writeFileSync(tempPath, formatted);
      runWrangler([
        'kv',
        'key',
        'put',
        key,
        '--binding=PORTFOLIO_DATA',
        targetFlag,
        `--path=${tempPath}`,
      ]);
      console.log(`pushed ${key} -> ${target} KV`);
    }
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
} else {
  for (const key of DATA_KEYS) {
    const output = runWrangler([
      'kv',
      'key',
      'get',
      key,
      '--binding=PORTFOLIO_DATA',
      targetFlag,
    ]);
    const formatted = `${JSON.stringify(assertJson(output, key), null, 2)}\n`;
    writeFileSync(join('data', `${key}.json`), formatted);
    console.log(`pulled ${key} <- ${target} KV`);
  }
}
