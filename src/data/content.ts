export type Project = {
  id: string
  title: string
  description: string
  url?: string
  tags?: string[]
}

export type Content = {
  about: { headline: string; blurb: string }
  projects: Project[]
  contact: { email?: string; twitter?: string; github?: string }
  career: { summary: string }
}

const content: Content = {
  about: {
    headline: 'Hi, I\'m Hanz',
    blurb: 'I build interactive web experiences and multiplayer demos.'
  },
  projects: [
    { id: 'p1', title: 'Portfolio Game', description: 'A Pokemon-inspired multiplayer portfolio', url: '#', tags: ['phaser','nextjs','multiplayer'] },
    { id: 'p2', title: 'Blog', description: 'Technical writing and notes', url: '#', tags: ['nextjs','mdx'] }
  ],
  contact: { email: 'hi@hanzfernando.dev', twitter: '@hanzfernando', github: 'hanzfernando' },
  career: { summary: 'Experienced frontend developer focused on games and interactive UI.' }
}

export default content
