import type { Metadata } from 'next';
import { buildMetadata, SITE_URL } from '@/lib/seo';
import MoneyLandingPage from '@/components/money-pages/MoneyLandingPage';

const PATH = '/villas-in-neemrana';
const title = 'Villas for Sale in Neemrana, Rajasthan';
const description =
  'Verified 3BHK & 4BHK villas and independent houses for sale in Neemrana, Rajasthan — near the Japanese Industrial Zone on the DMIC corridor. Transparent pricing, free site visit.';

export const metadata: Metadata = buildMetadata({
  title,
  description,
  alternates: { canonical: `${SITE_URL}${PATH}` },
  openGraph: { title, description, url: `${SITE_URL}${PATH}` },
});

export default function VillasInNeemranaPage() {
  return <MoneyLandingPage locationSlug="neemrana" type="villa" path={PATH} />;
}
