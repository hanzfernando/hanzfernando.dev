export type Project = {
  id: string
  title: string
  description: string
  url?: string
  tags?: string[]
}

export type Content = {
  about: { headline: string; blurb: string }
  contact: { email?: string; github?: string; linkedin?: string }
  career: { summary: string }
}

const calculateAge = (birthDate: Date) => {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const hasBirthdayPassedThisYear =
    today.getMonth() > birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() &&
      today.getDate() >= birthDate.getDate());
  if (!hasBirthdayPassedThisYear) age--;
  return age;
};

const content: Content = {
  about: {
    headline: 'Hi, I\'m Hanz',
    blurb: ` I'm a ${calculateAge(new Date(2003, 6, 21))}-year-old junior full-stack
        developer with a strong passion for building modern web applications.`
  },
  contact: { email: 'fernandohanz23@gmail.com', github: 'https://github.com/hanzfernando', linkedin: 'www.linkedin.com/in/hanz-fernando' },
  career: { summary: 'Experienced frontend developer focused on games and interactive UI.' }
}

export default content
