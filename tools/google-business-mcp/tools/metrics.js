/**
 * tools/metrics.js — performance metrics tools
 * Uses Business Profile Performance API v1
 */

import { google } from 'googleapis';

function getApi(auth) {
  return google.businessprofileperformance({ version: 'v1', auth });
}

const VALID_METRICS = [
  'BUSINESS_IMPRESSIONS_DESKTOP_MAPS',
  'BUSINESS_IMPRESSIONS_DESKTOP_SEARCH',
  'BUSINESS_IMPRESSIONS_MOBILE_MAPS',
  'BUSINESS_IMPRESSIONS_MOBILE_SEARCH',
  'BUSINESS_CONVERSATIONS',
  'BUSINESS_DIRECTION_REQUESTS',
  'CALL_CLICKS',
  'WEBSITE_CLICKS',
  'BUSINESS_BOOKINGS',
  'BUSINESS_FOOD_ORDERS',
  'BUSINESS_FOOD_MENU_CLICKS',
];

/**
 * Get daily metrics for a location over a date range.
 * @param {import('google-auth-library').OAuth2Client} auth
 * @param {string} locationName  e.g. "locations/12345678901234567"
 * @param {string[]} metrics     Array of metric names (defaults to all impressions + clicks)
 * @param {string} startDate     "YYYY-MM-DD"
 * @param {string} endDate       "YYYY-MM-DD"
 */
export async function getDailyMetrics(auth, locationName, metrics, startDate, endDate) {
  const api = getApi(auth);
  const name = locationName.startsWith('locations/')
    ? locationName
    : `locations/${locationName}`;

  const selectedMetrics = (metrics && metrics.length > 0) ? metrics : [
    'BUSINESS_IMPRESSIONS_DESKTOP_SEARCH',
    'BUSINESS_IMPRESSIONS_MOBILE_SEARCH',
    'BUSINESS_IMPRESSIONS_DESKTOP_MAPS',
    'BUSINESS_IMPRESSIONS_MOBILE_MAPS',
    'CALL_CLICKS',
    'WEBSITE_CLICKS',
    'BUSINESS_DIRECTION_REQUESTS',
  ];

  const [sy, sm, sd] = (startDate || daysAgo(30)).split('-').map(Number);
  const [ey, em, ed] = (endDate || today()).split('-').map(Number);

  const res = await api.locations.fetchMultiDailyMetricsTimeSeries({
    location: name,
    dailyMetrics: selectedMetrics,
    'dailyRange.startDate.year': sy,
    'dailyRange.startDate.month': sm,
    'dailyRange.startDate.day': sd,
    'dailyRange.endDate.year': ey,
    'dailyRange.endDate.month': em,
    'dailyRange.endDate.day': ed,
  });

  const series = res.data.multiDailyMetricTimeSeries || [];
  const result = {};
  for (const item of series) {
    for (const metricSeries of (item.dailyMetricTimeSeries || [])) {
      const metricName = metricSeries.dailyMetric;
      const values = (metricSeries.timeSeries?.datedValues || []).map((dv) => ({
        date: dv.date ? `${dv.date.year}-${String(dv.date.month).padStart(2,'0')}-${String(dv.date.day).padStart(2,'0')}` : null,
        value: dv.value !== undefined ? Number(dv.value) : null,
      }));
      const total = values.reduce((sum, v) => sum + (v.value || 0), 0);
      result[metricName] = { total, daily: values };
    }
  }
  return result;
}

/**
 * Get top search keywords for a location.
 */
export async function getSearchKeywords(auth, locationName, startMonth, endMonth) {
  const api = getApi(auth);
  const name = locationName.startsWith('locations/')
    ? locationName
    : `locations/${locationName}`;

  const [sy, sm] = (startMonth || monthsAgo(3)).split('-').map(Number);
  const [ey, em] = (endMonth || thisMonth()).split('-').map(Number);

  const res = await api.locations.searchkeywords.impressions.monthly.list({
    parent: `${name}/searchkeywords/impressions/monthly`,
    'monthlyRange.startMonth.year': sy,
    'monthlyRange.startMonth.month': sm,
    'monthlyRange.endMonth.year': ey,
    'monthlyRange.endMonth.month': em,
    pageSize: 100,
  });

  const keywords = res.data.searchKeywordsCounts || [];
  return keywords.map((kw) => ({
    keyword: kw.searchKeyword,
    impressions: kw.insightsValue?.value || kw.insightsValue?.threshold || 'threshold',
  }));
}

export { VALID_METRICS };

// Date helpers
function today() {
  return new Date().toISOString().split('T')[0];
}
function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().split('T')[0];
}
function thisMonth() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}
function monthsAgo(n) {
  const d = new Date();
  d.setMonth(d.getMonth() - n);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}
