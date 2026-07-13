export default function MarqueeTicker() {
  const text = 'EGAX STUDIOS • FREE ONGKIR SE-INDONESIA • LIMITED DROP • LOUD ON THE STREETS • NO VOLUME KNOB •'
  return (
    <div className="sticky top-0 z-50 overflow-hidden h-8 flex items-center" style={{background:'#FF2E7E',borderBottom:'3px solid #14120F'}}>
      <div className="ticker-track">
        {[...Array(6)].map((_,i) => (
          <span key={i} className="font-body text-[10px] uppercase font-semibold tracking-widest text-black px-8">{text}</span>
        ))}
      </div>
    </div>
  )
}
