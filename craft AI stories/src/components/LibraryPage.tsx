import { useEffect, useMemo, useState } from 'react'
import {
  formatReadTime,
  loadLibraryStories,
  type LibraryStory,
  LIBRARY_UPDATED_EVENT,
} from '../lib/libraryStorage'

type LibraryPageProps = {
  onGoWriting: () => void
  onOpenStory: () => void
}

type LibraryCard = {
  icon: string
  title: string
  description: string
  readTime: string
  age: string
}

const fallbackCards: LibraryCard[] = [
  {
    icon: '📖',
    title: 'The Midnight Garden',
    description: 'In the heart of an ancient forest, where moonlight danced through silver leaves, a secret garden waited.',
    readTime: '8 min read',
    age: '3 days ago'
  },
  {
    icon: '🖋️',
    title: 'Whispers of Starlight',
    description: 'Beneath the velvet sky, where dreams and reality intertwine, the stars spoke in hushed tones of destiny.',
    readTime: '3 min read',
    age: '1 week ago'
  },
  {
    icon: '📚',
    title: 'Chronicles of the Lost City',
    description: 'Deep within forgotten ruins, every step echoed a mystery waiting to be uncovered by a brave explorer.',
    readTime: '12 min read',
    age: '2 weeks ago'
  },
  {
    icon: '✍️',
    title: 'Autumn Letter',
    description: 'As golden leaves began to fall, a forgotten letter whispered of promises made under amber skies.',
    readTime: '4 min read',
    age: '1 month ago'
  }
]

const formatRelativeTime = (iso?: string) => {
  if (!iso) return 'Just now'
  const timestamp = Date.parse(iso)
  if (Number.isNaN(timestamp)) return 'Just now'
  const diffMs = Date.now() - timestamp
  const minutes = Math.round(diffMs / 60000)
  if (minutes < 60) return `${Math.max(1, minutes)} min ago`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `${hours} hr${hours === 1 ? '' : 's'} ago`
  const days = Math.round(hours / 24)
  if (days < 30) return `${days} day${days === 1 ? '' : 's'} ago`
  const months = Math.round(days / 30)
  return `${months} mo ago`
}

export default function LibraryPage({ onGoWriting, onOpenStory }: LibraryPageProps) {
  const [storedStories, setStoredStories] = useState<LibraryStory[]>([])

  useEffect(() => {
    const refreshStories = () => {
      setStoredStories(loadLibraryStories())
    }

    refreshStories()
    window.addEventListener(LIBRARY_UPDATED_EVENT, refreshStories)
    window.addEventListener('storage', refreshStories)

    return () => {
      window.removeEventListener(LIBRARY_UPDATED_EVENT, refreshStories)
      window.removeEventListener('storage', refreshStories)
    }
  }, [])

  const cards = useMemo<LibraryCard[]>(() => {
    if (!storedStories.length) {
      return fallbackCards
    }

    return storedStories
      .slice()
      .sort((a, b) => {
        const aDate = Date.parse(a.updatedAt ?? a.createdAt)
        const bDate = Date.parse(b.updatedAt ?? b.createdAt)
        return bDate - aDate
      })
      .slice(0, 8)
      .map((story) => ({
        icon: story.icon ?? '📝',
        title: story.title,
        description: story.summary,
        readTime: story.readTime ?? formatReadTime(story.wordCount ?? 0),
        age: formatRelativeTime(story.updatedAt ?? story.createdAt),
      }))
  }, [storedStories])

  return (
    <div className="library-page">
      <header className="library-topbar">
        <div className="library-brand" role="button" tabIndex={0} onClick={onGoWriting} onKeyDown={(e) => e.key === 'Enter' && onGoWriting()}>
          <span className="library-brand-icon">✎</span>
          <span className="library-brand-text">AI Story Generator</span>
        </div>

        <nav className="library-nav">
          <a href="#">Dashboard</a>
          <a href="#" className="active">Library</a>
          <button type="button" onClick={onGoWriting}>Create</button>
        </nav>

        <div className="library-user-actions">
          <button className="library-icon-btn" aria-label="Notifications">🔔</button>
          <div className="library-avatar" aria-hidden="true">👩</div>
        </div>
      </header>

      <main className="library-main">
        <section className="library-heading">
          <h1>Your Stories</h1>
          <p>A collection of your creative journeys</p>
        </section>

        <section className="library-tools-row">
          <div className="library-search-wrap">
            <span className="library-search-icon">⌕</span>
            <input type="text" placeholder="Search your stories..." aria-label="Search stories" />
          </div>
          <div className="library-filter-group">
            <button className="active" type="button">All</button>
            <button type="button">Stories</button>
            <button type="button">Poetry</button>
          </div>
        </section>

        <section className="library-cards-row">
          {cards.map((story, index) => (
            <article key={`${story.title}-${story.age}-${index}`} className="library-card">
              <div className="library-card-head">
                <span className="library-card-icon">{story.icon}</span>
                <span className="library-card-age">{story.age}</span>
              </div>

              <h3>{story.title}</h3>
              <p>{story.description}</p>

              <div className="library-card-footer">
                <span>{story.readTime}</span>
                <button type="button" onClick={onOpenStory}>Open →</button>
              </div>
            </article>
          ))}
        </section>

        <section className="library-cta-panel">
          <div className="library-cta-icon">✨</div>
          <h2>Begin Your Next Story</h2>
          <p>Let AI guide your imagination through uncharted realms of creativity and wonder</p>
          <button type="button" onClick={onGoWriting}>＋ Create New Story</button>
        </section>
      </main>

      <footer className="library-footer">
        <div className="library-footer-top">
          <div className="library-footer-brand">
            <div className="library-footer-logo">
              <span className="library-brand-icon">✎</span>
              <span>Storyteller AI</span>
            </div>
            <p>Crafting magical narratives with the power of artificial intelligence</p>
          </div>

          <div className="library-footer-cols">
            <div>
              <h4>Product</h4>
              <a href="#">Features</a>
              <a href="#">Pricing</a>
              <a href="#">Templates</a>
            </div>
            <div>
              <h4>Company</h4>
              <a href="#">About</a>
              <a href="#">Blog</a>
              <a href="#">Contact</a>
            </div>
            <div>
              <h4>Legal</h4>
              <a href="#">Privacy</a>
              <a href="#">Terms</a>
              <a href="#">License</a>
            </div>
          </div>
        </div>

        <div className="library-footer-bottom">
          <p>© 2024 Storyteller AI. All rights reserved.</p>
          <div className="library-socials">
            <span>🐦</span>
            <span>📷</span>
            <span>🐙</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
