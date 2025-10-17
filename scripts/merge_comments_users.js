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
  const postId = 10;
  const limit = 10;
  const offset = 0;

  const { data: comments, error: commentsErr } = await supabase
    .from('comments')
    .select('id, post_id, parent_id, author_id, content, created_at')
    .eq('post_id', postId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (commentsErr) return console.error('commentsErr', commentsErr);
  console.log('raw comments:', comments);

  const authorIds = Array.from(new Set(comments.map((c) => c.author_id).filter(Boolean)));
  const { data: users } = await supabase.from('users').select('*').in('id', authorIds);
  console.log('users:', users);

  const usersMap = new Map();
  users.forEach(u => usersMap.set(String(u.id), u));
  const merged = comments.map(c => ({...c, users: usersMap.get(String(c.author_id)) ?? null}));
  console.log('merged:', merged);
})();
