/**
 * auth.js — Google OAuth2 helper for Google Business Profile API
 *
 * Supports both "web" and "installed" (Desktop) credential types.
 *
 * First run:  node auth.js
 *   → Opens browser at Google sign-in
 *   → Catches the OAuth redirect on http://localhost:4242/oauth2callback
 *   → Saves token.json for all future runs (auto-refresh)
 *
 * Subsequent runs: loadAuth() silently refreshes the token.
 */

import fs from 'fs';
import path from 'path';
import http from 'http';
import { fileURLToPath } from 'url';
import { google } from 'googleapis';
import open from 'open';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const CREDENTIALS_PATH = path.join(__dirname, 'credentials.json');
const TOKEN_PATH = path.join(__dirname, 'token.json');
const REDIRECT_PORT = 4242;
const REDIRECT_URI = `http://localhost:${REDIRECT_PORT}/oauth2callback`;

// Scopes required for Google Business Profile API
const SCOPES = ['https://www.googleapis.com/auth/business.manage'];

/**
 * Load saved credentials from token.json, or run the OAuth flow.
 * @returns {Promise<import('google-auth-library').OAuth2Client>}
 */
export async function loadAuth() {
  if (!fs.existsSync(CREDENTIALS_PATH)) {
    throw new Error(
      `❌ credentials.json not found at: ${CREDENTIALS_PATH}\n` +
      `Please place your Google Cloud OAuth credentials file there.`
    );
  }

  const raw = fs.readFileSync(CREDENTIALS_PATH, 'utf8');
  const keys = JSON.parse(raw);
  // Supports both "web" and "installed" credential types
  const creds = keys.installed || keys.web;
  const { client_id, client_secret } = creds;

  const oauth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    REDIRECT_URI
  );

  // Load existing token if available
  if (fs.existsSync(TOKEN_PATH)) {
    const token = JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf8'));
    oauth2Client.setCredentials(token);

    // Auto-save refreshed tokens
    oauth2Client.on('tokens', (newToken) => {
      const merged = { ...token, ...newToken };
      fs.writeFileSync(TOKEN_PATH, JSON.stringify(merged, null, 2));
    });

    return oauth2Client;
  }

  // No token — run the browser-based auth flow
  return await runAuthFlow(oauth2Client);
}

async function runAuthFlow(oauth2Client) {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: SCOPES,
  });

  // Start a local HTTP server to catch the OAuth redirect
  const code = await new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      const url = new URL(req.url, `http://localhost:${REDIRECT_PORT}`);
      if (url.pathname === '/oauth2callback') {
        const code = url.searchParams.get('code');
        const error = url.searchParams.get('error');

        if (error) {
          res.writeHead(400);
          res.end(`<h2>❌ Authorization failed: ${error}</h2><p>You can close this tab.</p>`);
          server.close();
          reject(new Error(`OAuth error: ${error}`));
          return;
        }

        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`
          <html><body style="font-family:sans-serif;text-align:center;padding:60px">
            <h2>✅ Authorization successful!</h2>
            <p>You can close this tab and return to the terminal.</p>
          </body></html>
        `);
        server.close();
        resolve(code);
      }
    });

    server.listen(REDIRECT_PORT, () => {
      process.stderr.write(`\n🔐 Google Business Profile — Authorization Required\n`);
      process.stderr.write(`Opening browser for sign-in...\n\n`);
      process.stderr.write(`If the browser doesn't open automatically, visit:\n${authUrl}\n\n`);
      open(authUrl).catch(() => {});
    });

    server.on('error', (err) => {
      reject(new Error(`Could not start local OAuth server on port ${REDIRECT_PORT}: ${err.message}`));
    });
  });

  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);
  fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens, null, 2));
  process.stderr.write('✅ Token saved to token.json — future runs will be automatic.\n\n');

  return oauth2Client;
}

// Allow running directly: node auth.js
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  loadAuth()
    .then(() => process.stderr.write('✅ Authentication successful!\n'))
    .catch((e) => { process.stderr.write(`❌ ${e.message}\n`); process.exit(1); });
}
