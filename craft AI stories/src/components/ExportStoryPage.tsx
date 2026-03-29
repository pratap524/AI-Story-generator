type ExportStoryPageProps = {
  onBack: () => void
}

export default function ExportStoryPage({ onBack }: ExportStoryPageProps) {
  return (
    <div className="export-page">
      <div className="export-modal">
        <div className="export-header-icon">↪</div>
        <h1>Export Your Story</h1>
        <p>Choose your preferred format to save your creation</p>

        <section className="export-preview-card">
          <h2>📖 The Whispering Woods</h2>
          <span>Generated on Dec 23, 2024</span>
          <p>
            In the heart of an ancient forest, where moonlight danced through silver leaves, there lived a wanderer who spoke only in riddles.
            Each step she took left behind traces of stardust, and the trees would lean in closer to hear her whispers.
          </p>
          <em>Preview of 1,247 words</em>
        </section>

        <section className="export-options">
          <button type="button" className="export-option">
            <span className="option-icon red">📄</span>
            <span className="option-text">
              <strong>Export as PDF</strong>
              <small>Beautifully formatted document with cover page</small>
            </span>
            <span className="option-arrow">→</span>
          </button>

          <button type="button" className="export-option">
            <span className="option-icon blue">📄</span>
            <span className="option-text">
              <strong>Export as Text</strong>
              <small>Plain text file (.txt) for maximum compatibility</small>
            </span>
            <span className="option-arrow">→</span>
          </button>

          <button type="button" className="export-option">
            <span className="option-icon gold">▣</span>
            <span className="option-text">
              <strong>Copy to Clipboard</strong>
              <small>Quick copy for pasting into other apps</small>
            </span>
            <span className="option-arrow">→</span>
          </button>
        </section>

        <div className="export-actions">
          <button type="button" className="cancel" onClick={onBack}>
            ✕ Cancel
          </button>
          <button type="button" className="share">
            ✦ Share Story
          </button>
        </div>

        <div className="export-foot-note">
          <span>🛡 Secure Export</span>
          <span>🔵 Auto-saved</span>
          <span>⭐ Premium Quality</span>
        </div>
      </div>
    </div>
  )
}
