import type { Metadata } from 'next';
import { buildMetadata, SITE_URL } from '@/lib/seo';
import MoneyLandingPage from '@/components/money-pages/MoneyLandingPage';

const PATH = '/villas-in-behror';
const title = 'Villas for Sale in Behror, Rajasthan';
const description =
  'Verified 3BHK & 4BHK villas and independent houses for sale in Behror, Rajasthan. Gated township projects on the Delhi–Jaipur NH-48 corridor. Transparent pricing, free site visit.';

export const metadata: Metadata = buildMetadata({
  title,
  description,
  alternates: { canonical: `${SITE_URL}${PATH}` },
  openGraph: { title, description, url: `${SITE_URL}${PATH}` },
});

export default function VillasInBehrorPage() {
  return <MoneyLandingPage locationSlug="behror" type="villa" path={PATH} />;
}
