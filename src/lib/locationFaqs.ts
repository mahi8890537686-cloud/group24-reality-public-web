import type { FAQItem, Location } from '@/types';

// ─── Town-specific FAQs ───────────────────────────────────────────────────────
// Grounded in this town's real `investmentPoints` / `connectivity` /
// `infrastructure` / `description` fields (Firestore `locations` collection).
// No invented prices, developments, or statistics — see buildFallbackFaqs()
// below for how any location not covered here degrades gracefully instead of
// making something up. Shared by /locations/[slug] and the plots-in-/flats-in-
// exact-match landing pages so the same real facts aren't duplicated/drifted.

export const LOCATION_FAQS: Record<string, FAQItem[]> = {
  behror: [
    {
      question: 'Why is Behror considered a good real estate investment right now?',
      answer:
        'Behror sits directly on the Delhi–Jaipur NH-48, which gives it strong through-connectivity, and land values here have been rising on the back of RIICO industrial expansion in the area. It is also priced considerably lower to enter than nearby Gurugram or Bhiwadi, which is why it draws both end-users and investors.',
    },
    {
      question: 'How far is Behror from Delhi, Jaipur, and the neighbouring towns?',
      answer:
        'Behror is about 120 km from Delhi and 130 km from Jaipur, both via NH-48. It is also close to Rewari in Haryana (20 km), Neemrana (30 km), and Kotputli (55 km) — useful if you are comparing plots across the corridor.',
    },
    {
      question: 'What civic and social infrastructure does Behror already have?',
      answer:
        'Behror has an established RIICO Industrial Area, a Government District Hospital, DPS Behror school, a city commercial market, and multiple banks and ATMs. Social infrastructure — schools, hospitals, and markets — has been steadily developing alongside the industrial growth.',
    },
    {
      question: 'Who typically buys property in Behror — residents or investors?',
      answer:
        'Both. There is strong end-user demand for residential plots from the workforce employed in the RIICO industrial belt, alongside investors attracted by the lower entry price compared to Gurugram and Bhiwadi. Exact plot prices vary by sector, plot size, and road width — our team can walk you through current listings for your budget.',
    },
    {
      question: 'How does property registration work if I buy in Behror?',
      answer:
        'Behror falls in Alwar district, Rajasthan, so registration follows the standard Rajasthan process at the local Sub-Registrar Office — stamp duty is typically 5–6% for men and 4–5% for women buyers. Our team assists with sale deed preparation, stamp duty payment, and the registry appointment.',
    },
  ],
  neemrana: [
    {
      question: 'What makes Neemrana different from other towns on the NH-48 corridor?',
      answer:
        'Neemrana is home to the largest Japanese industrial cluster in India outside the major metros, and it falls within the Delhi–Mumbai Industrial Corridor (DMIC) influence zone. That combination drives both strong rental demand and steady capital appreciation, which sets it apart from the smaller towns nearby.',
    },
    {
      question: 'Is Neemrana a good choice for rental income, not just resale value?',
      answer:
        'Yes — the Japanese Industrial Zone (RIICO Phase I–IV) brings a steady base of corporate executives and expats, which supports high rental yield potential. Leading private schools and multi-specialty hospitals in the area also make it practical for tenants to actually live there long-term.',
    },
    {
      question: 'How close is Neemrana to Delhi and the airport?',
      answer:
        'Neemrana is around 90 km / roughly 90 minutes from Delhi via NH-48, and about 100 km from IGI Airport. It is also close to Gurugram (75 km) and Behror (30 km), which helps with weekday commuting for anyone working in the industrial zone.',
    },
    {
      question: 'Is Neemrana just an industrial town, or is there more to it?',
      answer:
        "No — Neemrana Fort Palace anchors a genuine heritage tourism circuit that draws steady visitors, alongside the DMIC's Shahjahanpur Smart City Node development. It is a rare combination of industrial demand and heritage character on the same stretch of highway.",
    },
    {
      question: 'How does property registration work if I buy in Neemrana?',
      answer:
        'Registration follows the standard Rajasthan process at the local Sub-Registrar Office — stamp duty is typically 5–6% for men and 4–5% for women buyers. Our team handles the documentation, from sale deed preparation to the registry appointment, for every property we help you buy in Neemrana.',
    },
  ],
  kotputli: [
    {
      question: 'Why is Kotputli often called the most affordable option on the NH-48 corridor?',
      answer:
        'Kotputli has some of the most affordable property prices anywhere on the NH-48 corridor, while still sitting just 55 km from Jaipur. The growing RIICO industrial estate here is also creating fresh workforce housing demand, which supports the case for entry-level investment.',
    },
    {
      question: 'What is the Kotputli–Behror district formation, and does it matter for buyers?',
      answer:
        "Kotputli and Behror were reorganised into a new administrative district, and that kind of change typically brings more government infrastructure investment into the area over time. It's one of the factors behind the renewed interest in Kotputli as an entry-level investment location.",
    },
    {
      question: 'How well connected is Kotputli by road and rail?',
      answer:
        'Kotputli sits on NH-48, roughly 55 km from Jaipur and 175 km from Delhi, with Behror 55 km away and Neemrana 85 km away. Kotputli Railway Station handles both passenger and freight traffic, which adds another connectivity option beyond the highway.',
    },
    {
      question: "Is Kotputli's economy only real estate and industry, or is there more to it?",
      answer:
        'Kotputli has a genuinely balanced local economy — alongside the RIICO Industrial Area and a growing commercial market, it has an active grain and vegetable mandi supporting agricultural trade, plus a government hospital and engineering/polytechnic colleges. It is not a purely speculative market built on industry alone.',
    },
    {
      question: 'How does property registration work if I buy in Kotputli?',
      answer:
        'Registration follows the standard Rajasthan process at the local Sub-Registrar Office — stamp duty is typically 5–6% for men and 4–5% for women buyers. Our team assists with sale deed preparation, stamp duty payment, and the registry appointment for every purchase in Kotputli.',
    },
  ],
};

/** Fallback for any location not yet covered above — built only from that
 *  location's own real Firestore fields, no invented specifics. Keeps this
 *  page correct if a new town is added to the `locations` collection before
 *  someone writes hand-tailored FAQs for it. */
export function buildFallbackFaqs(location: Location): FAQItem[] {
  return [
    {
      question: `Why should I consider investing in ${location.name}?`,
      answer: `${location.investmentPoints.slice(0, 3).join('. ')}.`,
    },
    {
      question: `How is ${location.name} connected to nearby cities?`,
      answer: `${location.connectivity.join(', ')}.`,
    },
    {
      question: `What infrastructure is already in place in ${location.name}?`,
      answer: `${location.infrastructure.join(', ')}.`,
    },
    {
      question: `How does property registration work in ${location.name}?`,
      answer:
        'Property registration in Rajasthan takes place at the local Sub-Registrar Office. Stamp duty is typically 5–6% for men and 4–5% for women buyers. Our team assists with the complete documentation — sale deed preparation, stamp duty payment, and registry appointment.',
    },
  ];
}
