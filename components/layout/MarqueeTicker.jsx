export default function MarqueeTicker() {
  const text = 'EGAX STUDIOS • FREE ONGKIR SE-INDONESIA • LIMITED DROP • BUILT IN THE DARK • WORN IN THE STREETS •'
  return (
    <div className="sticky top-0 z-50 overflow-hidden h-8 flex items-center" style={{background:'#FF2D9B',borderBottom:'3px solid #000'}}>
      <div className="ticker-track">
        {[...Array(6)].map((_,i) => (
          <span key={i} className="font-body text-[10px] uppercase font-semibold tracking-widest text-black px-8">{text}</span>
        ))}
      </div>
    </div>
  )
}
