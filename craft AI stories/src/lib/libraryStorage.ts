export type LibraryStory = {
  id: string
  title: string
  summary: string
  content: string
  createdAt: string
  updatedAt: string
  wordCount: number
  readTime: string
  icon?: string
}

export const LIBRARY_STORAGE_KEY = 'ai-story-library'
export const LIBRARY_UPDATED_EVENT = 'library-update'
const STORAGE_LIMIT = 20

const isClient = typeof window !== 'undefined' && typeof localStorage !== 'undefined'

export const loadLibraryStories = (): LibraryStory[] => {
  if (!isClient) return []
  try {
    const raw = localStorage.getItem(LIBRARY_STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch (err) {
    console.warn('Failed to load stories from storage', err)
    return []
  }
}

export const saveLibraryStories = (stories: LibraryStory[]) => {
  if (!isClient) return
  try {
    localStorage.setItem(
      LIBRARY_STORAGE_KEY,
      JSON.stringify(stories.slice(0, STORAGE_LIMIT))
    )
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(LIBRARY_UPDATED_EVENT))
    }
  } catch (err) {
    console.warn('Failed to save stories to storage', err)
  }
}

export const formatReadTime = (wordCount: number): string => {
  const minutes = Math.max(1, Math.round(wordCount / 140))
  return `${minutes} min read`
}

export const summarizeStory = (content: string, maxLength = 180): string => {
  const trimmed = content.trim()
  if (trimmed.length <= maxLength) return trimmed
  return `${trimmed.slice(0, maxLength).trim()}…`
}
