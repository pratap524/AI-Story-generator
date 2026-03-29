type HeroProps = {
  onStartWriting: () => void
  onExploreStories: () => void
}

export default function Hero({ onStartWriting, onExploreStories }: HeroProps) {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1>Craft Stories with AI</h1>
        <p>Write, collaborate, and create poetic worlds with intelligent assistance — fully offline</p>
        <div className="hero-buttons">
          <button className="btn-primary" onClick={onStartWriting}>
            <span className="hero-btn-icon" aria-hidden="true">
              ✎
            </span>
            <span>Start Writing</span>
          </button>
          <button className="btn-secondary" onClick={onExploreStories}>
            <span className="hero-btn-icon" aria-hidden="true">
              ▮▮
            </span>
            <span>Explore Stories</span>
          </button>
        </div>
      </div>
      <div className="hero-visual">
        <div className="gradient-sphere"></div>
      </div>
    </section>
  )
}
