import { ImageResponse } from 'next/og';

// Image metadata
export const alt =
  'Group 24 Reality — Plots, Villas & Flats in Behror, Neemrana & Kotputli';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

// Image generation
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0B1629',
          backgroundImage:
            'radial-gradient(circle at 50% 0%, #152644 0%, #0B1629 60%)',
          padding: '80px',
          position: 'relative',
        }}
      >
        {/* Top hairline accent */}
        <div
          style={{
            position: 'absolute',
            top: 56,
            display: 'flex',
            width: 140,
            height: 4,
            backgroundColor: '#D4A853',
            borderRadius: 2,
          }}
        />

        {/* Eyebrow */}
        <div
          style={{
            display: 'flex',
            fontSize: 26,
            letterSpacing: 6,
            textTransform: 'uppercase',
            color: '#D4A853',
            fontFamily: 'Georgia, serif',
            marginBottom: 28,
          }}
        >
          Real Estate Consultancy
        </div>

        {/* Business name */}
        <div
          style={{
            display: 'flex',
            fontSize: 108,
            lineHeight: 1.05,
            color: '#f0f6ff',
            fontFamily: 'Georgia, serif',
            fontWeight: 700,
            textAlign: 'center',
            letterSpacing: -1,
          }}
        >
          Group 24 Reality
        </div>

        {/* Divider */}
        <div
          style={{
            display: 'flex',
            width: 220,
            height: 2,
            backgroundColor: '#1e3560',
            margin: '36px 0',
          }}
        />

        {/* Tagline */}
        <div
          style={{
            display: 'flex',
            fontSize: 38,
            color: '#D4A853',
            fontFamily: 'Georgia, serif',
            textAlign: 'center',
            maxWidth: 920,
          }}
        >
          Plots, Villas &amp; Flats in Behror, Neemrana &amp; Kotputli
        </div>

        {/* Location line */}
        <div
          style={{
            display: 'flex',
            fontSize: 24,
            color: '#b8ceee',
            fontFamily: 'Arial, sans-serif',
            marginTop: 24,
            letterSpacing: 1,
          }}
        >
          Delhi–Jaipur NH-48 Corridor · Rajasthan
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
