export default function Footer() {
  const sections = [
    {
      title: 'Product',
      links: ['Features', 'Pricing', 'Updates']
    },
    {
      title: 'Community',
      links: ['Stories', 'Writers', 'Forums']
    },
    {
      title: 'Support',
      links: ['Help Center', 'Contact', 'Privacy']
    }
  ]

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <div className="footer-logo">
            <span className="logo-icon">📝</span>
            <span>StoryAI</span>
          </div>
          <p>Empowering writers with AI-powered creativity tools for the next generation of storytelling.</p>
        </div>

        <div className="footer-sections">
          {sections.map((section, index) => (
            <div key={index} className="footer-section">
              <h4>{section.title}</h4>
              <ul>
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a href={`#${link.toLowerCase()}`}>{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2024 StoryAI. All rights reserved.</p>
        <div className="social-links">
          <a href="#twitter">𝕏</a>
          <a href="#linkedin">in</a>
          <a href="#github">⚙️</a>
        </div>
      </div>
    </footer>
  )
}
