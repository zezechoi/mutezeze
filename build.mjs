// Mutezeze OS — static build with env var injection.
// Reads HTML from this folder, replaces __SUPABASE_URL__ / __SUPABASE_ANON_KEY__
// with the values from process.env, writes the result to dist/.

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.join(ROOT, 'dist');

const FILES = [
  'index.html',
  'today/index.html',
  'insights/index.html',
  'diary/index.html',
  'about/index.html',
  'index/index.html'
];

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || '';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn('⚠️  SUPABASE_URL or SUPABASE_ANON_KEY missing — pages will not fetch data.');
}

await fs.rm(DIST, { recursive: true, force: true });
await fs.mkdir(DIST, { recursive: true });

for (const file of FILES) {
  const srcPath = path.join(ROOT, file);
  const dstPath = path.join(DIST, file);
  await fs.mkdir(path.dirname(dstPath), { recursive: true });

  let content = await fs.readFile(srcPath, 'utf8');
  content = content
    .replaceAll('__SUPABASE_URL__', SUPABASE_URL)
    .replaceAll('__SUPABASE_ANON_KEY__', SUPABASE_ANON_KEY);
  await fs.writeFile(dstPath, content, 'utf8');
  console.log(`build · ${file}`);
}

console.log(`done → ${DIST}`);
