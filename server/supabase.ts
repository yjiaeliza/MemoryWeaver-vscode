/*import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables: SUPABASE_URL and SUPABASE_ANON_KEY are required');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

console.log('✅ Supabase connection initialized successfully');
console.log(`   Project URL: ${supabaseUrl}`);
*/

// ⚠️ 临时禁用 Supabase 逻辑，仅保留空导出防止报错
console.warn("⚠️ Supabase 已禁用，当前项目未连接数据库或云存储。");

export const supabase = null;
