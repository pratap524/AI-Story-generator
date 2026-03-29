export default function Demo() {
  return (
    <section id="demo" className="demo">
      <h2>See It In Action</h2>
      <p>Experience the seamless flow between your creativity and AI assistance</p>
      
      <div className="demo-container">
        <div className="demo-editor">
          <div className="editor-header">
            <span className="file-dot"></span>
            <span className="file-dot"></span>
            <span className="file-dot"></span>
            <span className="file-name">story-outline.md</span>
          </div>
          <div className="editor-content">
            <p>The ancient library stood silent in the moonlight, its towering shelves casting long shadows across the marble floor.</p>
            <br />
            <p>Elena stepped carefully between the stacks, her fingers trailing along the leather-bound spines. Somewhere in this vast collection lay the answer she sought.</p>
          </div>
        </div>

        <div className="demo-suggestions">
          <h3>AI Suggestions</h3>
          <div className="suggestion plot-suggestion">
            <span className="suggestion-label">📌 Plot suggestion:</span>
            <p>"...a book that glowed with an ethereal light when touched."</p>
          </div>
          <div className="suggestion">
            <span className="suggestion-label">👤 Character development:</span>
            <p>Elena's background as a former librarian could add depth here.</p>
          </div>
          <div className="suggestion atmosphere">
            <span className="suggestion-label">🌫️ Atmosphere:</span>
            <p>Consider adding the scent of old parchment and dust.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
