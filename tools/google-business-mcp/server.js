/**
 * server.js — Google Business Profile MCP Server
 *
 * A custom stdio MCP server that wraps the Google Business Profile API
 * directly using your own Google Cloud credentials — no third-party
 * gateway or shared quota.
 *
 * Setup:
 *   1. Place credentials.json in this directory (from Google Cloud Console)
 *   2. Run:  node auth.js   (one-time browser login, saves token.json)
 *   3. Register in mcp_config.json and restart the IDE
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

import { loadAuth } from './auth.js';
import { listAccounts } from './tools/accounts.js';
import {
  listLocations,
  getLocation,
  getGoogleUpdatedLocation,
} from './tools/locations.js';
import { getLocationAttributes, listAvailableAttributes } from './tools/attributes.js';
import { getDailyMetrics, getSearchKeywords, VALID_METRICS } from './tools/metrics.js';

// ─── Tool Definitions ────────────────────────────────────────────────────────

const TOOLS = [
  {
    name: 'list_accounts',
    description:
      'Lists all Google Business Profile accounts associated with your Google account. ' +
      'Returns account IDs, names, types, roles, and verification status.',
    inputSchema: { type: 'object', properties: {}, required: [] },
  },
  {
    name: 'list_locations',
    description:
      'Lists all business locations under a Google Business account. ' +
      'Returns full details: name, address, phone, website, hours, categories, coordinates, and Maps URL.',
    inputSchema: {
      type: 'object',
      properties: {
        account_id: {
          type: 'string',
          description:
            'The account ID or full name (e.g. "123456789" or "accounts/123456789"). ' +
            'If omitted, lists locations for the first account found.',
        },
      },
      required: [],
    },
  },
  {
    name: 'get_location',
    description:
      'Gets the full details for a specific business location as last set by the merchant.',
    inputSchema: {
      type: 'object',
      properties: {
        location_name: {
          type: 'string',
          description: 'The location resource name, e.g. "locations/12345678901234567".',
        },
      },
      required: ['location_name'],
    },
  },
  {
    name: 'get_google_updated_location',
    description:
      'Gets the live, Google-verified version of a location as it appears on Google Maps and Search. ' +
      'Also shows what fields differ from what the merchant has set.',
    inputSchema: {
      type: 'object',
      properties: {
        location_name: {
          type: 'string',
          description: 'The location resource name, e.g. "locations/12345678901234567".',
        },
      },
      required: ['location_name'],
    },
  },
  {
    name: 'get_location_attributes',
    description:
      'Gets all attributes set on a location (e.g. wheelchair accessible, Wi-Fi, payment options).',
    inputSchema: {
      type: 'object',
      properties: {
        location_name: {
          type: 'string',
          description: 'The location resource name.',
        },
      },
      required: ['location_name'],
    },
  },
  {
    name: 'list_available_attributes',
    description:
      'Lists all attributes available for a given business category and region ' +
      '(useful for knowing what you can set on a location).',
    inputSchema: {
      type: 'object',
      properties: {
        category_name: {
          type: 'string',
          description: 'The category name ID (e.g. "gcid:restaurant").',
        },
        region_code: {
          type: 'string',
          description: 'ISO 3166-1 alpha-2 country code. Default: "DE".',
        },
        language_code: {
          type: 'string',
          description: 'BCP 47 language code. Default: "en".',
        },
      },
      required: ['category_name'],
    },
  },
  {
    name: 'get_daily_metrics',
    description:
      'Returns daily performance metrics for a business location over a date range. ' +
      'Includes impressions on Maps/Search (desktop & mobile), call clicks, website clicks, ' +
      'direction requests, bookings, and food orders.',
    inputSchema: {
      type: 'object',
      properties: {
        location_name: {
          type: 'string',
          description: 'The location resource name, e.g. "locations/12345678901234567".',
        },
        metrics: {
          type: 'array',
          items: { type: 'string', enum: VALID_METRICS },
          description:
            'Which metrics to fetch. Defaults to all impressions + CALL_CLICKS + WEBSITE_CLICKS + BUSINESS_DIRECTION_REQUESTS.',
        },
        start_date: {
          type: 'string',
          description: 'Start date in YYYY-MM-DD format. Default: 30 days ago.',
        },
        end_date: {
          type: 'string',
          description: 'End date in YYYY-MM-DD format. Default: today.',
        },
      },
      required: ['location_name'],
    },
  },
  {
    name: 'get_search_keywords',
    description:
      'Returns the top search keywords people used to find this business on Google Search and Maps, ' +
      'aggregated monthly.',
    inputSchema: {
      type: 'object',
      properties: {
        location_name: {
          type: 'string',
          description: 'The location resource name.',
        },
        start_month: {
          type: 'string',
          description: 'Start month in YYYY-MM format. Default: 3 months ago.',
        },
        end_month: {
          type: 'string',
          description: 'End month in YYYY-MM format. Default: current month.',
        },
      },
      required: ['location_name'],
    },
  },
];

// ─── Server Bootstrap ────────────────────────────────────────────────────────

const server = new Server(
  { name: 'google-business-mcp', version: '1.0.0' },
  { capabilities: { tools: {} } }
);

let auth = null;

async function getAuth() {
  if (!auth) {
    auth = await loadAuth();
  }
  return auth;
}

// ─── Tool Handlers ───────────────────────────────────────────────────────────

server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: TOOLS }));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args = {} } = request.params;

  try {
    const client = await getAuth();
    let result;

    switch (name) {
      case 'list_accounts': {
        result = await listAccounts(client);
        break;
      }

      case 'list_locations': {
        let accountId = args.account_id;
        if (!accountId) {
          // Auto-discover first account
          const accounts = await listAccounts(client);
          if (typeof accounts === 'string') {
            result = accounts;
            break;
          }
          accountId = accounts[0]?.name;
          if (!accountId) {
            result = 'No accounts found.';
            break;
          }
        }
        result = await listLocations(client, accountId);
        break;
      }

      case 'get_location': {
        result = await getLocation(client, args.location_name);
        break;
      }

      case 'get_google_updated_location': {
        result = await getGoogleUpdatedLocation(client, args.location_name);
        break;
      }

      case 'get_location_attributes': {
        result = await getLocationAttributes(client, args.location_name);
        break;
      }

      case 'list_available_attributes': {
        result = await listAvailableAttributes(
          client,
          args.category_name,
          args.region_code,
          args.language_code
        );
        break;
      }

      case 'get_daily_metrics': {
        result = await getDailyMetrics(
          client,
          args.location_name,
          args.metrics,
          args.start_date,
          args.end_date
        );
        break;
      }

      case 'get_search_keywords': {
        result = await getSearchKeywords(
          client,
          args.location_name,
          args.start_month,
          args.end_month
        );
        break;
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }

    return {
      content: [
        {
          type: 'text',
          text: typeof result === 'string' ? result : JSON.stringify(result, null, 2),
        },
      ],
    };
  } catch (err) {
    const msg = err?.response?.data?.error?.message || err?.message || String(err);
    return {
      content: [{ type: 'text', text: `Error: ${msg}` }],
      isError: true,
    };
  }
});

// ─── Start ───────────────────────────────────────────────────────────────────

const transport = new StdioServerTransport();
await server.connect(transport);
// Intentionally silent — MCP servers communicate via stdio only
