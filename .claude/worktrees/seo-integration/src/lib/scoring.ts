// Rule-based lead scoring — deliberately transparent (not ML) so an agent can see
// exactly why a lead scored what it scored, not just the number.
import type { ScoreBreakdownItem } from '@/types';

export interface ScoreInput {
  source: 'property-detail' | 'contact-page' | 'whatsapp' | 'manual' | 'import' | 'meta' | string;
  message?: string;
  email?: string;
  propertyTitle?: string;
  propertyType?: string;
  location?: string;
}

export interface ScoreResult {
  score: number;
  breakdown: ScoreBreakdownItem[];
}

const SOURCE_POINTS: Record<string, number> = {
  'property-detail': 30,
  'contact-page': 25,
  whatsapp: 35,
  meta: 40,
  manual: 15,
  import: 10,
};

function sourceLabel(source: string): string {
  const labels: Record<string, string> = {
    'property-detail': 'Property page enquiry',
    'contact-page': 'Contact form enquiry',
    whatsapp: 'WhatsApp enquiry',
    meta: 'Meta Ad lead',
    manual: 'Manually added',
    import: 'Imported',
  };
  return labels[source] ?? source;
}

export function scoreLead(input: ScoreInput): ScoreResult {
  const breakdown: ScoreBreakdownItem[] = [];

  const sourcePoints = SOURCE_POINTS[input.source] ?? 10;
  breakdown.push({ factor: sourceLabel(input.source), points: sourcePoints });

  const messageLength = (input.message ?? '').trim().length;
  let messagePoints = 0;
  if (messageLength > 100) messagePoints = 30;
  else if (messageLength >= 20) messagePoints = 20;
  else if (messageLength > 0) messagePoints = 10;
  if (messagePoints > 0) {
    breakdown.push({ factor: 'Message detail', points: messagePoints });
  }

  if (input.email) {
    breakdown.push({ factor: 'Provided email', points: 15 });
  }
  if (input.propertyTitle || input.propertyType || input.location) {
    breakdown.push({ factor: 'Specific property/location interest', points: 15 });
  }

  const total = breakdown.reduce((sum, item) => sum + item.points, 0);
  return { score: Math.min(100, total), breakdown };
}
