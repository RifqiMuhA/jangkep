'use client';

export function MapLegend() {
  return (
    <div className="map-legend">
      <div style={{
        fontFamily: 'var(--font-dm-sans)',
        fontSize: '11px',
        fontWeight: 600,
        textTransform: 'uppercase',
        color: 'var(--color-coklat-batik)',
        opacity: 0.5,
        letterSpacing: '0.8px',
        marginBottom: '10px',
      }}>
        Keterangan
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {/* Pin Kuliner */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '16px',
            height: '16px',
            borderRadius: '50%',
            backgroundColor: 'white',
            border: '2.5px solid var(--color-emas-keris)',
            flexShrink: 0,
          }} />
          <span style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '12px', color: 'var(--color-coklat-batik)' }}>
            Pin Kuliner
          </span>
        </div>

        {/* Kota Multi Kuliner */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '16px',
            height: '16px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--color-kuning-kepodang), var(--color-emas-keris))',
            flexShrink: 0,
            fontSize: '8px',
            fontWeight: 700,
            color: 'var(--color-coklat-batik)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            3
          </div>
          <span style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '12px', color: 'var(--color-coklat-batik)' }}>
            Multi Kuliner
          </span>
        </div>

        {/* Sedang Dijelajahi */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '16px',
            height: '16px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-kuning-kepodang)',
            flexShrink: 0,
            boxShadow: '0 0 8px rgba(245, 196, 0, 0.5)',
          }} />
          <span style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '12px', color: 'var(--color-coklat-batik)' }}>
            Aktif
          </span>
        </div>
      </div>
    </div>
  );
}
