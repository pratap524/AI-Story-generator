type ContinueStoryPageProps = {
  onBack: () => void
  onGenerate: () => void
}

export default function ContinueStoryPage({ onBack, onGenerate }: ContinueStoryPageProps) {
  return (
    <div className="continue-page">
      <header className="continue-topbar">
        <div className="continue-brand" role="button" tabIndex={0} onClick={onBack} onKeyDown={(e) => e.key === 'Enter' && onBack()}>
          <span className="continue-brand-icon">✎</span>
          <span className="continue-brand-text">AI Story Generator</span>
        </div>
        <div className="continue-top-actions">
          <button type="button" className="continue-save-btn">
            🔒 Save
          </button>
          <button type="button" className="continue-generate-btn" onClick={onGenerate}>
            ✨ Generate
          </button>
        </div>
      </header>

      <main className="continue-main">
        <section className="continue-title-wrap">
          <h1>The Enchanted Forest</h1>
          <p>Chapter 3: The Whispering Trees</p>
        </section>

        <section className="continue-editor-card">
          <p>
            The morning mist danced through the ancient oak trees, their gnarled branches reaching toward a sky painted in shades of pearl and
            rose. Elena stepped carefully along the cobblestone path, her bare feet finding purchase on the dew-slicked stones.
          </p>
          <p>
            Eleanor paused beneath a towering willow, its silver leaves catching the filtered sunlight and casting dancing shadows across her
            face. The tree seemed to whisper secrets in a language she almost understood, its voice carried on the gentle breeze that stirred
            the emerald ferns at its base. She reached out, her fingertips barely grazing the smooth bark, and felt a warmth that spoke of
            ancient wisdom and untold stories.
          </p>
          <p>
            But today, something felt different. The air hummed with an energy she could not name, and the shadows seemed to whisper secrets in
            languages older than memory. As she approached the center of the garden, where a fountain of liquid moonlight bubbled eternally,
            she noticed a figure waiting for her.
          </p>
          <p>
            "Welcome back, Elena," the figure said, their voice like wind through silver bells. "We've been expecting you."
          </p>

          <div className="continue-floating-tools">
            <button type="button" className="tool-btn purple">↻ Rewrite</button>
            <button type="button" className="tool-btn">◐ Darker</button>
            <button type="button" className="tool-btn blue">✒ Poetic</button>
            <button type="button" className="tool-btn">✣ Shorten</button>
            <button type="button" className="tool-btn">⛶ Expand</button>
            <button type="button" className="tool-btn gold">↻ Retry</button>
          </div>
        </section>

        <section className="continue-ai-card">
          <div className="continue-ai-head">
            <h2>🤖 AI Suggestion</h2>
            <div className="continue-ai-actions">
              <button type="button" className="accept">✓ Accept</button>
              <button type="button" className="decline">✕ Decline</button>
            </div>
          </div>

          <div className="continue-ai-content">
            Eleanor hesitated beneath the ancient willow, its silvered branches swaying like ethereal dancers in the dappled light. The
            tree's whispers grew stronger, weaving through her consciousness with promises of forgotten magic and hidden truths. As her palm
            pressed against the weathered bark, visions of starlight and shadow flickered behind her closed eyes, and she understood that this
            moment would forever change the course of her destiny.
          </div>

          <div className="continue-ai-footer">
            <span>Generated in 2.3s</span>
            <span>Poetic enhancement</span>
            <button type="button">↻ Regenerate</button>
          </div>
        </section>

        <footer className="continue-bottom-row">
          <div className="continue-stats">
            <span>847 words</span>
            <span>4.2k characters</span>
          </div>
          <div className="continue-bottom-actions">
            <button type="button" className="preview">◉ Preview</button>
            <button type="button" className="continue-story-btn">＋ Continue Story</button>
          </div>
        </footer>
      </main>
    </div>
  )
}
