# Google Business Profile MCP Server

A custom MCP (Model Context Protocol) server that wraps the **Google Business Profile API** directly using your own Google Cloud credentials. No third-party gateways, no shared quota.

## Tools Exposed

| Tool | Description |
|---|---|
| `list_accounts` | All Business accounts on your Google account |
| `list_locations` | All locations with full details (address, hours, phone, category) |
| `get_location` | Single location details |
| `get_google_updated_location` | Live version from Google Maps |
| `get_location_attributes` | Attributes (Wi-Fi, payments, accessibility…) |
| `list_available_attributes` | Available attributes for a category/region |
| `get_daily_metrics` | Daily impressions, calls, clicks, directions (last 30 days by default) |
| `get_search_keywords` | Top search terms that drove traffic to your listing |

## Setup

### 1. Google Cloud — One Time

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. **Enable these 3 APIs**:
   - `My Business Business Information API`
   - `My Business Account Management API`
   - `Business Profile Performance API`
3. **Create OAuth 2.0 credentials**:
   - APIs & Services → Credentials → Create → OAuth client ID
   - Type: **Desktop app**
   - Download `credentials.json` and place it in this folder
4. **Configure consent screen**:
   - Add your Google account as a test user
   - Scope: `https://www.googleapis.com/auth/business.manage`

### 2. Install & Authenticate

```powershell
cd tools\google-business-mcp
npm install
node auth.js   # Opens browser, saves token.json
```

### 3. Register in Antigravity IDE

In `C:\Users\Mahendra\.gemini\config\mcp_config.json`, update the `google-business` entry:

```json
"google-business": {
  "command": "node",
  "args": ["C:\\Users\\Mahendra\\Desktop\\group24-public\\tools\\google-business-mcp\\server.js"]
}
```

Then **restart the IDE**. The server will be auto-loaded.

## Security

- `credentials.json` and `token.json` are in `.gitignore` — never committed
- The server runs locally; your credentials never leave your machine
