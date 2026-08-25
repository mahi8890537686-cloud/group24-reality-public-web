import type { Metadata } from 'next';
import { buildMetadata, SITE_URL } from '@/lib/seo';
import MoneyLandingPage from '@/components/money-pages/MoneyLandingPage';

const PATH = '/flats-in-kotputli';
const title = 'Flats for Sale in Kotputli, Rajasthan';
const description =
  'Verified 1BHK–3BHK flats and apartments for sale in Kotputli, Rajasthan — most affordable apartments on the NH-48 corridor, 55 km from Jaipur. Bank loan available. Free site visit.';

export const metadata: Metadata = buildMetadata({
  title,
  description,
  alternates: { canonical: `${SITE_URL}${PATH}` },
  openGraph: { title, description, url: `${SITE_URL}${PATH}` },
});

export default function FlatsInKotputliPage() {
  return <MoneyLandingPage locationSlug="kotputli" type="flat" path={PATH} />;
}
