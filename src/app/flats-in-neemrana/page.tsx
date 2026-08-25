import type { Metadata } from 'next';
import { buildMetadata, SITE_URL } from '@/lib/seo';
import MoneyLandingPage from '@/components/money-pages/MoneyLandingPage';

const PATH = '/flats-in-neemrana';
const title = 'Flats for Sale in Neemrana, Rajasthan';
const description =
  'Verified 1BHK–3BHK flats and apartments for sale in Neemrana, Rajasthan. Society complexes near the Japanese Industrial Zone. Bank loan available. Free site visit.';

export const metadata: Metadata = buildMetadata({
  title,
  description,
  alternates: { canonical: `${SITE_URL}${PATH}` },
  openGraph: { title, description, url: `${SITE_URL}${PATH}` },
});

export default function FlatsInNeemranaPage() {
  return <MoneyLandingPage locationSlug="neemrana" type="flat" path={PATH} />;
}
