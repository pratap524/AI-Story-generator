export type GenreId = 'romance' | 'sciFi' | 'fantasy' | 'comedy' | 'horror'

type ChoosePathPageProps = {
  onBack: () => void
  onSelectGenre: (genre: GenreId) => void
}

const genres: Array<{ id: GenreId; title: string; emoji: string; description: string; accent: string }> = [
  {
    id: 'romance',
    title: 'Romance',
    emoji: '❤',
    description: 'Passionate stories of love, connection, and heartfelt emotions',
    accent: '#ff78b9'
  },
  {
    id: 'sciFi',
    title: 'Sci-Fi',
    emoji: '🔭',
    description: 'Futuristic adventures exploring technology and the cosmos',
    accent: '#5fc9ff'
  },
  {
    id: 'fantasy',
    title: 'Fantasy',
    emoji: '✨',
    description: 'Magical realms where dragons soar and heroes are born',
    accent: '#b38bff'
  },
  {
    id: 'comedy',
    title: 'Comedy',
    emoji: '🎭',
    description: 'Lighthearted tales that bring joy and laughter to life',
    accent: '#ffb347'
  },
  {
    id: 'horror',
    title: 'Horror',
    emoji: '💀',
    description: 'Dark tales that chill the soul and awaken primal fears',
    accent: '#ff5c80'
  }
]

export default function ChoosePathPage({ onBack, onSelectGenre }: ChoosePathPageProps) {
  return (
    <div className="world-page">
      <header className="world-header">
        <button type="button" className="world-brand" onClick={onBack}>
          <span className="world-logo" aria-hidden="true">🪶</span>
          <div>
            <p className="brand-label">AI Story Generator</p>
            <span className="brand-meta">Return to workspace</span>
          </div>
        </button>

        <nav className="world-nav">
          <button type="button">Category</button>
          <button type="button">Stories</button>
          <button type="button">Library</button>
          <button type="button">Settings</button>
        </nav>

        <div className="world-user">
          <button type="button" aria-label="Notifications">🔔</button>
          <div className="world-avatar" aria-hidden="true">👩‍🎤</div>
        </div>
      </header>

      <main className="world-main">
        <section className="world-hero">
          <p className="world-pill">Category</p>
          <h1>Choose Your Story World</h1>
          <p>Select a genre to begin your creative journey into the realm of AI-powered storytelling</p>
        </section>

        <section className="world-grid">
          {genres.map((genre) => (
            <article key={genre.title} className="world-card">
              <div className="card-icon" style={{ color: genre.accent }} aria-hidden="true">{genre.emoji}</div>
              <h3>{genre.title}</h3>
              <p>{genre.description}</p>
              <button type="button" className="world-card-button" onClick={() => onSelectGenre(genre.id)}>
                Explore {genre.title}
              </button>
            </article>
          ))}
        </section>
      </main>
    </div>
  )
}
