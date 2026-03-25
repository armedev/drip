'use client'

export function HeroBanner() {
  return (
    <section className="relative overflow-hidden py-12 md:py-20 px-4 md:px-8 lg:ml-64">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-1/4 w-48 md:w-96 h-48 md:h-96 bg-accent-gold/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-40 md:w-80 h-40 md:h-80 bg-accent-gold/3 rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-3xl mx-auto text-center animate-slide-up">
        <p className="font-mono text-accent-gold/60 text-xs md:text-sm tracking-[0.3em] uppercase mb-3 md:mb-4">
          Premium Collection
        </p>
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-3 md:mb-4 gold-gradient-text leading-tight">
          PREMIUM T-SHIRTS
        </h1>
        <p className="text-text-secondary text-sm md:text-lg mb-6 md:mb-8 max-w-xl mx-auto">
          Curated essentials crafted for comfort and style.
        </p>
        <button
          onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
          className="btn-gold font-mono px-6 md:px-8 py-2.5 md:py-3 rounded-xl text-xs md:text-sm tracking-wide"
        >
          Shop Now
        </button>
      </div>
    </section>
  )
}
