import type { Metadata } from 'next';
import { buildMetadata, SITE_URL } from '@/lib/seo';
import MoneyLandingPage from '@/components/money-pages/MoneyLandingPage';

const PATH = '/flats-in-behror';
const title = 'Flats for Sale in Behror, Rajasthan';
const description =
  'Verified 1BHK-3BHK flats for sale in Behror, Rajasthan — well-maintained society apartments on the NH-48 corridor. Transparent pricing, verified listings.';

export const metadata: Metadata = buildMetadata({
  title,
  description,
  alternates: { canonical: `${SITE_URL}${PATH}` },
  openGraph: { title, description, url: `${SITE_URL}${PATH}` },
});

export default function FlatsInBehrorPage() {
  return <MoneyLandingPage locationSlug="behror" type="flat" path={PATH} />;
}
