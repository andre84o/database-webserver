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

loadEnvFile(path.resolve(process.cwd(), '.env.local'));
loadEnvFile(path.resolve(process.cwd(), '.env'));

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(2);
}

(async () => {
  const supabase = createClient(supabaseUrl, serviceKey);
  // author ids from the comments we saw earlier
  const authorIds = [
    '7f5cba1b-48d8-4a2e-a5ef-853af9907b6e'
  ];

  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .in('id', authorIds);

    if (error) {
      console.error('users select error:', error);
      process.exit(3);
    }

    console.log('users rows:');
    console.dir(data, { depth: 4 });
  } catch (err) {
    console.error('Unexpected error:', err);
  }
})();
