import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'Dico Angelo — Builder-Operator Hybrid'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0a0a0a',
          backgroundImage: 'radial-gradient(circle at 25% 25%, #1a1a2e 0%, transparent 50%), radial-gradient(circle at 75% 75%, #1a1a2e 0%, transparent 50%)',
        }}
      >
        {/* Main content container */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px 60px',
          }}
        >
          {/* Avatar placeholder with gradient border */}
          <div
            style={{
              width: 120,
              height: 120,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 30,
              fontSize: 48,
            }}
          >
            DA
          </div>

          {/* Name */}
          <div
            style={{
              fontSize: 64,
              fontWeight: 700,
              color: '#ffffff',
              marginBottom: 10,
              letterSpacing: '-0.02em',
            }}
          >
            Dico Angelo
          </div>

          {/* Title with gradient */}
          <div
            style={{
              fontSize: 36,
              fontWeight: 600,
              background: 'linear-gradient(90deg, #6366f1 0%, #a78bfa 100%)',
              backgroundClip: 'text',
              color: 'transparent',
              marginBottom: 40,
            }}
          >
            Builder-Operator Hybrid
          </div>

          {/* Stats row */}
          <div
            style={{
              display: 'flex',
              gap: 60,
              marginBottom: 30,
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ fontSize: 32, fontWeight: 700, color: '#6366f1' }}>$800M+</div>
              <div style={{ fontSize: 16, color: '#737373' }}>TCV Processed</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ fontSize: 32, fontWeight: 700, color: '#6366f1' }}>900K+</div>
              <div style={{ fontSize: 16, color: '#737373' }}>Lines of Code</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ fontSize: 32, fontWeight: 700, color: '#6366f1' }}>8+</div>
              <div style={{ fontSize: 16, color: '#737373' }}>Research Papers</div>
            </div>
          </div>

          {/* Tagline */}
          <div
            style={{
              fontSize: 20,
              color: '#a3a3a3',
              textAlign: 'center',
              maxWidth: 800,
            }}
          >
            Enterprise GTM execution meets hands-on agentic infrastructure
          </div>
        </div>

        {/* Bottom accent line */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 4,
            background: 'linear-gradient(90deg, #6366f1 0%, #8b5cf6 50%, #6366f1 100%)',
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  )
}
