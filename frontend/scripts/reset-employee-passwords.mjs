import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const DEFAULT_PASSWORD = '123456';

function readFrontendEnv() {
  const envPath = resolve(process.cwd(), '.env');
  const values = new Map();

  for (const line of readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const separatorIndex = trimmed.indexOf('=');
    if (separatorIndex === -1) continue;

    values.set(trimmed.slice(0, separatorIndex), trimmed.slice(separatorIndex + 1));
  }

  return values;
}

const frontendEnv = readFrontendEnv();
const supabaseUrl = process.env.SUPABASE_URL || frontendEnv.get('VITE_SUPABASE_URL');
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || frontendEnv.get('SUPABASE_SERVICE_ROLE_KEY');
const newPassword = process.env.EMPLOYEE_TEST_PASSWORD || DEFAULT_PASSWORD;

if (!supabaseUrl) {
  console.error('Missing SUPABASE_URL or VITE_SUPABASE_URL in frontend/.env.');
  process.exit(1);
}

if (!serviceRoleKey) {
  console.error('Missing SUPABASE_SERVICE_ROLE_KEY. This key is required to reset Auth user passwords.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const { data: employees, error: profilesError } = await supabase
  .from('profiles')
  .select('id,name,email')
  .eq('role', 'employee')
  .order('name', { ascending: true });

if (profilesError) {
  console.error(`Failed to load employee profiles: ${profilesError.message}`);
  process.exit(1);
}

if (!employees?.length) {
  console.log('No employee profiles found.');
  process.exit(0);
}

const results = [];

for (const employee of employees) {
  const { error } = await supabase.auth.admin.updateUserById(employee.id, {
    password: newPassword,
  });

  results.push({
    name: employee.name,
    email: employee.email,
    status: error ? `failed: ${error.message}` : 'updated',
  });
}

console.table(results);
console.log(`Password applied to updated employees: ${newPassword}`);
