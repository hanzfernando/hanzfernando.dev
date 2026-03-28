export type CareerExperience = {
  role: string
  company: string
  period: string
  description: string
  logo?: string
}

export const careerExperiences: CareerExperience[] = [
  {
    role: 'Junior Full-Stack Developer',
    company: 'Kloudtech Corp',
    period: 'Sept 2025 - Present',
    description:
      'Full-stack developer contributing to a production-grade weather monitoring platform deployed across multiple LGU command centers. Designed and maintained REST APIs with API key–based authentication tied to user accounts, including rate limiting and request validation for controlled external access. Built and documented APIs for both internal dashboards and external client consumption.\n\nProcessed 11k+ daily weather data points with per-minute ingestion and developed responsive dashboards for real-time visualization. Improved performance of chart-heavy interfaces by up to 80% through memoization and optimized state management.\n\nDeveloped a public-facing Next.js platform that consumes internal APIs, implementing server-side caching strategies to minimize redundant requests, reduce backend load, and ensure efficient real-time data delivery.',
    logo: '/company/kloudtech.png',
  },
  {
    role: 'IT Student Trainee',
    company: 'Sumi Philippines Wiring Systems Corp.',
    period: 'Sept 2024 - Oct 2024',
    description:
      'Led a team of interns in developing internal tools to streamline operations. Co-designed and implemented a Material Release System (WPF + SQL Server) to track inter-department requests and built a Meeting Logging Web App using ASP.NET integrated with a proximity card system for automated attendance. Collaborated with supervisors through weekly reviews to ensure alignment with business requirements and delivery standards.',
  },
];
