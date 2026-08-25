// Quick test script — fetches accounts + locations with retry backoff
import { loadAuth } from './auth.js';
import { google } from 'googleapis';

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function retry(fn, label, attempts = 3, delayMs = 5000) {
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (err) {
      const code = err?.status || err?.code;
      const msg = err?.response?.data?.error?.message || err?.message || String(err);
      if (code === 429 && i < attempts - 1) {
        console.log(`[${label}] Rate limited. Waiting ${delayMs/1000}s before retry ${i+2}/${attempts}...`);
        await sleep(delayMs);
        delayMs *= 2; // exponential backoff
      } else {
        throw err;
      }
    }
  }
}

const auth = await loadAuth();

// Disable auto-retry so we control it ourselves
const accountMgmt = google.mybusinessaccountmanagement({
  version: 'v1',
  auth,
  retryConfig: { retry: 0 }, // no automatic retries
});

console.log('\n=== ACCOUNTS ===');
const accountsRes = await retry(
  () => accountMgmt.accounts.list(),
  'list_accounts'
);
const accounts = accountsRes.data.accounts || [];
console.log(JSON.stringify(accounts.map(a => ({
  name: a.name,
  accountName: a.accountName,
  type: a.type,
  role: a.role,
  state: a.accountStatus,
})), null, 2));

if (accounts.length > 0) {
  const accountId = accounts[0].name;

  await sleep(3000); // be gentle on quota

  const bizInfo = google.mybusinessbusinessinformation({
    version: 'v1',
    auth,
    retryConfig: { retry: 0 },
  });

  console.log(`\n=== LOCATIONS for ${accountId} ===`);
  const locRes = await retry(
    () => bizInfo.accounts.locations.list({
      parent: accountId,
      readMask: 'name,title,phoneNumbers,address,websiteUri,categories,openInfo,profile,metadata',
      pageSize: 20,
    }),
    'list_locations'
  );

  const locations = locRes.data.locations || [];
  console.log(JSON.stringify(locations, null, 2));
}
