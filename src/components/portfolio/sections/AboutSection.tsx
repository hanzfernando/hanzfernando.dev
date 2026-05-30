const AboutSection = () => {
  return (
    <section className='mt-4 bg-[var(--card)] p-4'>
      <h2 className='text-2xl font-bold mb-4 font-mono'>About</h2>
      <p className='text-sm leading-relaxed'>
        I&apos;m a full-stack software engineer focused on building systems that turn live data into usable decisions. My work has included real-time telemetry dashboards, API platforms, public-facing Next.js applications, database workflows, caching, rate limiting, and production support for command center environments.
      </p>
      <p className='text-sm leading-relaxed mt-3'>
        I like working across the full path of a feature: understanding the problem, shaping the data flow, building the interface, and making sure the system is reliable once people are using it. I care about clean UX, practical architecture, and software that is easy to maintain after it ships.
      </p>
    </section>
  )
}

export default AboutSection
