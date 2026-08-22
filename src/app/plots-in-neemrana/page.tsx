import type { Metadata } from 'next';
import { buildMetadata, SITE_URL } from '@/lib/seo';
import MoneyLandingPage from '@/components/money-pages/MoneyLandingPage';

const PATH = '/plots-in-neemrana';
const title = 'Plots for Sale in Neemrana, Rajasthan';
const description =
  'Verified plots for sale in Neemrana, Rajasthan — freehold residential plots on the NH-48 corridor near the Japanese Industrial Zone. Transparent pricing.';

export const metadata: Metadata = buildMetadata({
  title,
  description,
  alternates: { canonical: `${SITE_URL}${PATH}` },
  openGraph: { title, description, url: `${SITE_URL}${PATH}` },
});

export default function PlotsInNeemranaPage() {
  return <MoneyLandingPage locationSlug="neemrana" type="plot" path={PATH} />;
}
