export type CareerExperience = {
  role: string
  company: string
  period: string
  description: string
  summary: string
  highlights: string[]
  logo?: string
}

export const careerExperiences: CareerExperience[] = [
  {
    role: 'Full Stack Developer',
    company: 'Kloudtech Corp',
    period: 'Sept 2025 - Present',
    summary:
      'Full-stack developer contributing to a production-grade weather monitoring platform deployed across multiple LGU command centers.',
    description:
      'Full-stack developer contributing to a production-grade weather monitoring platform deployed across multiple LGU command centers. Designed and maintained REST APIs with API key-based authentication tied to user accounts, including rate limiting and request validation for controlled external access. Built and documented APIs for both internal dashboards and external client consumption.\n\nProcessed 11k+ daily weather data points with per-minute ingestion and developed responsive dashboards for real-time visualization. Improved performance of chart-heavy interfaces by up to 80% through memoization and optimized state management.\n\nDeveloped a public-facing Next.js platform that consumes internal APIs, implementing server-side caching strategies to minimize redundant requests, reduce backend load, and ensure efficient real-time data delivery.',
    highlights: [
      'Led development and production support for a real-time weather monitoring platform used by 5+ LGU command centers, sustaining 11k+ telemetry records processed daily over 8+ months in production.',
      'Engineered WebSocket-powered real-time dashboards and architected Strategy pattern-based telemetry pipelines to support multiple weather station types, improving operational responsiveness and scalability for command center workflows.',
      'Built interactive Mapbox visualization and historical playback features for station telemetry, improving situational awareness during monitoring operations.',
      'Delivered a public-facing Next.js dashboard with API key authentication, rate limiting, server-side caching, and custom i18n support for secure localized external access.',
      'Developed automated cron-based log retention workflows, preventing unbounded API log growth and improving long-term database performance.',
      'Mentored 2+ interns through code reviews, architecture guidance, debugging, and deployment support to improve engineering quality and delivery speed.',
      'Collaborated across frontend, backend, and infrastructure workflows to deploy scalable production-ready features and troubleshoot live system issues.',
    ],
    logo: '/company/kloudtech.png',
  },
  {
    role: 'Software Development Intern',
    company: 'Sumi Philippines Wiring Systems Corp.',
    period: 'Sept 2024 - Oct 2024',
    summary:
      'Led a team of interns in developing internal tools to streamline operations.',
    description:
      'Led a team of interns in developing internal tools to streamline operations. Co-designed and implemented a Material Release System (WPF + SQL Server) to track inter-department requests and built a Meeting Logging Web App using ASP.NET integrated with a proximity card system for automated attendance. Collaborated with supervisors through weekly reviews to ensure alignment with business requirements and delivery standards.',
    highlights: [
      'Co-designed and implemented a Material Release System using WPF and SQL Server.',
      'Tracked inter-department material requests through clearer internal workflows.',
      'Built a Meeting Logging Web App using ASP.NET.',
      'Integrated proximity card attendance capture for automated meeting logs.',
      'Collaborated with supervisors through weekly reviews to align with business requirements and delivery standards.',
    ],
  },
]
