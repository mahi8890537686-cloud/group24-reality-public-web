import type { Metadata } from 'next';
import { buildMetadata, SITE_URL } from '@/lib/seo';
import MoneyLandingPage from '@/components/money-pages/MoneyLandingPage';

const PATH = '/plots-in-behror';
const title = 'Plots for Sale in Behror, Rajasthan';
const description =
  'Verified plots for sale in Behror, Rajasthan — freehold residential plots on the Delhi-Jaipur NH-48 corridor. Physically verified, transparent pricing.';

export const metadata: Metadata = buildMetadata({
  title,
  description,
  alternates: { canonical: `${SITE_URL}${PATH}` },
  openGraph: { title, description, url: `${SITE_URL}${PATH}` },
});

export default function PlotsInBehrorPage() {
  return <MoneyLandingPage locationSlug="behror" type="plot" path={PATH} />;
}
