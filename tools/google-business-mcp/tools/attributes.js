/**
 * tools/attributes.js — location attribute tools
 * Uses My Business Business Information API v1
 */

import { google } from 'googleapis';

function getApi(auth) {
  return google.mybusinessbusinessinformation({ version: 'v1', auth });
}

/**
 * Get all attributes for a location.
 */
export async function getLocationAttributes(auth, locationName) {
  const api = getApi(auth);
  const name = locationName.startsWith('locations/')
    ? locationName
    : `locations/${locationName}`;

  const res = await api.locations.attributes.getGoogleUpdated({
    name: `${name}/attributes`,
  });

  const attrs = res.data.attributes || [];
  return attrs.map((attr) => ({
    id: attr.name,
    valueType: attr.valueType,
    values: attr.values,
    uriValues: attr.uriValues,
    repeatedEnumValue: attr.repeatedEnumValue,
  }));
}

/**
 * List all attributes available for a given category + region.
 */
export async function listAvailableAttributes(auth, categoryName, regionCode, languageCode) {
  const api = getApi(auth);

  const res = await api.attributes.list({
    parent: `categories/${categoryName}`,
    regionCode: regionCode || 'DE',
    languageCode: languageCode || 'en',
    pageSize: 200,
  });

  const attrs = res.data.attributes || [];
  return attrs.map((attr) => ({
    name: attr.name,
    displayName: attr.displayName,
    groupDisplayName: attr.groupDisplayName,
    valueType: attr.valueType,
    values: attr.values,
    isDeprecated: attr.isDeprecated,
  }));
}
