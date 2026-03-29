export default function Features() {
  const features = [
    {
      icon: '✏️',
      title: 'AI Suggestions in Real-Time',
      description: 'Get intelligent writing suggestions, character development ideas, and plot twists as you write. Our AI understands your creative vision.'
    },
    {
      icon: '🛡️',
      title: 'Offline & Private',
      description: 'Write without internet connection. Your stories remain completely private and secure on your device. No data ever leaves your computer.'
    },
    {
      icon: '👥',
      title: 'Collaborative Writing',
      description: 'Co-create stories with friends, writers, and the global community. Share ideas, build worlds together, and inspire each other.'
    }
  ]

  return (
    <section id="features" className="features">
      <h2>Intelligent Writing</h2>
      <p>Experience the future of creative writing with our AI-powered storytelling platform</p>
      <div className="features-grid">
        {features.map((feature, index) => (
          <div key={index} className="feature-card">
            <div className="feature-icon">{feature.icon}</div>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
