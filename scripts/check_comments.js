const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, 'utf8');
  content.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const idx = trimmed.indexOf('=');
    if (idx === -1) return;
    const key = trimmed.slice(0, idx);
    const val = trimmed.slice(idx + 1);
    if (!process.env[key]) process.env[key] = val;
  });
}

// Load .env.local and .env if present
loadEnvFile(path.resolve(process.cwd(), '.env.local'));
loadEnvFile(path.resolve(process.cwd(), '.env'));

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in env files (.env.local or .env)');
  process.exit(2);
}

(async () => {
  try {
    const supabase = createClient(supabaseUrl, serviceKey);
    // fetch count and a few rows
    const { data, error, count } = await supabase
      .from('comments')
      .select('id, post_id, parent_id, author_id, content, created_at', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(0, 9);

    if (error) {
      console.error('Supabase query error:', error);
      process.exit(3);
    }

    console.log('comments count (approx):', count ?? data?.length ?? 0);
    console.log('sample rows:');
    console.dir(data, { depth: 3 });
  } catch (err) {
    console.error('Unexpected error:', err);
    process.exit(4);
  }
})();
