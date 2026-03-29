import { useMemo, useState, useEffect, useRef, useCallback } from 'react'
import {
  formatReadTime,
  loadLibraryStories,
  saveLibraryStories,
  summarizeStory,
  type LibraryStory,
} from '../lib/libraryStorage'

type WritingPageProps = {
  onBack: () => void
  onOpenLibrary: () => void
  presetTopic?: string
  presetBody?: string
  autoGenerate?: boolean
}

const defaultPrompt = "Start your story... Once upon a time in a distant galaxy..."

const twistIdeaPool = [
  "Introduce an unexpected ally with mysterious motives.",
  "Reveal that the transmission is actually a warning from the future.",
  "Force the crew to choose between saving the station or their own ship.",
  "Let an alien child be the only one who can navigate the storm.",
  "Explain that the solar storm is sentient and studying the crew.",
  "Have two characters swap roles or hidden identities mid-mission.",
]

const pickRandomTwists = (count = 4) => {
  const pool = [...twistIdeaPool]
  const picks: string[] = []
  while (pool.length && picks.length < count) {
    const idx = Math.floor(Math.random() * pool.length)
    picks.push(pool.splice(idx, 1)[0])
  }
  return picks
}

const countWords = (text: string) => (text.trim() ? text.trim().split(/\s+/).filter(Boolean).length : 0)

export default function WritingPage({ onBack, onOpenLibrary, presetTopic, presetBody, autoGenerate }: WritingPageProps) {
  const [topic, setTopic] = useState(presetTopic ?? "")
  const [inputText, setInputText] = useState(presetBody ?? defaultPrompt)
  const [generatedText, setGeneratedText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [twistOptions, setTwistOptions] = useState<string[]>([])
  const [showTwistPanel, setShowTwistPanel] = useState(false)
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "error">("idle")
  const currentStoryIdRef = useRef<string | null>(null)

  const apiBaseUrl = useMemo(
    () => import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") || "http://127.0.0.1:8000",
    []
  );

  const buildPrompt = useCallback(() => {
    const cleanedTopic = topic.trim();
    const cleanedBody = inputText.trim();

    if (cleanedTopic && cleanedBody) {
      return `${cleanedTopic}\n\n${cleanedBody}`;
    }

    return cleanedTopic || cleanedBody;
  }, [inputText, topic]);

  const persistStoryToLibrary = useCallback(
    (content: string, extendStory: boolean) => {
      if (!content.trim()) return
      const stories = loadLibraryStories()
      const title = topic.trim() || 'Untitled Story'
      const now = new Date().toISOString()
      const wordCount = countWords(content)
      const summary = summarizeStory(content)
      const createEntry = (): LibraryStory => ({
        id:
          typeof crypto !== 'undefined' && crypto.randomUUID
            ? crypto.randomUUID()
            : `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        title,
        summary,
        content,
        createdAt: now,
        updatedAt: now,
        wordCount,
        readTime: formatReadTime(wordCount),
        icon: '📝',
      })

      if (!extendStory || !currentStoryIdRef.current) {
        const entry = createEntry()
        currentStoryIdRef.current = entry.id
        saveLibraryStories([entry, ...stories])
        return
      }

      const idx = stories.findIndex((story) => story.id === currentStoryIdRef.current)
      if (idx === -1) {
        const entry = createEntry()
        currentStoryIdRef.current = entry.id
        saveLibraryStories([entry, ...stories])
        return
      }

      stories[idx] = {
        ...stories[idx],
        title,
        summary,
        content,
        updatedAt: now,
        wordCount,
        readTime: formatReadTime(wordCount),
      }
      saveLibraryStories(stories)
    },
    [topic]
  )

  const handleGenerate = useCallback(
    async ({ extend = false }: { extend?: boolean } = {}) => {
      if (isGenerating) return;

      const prompt = buildPrompt();
      if (!prompt) {
        setErrorMessage("Please enter a topic or story details before generating.");
        return;
      }

      const existingStory = generatedText.trim();
      if (extend && !existingStory) {
        setErrorMessage("Generate a story first, then extend it.");
        return;
      }

      if (!extend) {
        currentStoryIdRef.current = null
      }

      setIsGenerating(true);
      if (!extend) {
        setGeneratedText("");
      }
      setErrorMessage(null);

      let payloadPrompt = prompt;
      if (extend && existingStory) {
        payloadPrompt = `${prompt}\n\nContinue the following story without restarting or contradicting it. Add richer detail and new beats while preserving tone. Existing story:\n${existingStory}\n\nNext section:`;
      }

      try {
        const response = await fetch(`${apiBaseUrl}/generate-story`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ prompt: payloadPrompt }),
        });

        if (!response.ok) {
          const message = await response.text();
          throw new Error(message || "Backend returned an error");
        }

        const data: { story: string } = await response.json();
        const newChunk = data.story.trim();
        const combinedStory = extend && existingStory
          ? `${existingStory}${existingStory.endsWith("\n") ? "" : "\n\n"}${newChunk}`.trim()
          : newChunk
        setGeneratedText(combinedStory);
        persistStoryToLibrary(combinedStory, extend)
      } catch (err) {
        console.error("Generation failed:", err);
        setErrorMessage(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setIsGenerating(false)
      }
    },
    [apiBaseUrl, buildPrompt, generatedText, isGenerating, persistStoryToLibrary]
  );

  const autoRunRef = useRef(autoGenerate ?? false)

  const handleTwistButton = useCallback(() => {
    setTwistOptions(pickRandomTwists(4))
    setShowTwistPanel(true)
  }, [])

  const handleApplyTwist = useCallback((idea: string) => {
    setInputText((prev) => {
      const trimmed = prev.trimEnd()
      const prefix = trimmed ? `${trimmed}\n\n` : ""
      return `${prefix}Twist idea: ${idea}`
    })
  }, [])

  const handleCopyStory = useCallback(async () => {
    if (!generatedText.trim()) return
    try {
      await navigator.clipboard.writeText(generatedText)
      setCopyStatus("copied")
      setTimeout(() => setCopyStatus("idle"), 2000)
    } catch (err) {
      console.error("Copy failed", err)
      setCopyStatus("error")
      setTimeout(() => setCopyStatus("idle"), 2000)
    }
  }, [generatedText])

  const handleDownloadStory = useCallback(() => {
    if (!generatedText.trim()) return
    const blob = new Blob([generatedText], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement("a")
    anchor.href = url
    anchor.download = `${topic || "story"}.txt`
    anchor.click()
    URL.revokeObjectURL(url)
  }, [generatedText, topic])

  const handleNewStory = useCallback(() => {
    if (isGenerating) return
    currentStoryIdRef.current = null
    setGeneratedText("")
    setErrorMessage(null)
    handleGenerate()
  }, [handleGenerate, isGenerating])

  useEffect(() => {
    if (!autoRunRef.current) return
    autoRunRef.current = false
    handleGenerate()
  }, [handleGenerate])

  return (
    <div className="writing-page">
      <header className="writing-topbar">
        <div className="writing-brand" role="button" tabIndex={0} onClick={onBack} onKeyDown={(e) => e.key === 'Enter' && onBack()}>
          <span className="writing-brand-icon">✎</span>
          <span className="writing-brand-text">AI Story Generator (Local)</span>
        </div>

        <nav className="writing-nav">
          <a href="#">Stories</a>
          <button type="button" className="writing-nav-btn" onClick={onOpenLibrary}>
            Library
          </button>
          <a href="#">Settings</a>
        </nav>

        <div className="writing-user-actions">
          <button className="writing-icon-btn" aria-label="Notifications">
            🔔
          </button>
          <div className="writing-avatar" aria-hidden="true">
            👩
          </div>
        </div>
      </header>

      <main className="writing-main">
        <section className="writing-left-panel">
          <div className="writing-heading-row">
            <span className="writing-select">Horror ▾</span>
            <h2>Your Story</h2>
            <p>Let your imagination flow and watch AI bring your ideas to life</p>
          </div>

          <div className="writing-mode-row">
            <input
              className="writing-topic-input"
              type="text"
              aria-label="Story topic"
              placeholder="Enter topic..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
            <div className="writing-mode-toggle" role="tablist" aria-label="Writing mode">
              <button className="active" type="button">
                Story
              </button>
            </div>
          </div>

          <textarea
            className="writing-input-area"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            aria-label="Story input"
          />

          <div className="writing-action-row">
            <button
              className="writing-primary-btn"
              type="button"
              onClick={() => handleGenerate()}
              disabled={isGenerating}
            >
              {isGenerating ? "✨ Generating..." : "✨ Continue Story"}
            </button>
            <button className="writing-secondary-btn" type="button" onClick={handleTwistButton}>
              🎲 Add Twist
            </button>
          </div>

          {showTwistPanel && (
            <div className="twist-panel" aria-live="polite">
              <div className="twist-panel-header">
                <p>Pick a twist prompt to blend into your setup.</p>
                <button type="button" className="twist-refresh-btn" onClick={handleTwistButton}>
                  Refresh ideas
                </button>
              </div>
              <div className="writing-chip-row">
                {twistOptions.map((idea) => (
                  <button key={idea} type="button" onClick={() => handleApplyTwist(idea)}>
                    {idea}
                  </button>
                ))}
              </div>
            </div>
          )}

        </section>

        <section className="writing-right-panel">
          <div className="generated-head-row">
            <div>
              <h2>Generated Story</h2>
              <p>AI-powered continuation of your narrative</p>
            </div>
            <div className="generated-toolbar">
              <button
                type="button"
                className="writing-icon-btn"
                aria-label="Copy story"
                onClick={handleCopyStory}
                disabled={!generatedText}
                title={copyStatus === "copied" ? "Copied!" : "Copy story"}
              >
                ⧉
              </button>
              <button
                type="button"
                className="writing-icon-btn"
                aria-label="Download story"
                onClick={handleDownloadStory}
                disabled={!generatedText}
              >
                ⇩
              </button>
            </div>
          </div>

          <article className="generated-card">
            {errorMessage && (
              <p className="generated-status" style={{ color: "tomato" }}>
                {errorMessage}
              </p>
            )}

            {isGenerating && (
               <p className="generated-status">◌ AI is crafting your story...</p>
            )}

            {generatedText ? (
              <p style={{ whiteSpace: 'pre-wrap' }}>{generatedText}</p>
            ) : (
             !isGenerating && !errorMessage && <p className="placeholder-text">Click "Continue Story" to generate with your local model...</p>
            )}

            {generatedText && (
               <div className="generated-suggestion">
                 <h3>💡 AI Suggestion</h3>
                 <p>Consider adding dialogue or a new character.</p>
               </div>
            )}
          </article>

          <div className="generated-meta-row">
            <span>{generatedText ? generatedText.split(/\s+/).filter(Boolean).length : 0} words</span>
            <span className="ai-active">{isGenerating ? "● Generating" : (generatedText ? "● AI Ready" : "○ Idle")}</span>
          </div>

          {generatedText && (
            <div className="generated-actions">
              <button
                type="button"
                className="writing-primary-btn"
                onClick={() => handleGenerate({ extend: true })}
                disabled={isGenerating}
              >
                ➕ Extend Current Story
              </button>
            </div>
          )}

          <div className="new-story-panel">
            <div>
              <h3>🆕 Start a New Story</h3>
              <p>Use your topic and details on the left to spin up a brand new draft.</p>
            </div>
            <button
              type="button"
              className="writing-secondary-btn"
              onClick={handleNewStory}
              disabled={isGenerating}
            >
              ✨ Create New Story
            </button>
          </div>
        </section>
      </main>
    </div>
  )
}
