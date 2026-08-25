import type { Metadata } from 'next';
import { buildMetadata, SITE_URL } from '@/lib/seo';
import MoneyLandingPage from '@/components/money-pages/MoneyLandingPage';

const PATH = '/villas-in-kotputli';
const title = 'Villas for Sale in Kotputli, Rajasthan';
const description =
  'Verified 3BHK villas and independent houses for sale in Kotputli, Rajasthan — affordable premium living, 55 km from Jaipur on NH-48. Transparent pricing, free site visit.';

export const metadata: Metadata = buildMetadata({
  title,
  description,
  alternates: { canonical: `${SITE_URL}${PATH}` },
  openGraph: { title, description, url: `${SITE_URL}${PATH}` },
});

export default function VillasInKotputliPage() {
  return <MoneyLandingPage locationSlug="kotputli" type="villa" path={PATH} />;
}
