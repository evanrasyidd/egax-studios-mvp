import { ImageResponse } from 'next/og'

export const alt = 'EGAX Studios, everyday workwear from Jakarta'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#FAFAF8',
          color: '#111111',
          padding: '58px 64px 46px',
          border: '2px solid #111111',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 22, letterSpacing: '0.18em', textTransform: 'uppercase' }}>
          <span>EGAX Studios</span>
          <span>SS 2026 / Jakarta</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 148, lineHeight: 0.86, fontWeight: 900, letterSpacing: '-0.055em', textTransform: 'uppercase' }}>
            WEAR
          </div>
          <div style={{ fontSize: 148, lineHeight: 0.86, fontWeight: 900, letterSpacing: '-0.055em', textTransform: 'uppercase' }}>
            EVERYDAY.
          </div>
          <div style={{ marginTop: 30, fontSize: 24, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Duck canvas, denim, flannel, chinos. Made for daily use.
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #111111', paddingTop: 18, fontSize: 20, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          <span>Everyday workwear</span>
          <span>Technical flats / Limited runs</span>
        </div>
      </div>
    ),
    { ...size }
  )
}
