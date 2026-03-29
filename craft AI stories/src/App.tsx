import { useState } from 'react'
import './App.css'
import Header from './components/Header'
import Hero from './components/Hero'
import Features from './components/Features'
import Demo from './components/Demo'
import Footer from './components/Footer'
import WritingPage from './components/WritingPage'
import LibraryPage from './components/LibraryPage'
import ContinueStoryPage from './components/ContinueStoryPage'
import ChoosePathPage, { type GenreId } from './components/ChoosePathPage'
import ExportStoryPage from './components/ExportStoryPage'

type WritingPreset = {
  topic: string
  body: string
  autoGenerate: boolean
}

const genrePromptLibrary: Record<GenreId, { topic: string; prompts: string[] }> = {
  romance: {
    topic: 'A serendipitous romance in Paris',
    prompts: [
      'Write a tender romance about two strangers who keep crossing paths in Paris on a rainy spring evening. Focus on warm dialogue, soft sensory details, and a hopeful ending that celebrates vulnerability.',
      'Tell a love story that begins with an accidental wrong number and unfolds through heartfelt voice messages left after midnight.',
      'Craft a romance about rival pastry chefs forced to collaborate on a royal wedding cake, slowly discovering respect and affection.',
    ],
  },
  sciFi: {
    topic: 'Sci-Fi rescue beyond Saturn',
    prompts: [
      'Craft a sci-fi short story about a lone pilot answering a mysterious distress call from a station orbiting Saturn. Blend advanced technology with a sense of awe and discovery.',
      'Write about an engineer on a generation ship who discovers a hidden garden maintained by the ship’s AI to preserve forgotten smells of Earth.',
      'Narrate a first-contact encounter that happens during a solar storm, forcing humans and aliens to cooperate to survive.',
    ],
  },
  fantasy: {
    topic: 'Fantasy quest in a crystal forest',
    prompts: [
      'Create a fantasy tale where a reluctant hero must travel through a luminous crystal forest to retrieve an enchanted relic. Emphasize wonder, ancient magic, and courageous choices.',
      'Write about a young mage whose spell accidently awakens a kingdom of miniature dragons living inside stained-glass windows.',
      'Tell a legend about a traveling bard who can bargain with constellations to rewrite fate for a night.',
    ],
  },
  comedy: {
    topic: 'Comedy of errors at the wizard academy',
    prompts: [
      'Tell a comedic story about a nervous apprentice causing magical mishaps on the first day at a wizard academy. Keep the tone light, witty, and fast-paced.',
      'Write a lighthearted tale about a detective agency run by talking pets who misunderstand every clue yet still solve the case.',
      'Create a workplace comedy set inside a potion startup where the office coffee is literally enchanted.',
    ],
  },
  horror: {
    topic: 'Horror in the abandoned observatory',
    prompts: [
      'Write a chilling horror story about friends exploring an abandoned coastal observatory that begins transmitting eerie whispers from the stars. Build suspense and end with a memorable twist.',
      'Tell a horror story about a night shift librarian who realizes the books are rearranging themselves to spell warnings after midnight.',
      'Describe a haunting that manifests through frost patterns on windows, each pattern depicting the next victim.',
    ],
  },
}

const createGenrePreset = (genre: GenreId): WritingPreset => {
  const template = genrePromptLibrary[genre]
  const prompts = template.prompts
  const randomIndex = Math.floor(Math.random() * prompts.length)
  return {
    topic: template.topic,
    body: prompts[randomIndex],
    autoGenerate: true,
  }
}

function App() {
  const [view, setView] = useState<'home' | 'writing' | 'library' | 'continue' | 'path' | 'export'>('home')
  const [writingPreset, setWritingPreset] = useState<WritingPreset | null>(null)
  const [writingKey, setWritingKey] = useState(0)

  const openWritingDefault = () => {
    setWritingPreset(null)
    setWritingKey((key) => key + 1)
    setView('writing')
  }

  const handleGenreSelection = (genre: GenreId) => {
    const preset = createGenrePreset(genre)
    setWritingPreset(preset)
    setWritingKey((key) => key + 1)
    setView('writing')
  }

  if (view === 'writing') {
    return (
      <WritingPage
        key={writingKey}
        onBack={() => setView('home')}
        onOpenLibrary={() => setView('library')}
        presetTopic={writingPreset?.topic}
        presetBody={writingPreset?.body}
        autoGenerate={Boolean(writingPreset?.autoGenerate)}
      />
    )
  }

  if (view === 'library') {
    return <LibraryPage onGoWriting={openWritingDefault} onOpenStory={() => setView('export')} />
  }

  if (view === 'continue') {
    return <ContinueStoryPage onBack={() => setView('writing')} onGenerate={() => setView('path')} />
  }

  if (view === 'path') {
    return <ChoosePathPage onBack={() => setView('continue')} onSelectGenre={handleGenreSelection} />
  }

  if (view === 'export') {
    return <ExportStoryPage onBack={() => setView('library')} />
  }

  return (
    <div className="app">
      <Header />
      <Hero
        onStartWriting={openWritingDefault}
        onExploreStories={() => setView('path')}
      />
      <Features />
      <Demo />
      <Footer />
    </div>
  )
}

export default App
