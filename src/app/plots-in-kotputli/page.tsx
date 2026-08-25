import type { Metadata } from 'next';
import { buildMetadata, SITE_URL } from '@/lib/seo';
import MoneyLandingPage from '@/components/money-pages/MoneyLandingPage';

const PATH = '/plots-in-kotputli';
const title = 'Plots for Sale in Kotputli, Rajasthan';
const description =
  'Verified residential plots for sale in Kotputli, Rajasthan — most affordable plots on the NH-48 corridor, 55 km from Jaipur. Freehold title, transparent pricing, free site visit.';

export const metadata: Metadata = buildMetadata({
  title,
  description,
  alternates: { canonical: `${SITE_URL}${PATH}` },
  openGraph: { title, description, url: `${SITE_URL}${PATH}` },
});

export default function PlotsInKotputliPage() {
  return <MoneyLandingPage locationSlug="kotputli" type="plot" path={PATH} />;
}
