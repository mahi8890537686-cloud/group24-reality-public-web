import { ImageResponse } from 'next/og';

// Image metadata
export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';

// Image generation — simple "G24" monogram in brand navy/gold
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0B1629',
          borderRadius: 6,
        }}
      >
        <div
          style={{
            display: 'flex',
            fontSize: 15,
            fontWeight: 700,
            letterSpacing: -0.5,
            color: '#D4A853',
            fontFamily: 'Georgia, serif',
          }}
        >
          G24
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
