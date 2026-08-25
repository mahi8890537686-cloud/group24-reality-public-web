/**
 * tools/locations.js — location tools
 * Uses My Business Business Information API v1
 */

import { google } from 'googleapis';

const READ_MASK = [
  'name', 'title', 'phoneNumbers', 'address', 'websiteUri',
  'regularHours', 'specialHours', 'openInfo', 'profile',
  'categories', 'latlng', 'serviceArea', 'labels', 'metadata',
  'relationshipData', 'moreHours', 'serviceItems',
].join(',');

function getApi(auth) {
  return google.mybusinessbusinessinformation({ version: 'v1', auth });
}

/**
 * List all locations for a given account.
 * @param {import('google-auth-library').OAuth2Client} auth
 * @param {string} accountId  e.g. "123456789" or "accounts/123456789"
 */
export async function listLocations(auth, accountId) {
  const api = getApi(auth);
  const parent = accountId.startsWith('accounts/')
    ? accountId
    : `accounts/${accountId}`;

  const res = await api.accounts.locations.list({
    parent,
    readMask: READ_MASK,
    pageSize: 100,
  });

  const locations = res.data.locations || [];
  if (locations.length === 0) {
    return `No locations found for account: ${parent}`;
  }
  return locations.map(formatLocation);
}

/**
 * Get a single location.
 * @param {import('google-auth-library').OAuth2Client} auth
 * @param {string} locationName  e.g. "locations/12345678901234567"
 */
export async function getLocation(auth, locationName) {
  const api = getApi(auth);
  const name = locationName.startsWith('locations/')
    ? locationName
    : `locations/${locationName}`;

  const res = await api.locations.get({ name, readMask: READ_MASK });
  return formatLocation(res.data);
}

/**
 * Get the Google-updated (live Maps) version of a location.
 */
export async function getGoogleUpdatedLocation(auth, locationName) {
  const api = getApi(auth);
  const name = locationName.startsWith('locations/')
    ? locationName
    : `locations/${locationName}`;

  const res = await api.locations.getGoogleUpdated({ name, readMask: READ_MASK });
  return {
    diffMask: res.data.diffMask,
    location: formatLocation(res.data.location),
    pendingMask: res.data.pendingMask,
  };
}

function formatLocation(loc) {
  if (!loc) return null;
  return {
    id: loc.name,
    title: loc.title,
    phone: loc.phoneNumbers?.primaryPhone,
    additionalPhones: loc.phoneNumbers?.additionalPhones,
    address: formatAddress(loc.address || loc.storefrontAddress),
    website: loc.websiteUri,
    coordinates: loc.latlng
      ? `${loc.latlng.latitude}, ${loc.latlng.longitude}`
      : null,
    primaryCategory: loc.categories?.primaryCategory?.displayName,
    additionalCategories: loc.categories?.additionalCategories?.map((c) => c.displayName),
    openStatus: loc.openInfo?.status,
    openingDate: loc.openInfo?.openingDate,
    description: loc.profile?.description,
    regularHours: loc.regularHours?.periods?.map(formatPeriod),
    labels: loc.labels,
    placeId: loc.metadata?.placeId,
    mapsUrl: loc.metadata?.mapsUri,
    newReviewUri: loc.metadata?.newReviewUri,
  };
}

function formatAddress(addr) {
  if (!addr) return null;
  return [
    ...(addr.addressLines || []),
    addr.locality,
    addr.administrativeArea,
    addr.postalCode,
    addr.regionCode,
  ]
    .filter(Boolean)
    .join(', ');
}

function formatPeriod(period) {
  const days = ['MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY','SUNDAY'];
  const open = period.openTime ? `${period.openTime.hours || 0}:${String(period.openTime.minutes || 0).padStart(2,'0')}` : '?';
  const close = period.closeTime ? `${period.closeTime.hours || 0}:${String(period.closeTime.minutes || 0).padStart(2,'0')}` : '?';
  return `${period.openDay}: ${open} – ${close}`;
}
