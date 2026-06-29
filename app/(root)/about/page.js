export default function AboutPage() {
  return (
    <div className="bg-bg min-h-screen px-6 md:px-10 py-16">
      <div className="max-w-2xl">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-pink mb-4">About</p>
        <h1 className="font-display text-[56px] leading-none text-text1 mb-8">BUILT IN<br/>THE DARK.</h1>
        <div className="space-y-5 text-[15px] text-text2 leading-relaxed border-l-4 border-pink pl-6">
          <p>EGAX Studios is a Jakarta-based streetwear label founded on the belief that the most honest creative work happens away from the spotlight — in small studios, at odd hours, without an audience.</p>
          <p>We make garments for people who move through cities unseen. Heavy fabrics, minimal branding, utilitarian silhouettes. Pieces that exist outside of trend cycles.</p>
          <p>Every collection is produced in limited quantities. Once it&apos;s gone, it&apos;s gone.</p>
        </div>
        <div className="mt-10 inline-block bg-pink text-black font-display text-[18px] tracking-widest px-6 py-3">
          WORN IN THE STREETS.
        </div>
      </div>
    </div>
  )
}
