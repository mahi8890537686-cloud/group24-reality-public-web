/**
 * tools/accounts.js — list_accounts tool
 * Uses My Business Account Management API v1
 */

import { google } from 'googleapis';

/**
 * @param {import('google-auth-library').OAuth2Client} auth
 */
export async function listAccounts(auth) {
  const accountMgmt = google.mybusinessaccountmanagement({ version: 'v1', auth });

  const res = await accountMgmt.accounts.list();
  const accounts = res.data.accounts || [];

  if (accounts.length === 0) {
    return 'No Google Business accounts found for this Google account.';
  }

  return accounts.map((acc) => ({
    name: acc.name,          // e.g. "accounts/123456789"
    accountName: acc.accountName,
    type: acc.type,
    role: acc.role,
    state: acc.accountStatus,
    verificationState: acc.verificationState,
    vettedState: acc.vettedState,
  }));
}
