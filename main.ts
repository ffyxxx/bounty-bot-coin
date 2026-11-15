import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

// make.fun coin bounty: hand the grader our LAUNCH.json.
// The entry is the coin itself; this just copies the launch proof.
const botDir = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(outDir, { recursive: true });

const src = resolve(join(botDir, 'LAUNCH.json'));
const dst = join(outDir, 'LAUNCH.json');

// sanity: LAUNCH.json must be a JSON object naming the coin's mint + create tx.
let launch: { mint?: string; create_signature?: string };
try {
  launch = JSON.parse(readFileSync(src, 'utf8'));
} catch (e) {
  console.error(`LAUNCH.json is not valid JSON: ${(e as Error).message}`);
  process.exit(1);
}
if (!launch.mint || !launch.create_signature) {
  console.error('LAUNCH.json is missing mint or create_signature');
  process.exit(1);
}

try {
  copyFileSync(src, dst);
} catch (e) {
  console.error(`cannot copy LAUNCH.json from ${botDir}: ${(e as Error).message}`);
  process.exit(1);
}
