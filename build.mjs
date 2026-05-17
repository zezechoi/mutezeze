// Mutezeze OS — static build with env var injection.
// Walks the source tree, finds every *.html, replaces __SUPABASE_URL__ /
// __SUPABASE_ANON_KEY__ placeholders with process.env values, copies the
// result (preserving directory structure) into dist/.

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.join(ROOT, 'dist');

const SKIP_DIRS = new Set(['dist', 'node_modules', '.git', '.vercel']);

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || '';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn('⚠️  SUPABASE_URL or SUPABASE_ANON_KEY missing — pages will not fetch data.');
}

async function findHtmlFiles(dir, rel = '') {
  const out = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    const r = rel ? `${rel}/${e.name}` : e.name;
    if (e.isDirectory()) {
      if (SKIP_DIRS.has(e.name) || e.name.startsWith('.')) continue;
      out.push(...await findHtmlFiles(full, r));
    } else if (e.isFile() && e.name.endsWith('.html')) {
      out.push(r);
    }
  }
  return out;
}

await fs.rm(DIST, { recursive: true, force: true });
await fs.mkdir(DIST, { recursive: true });

const files = await findHtmlFiles(ROOT);
files.sort();

for (const file of files) {
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

console.log(`done · ${files.length} files → ${DIST}`);
