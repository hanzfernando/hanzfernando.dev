import { Github, Linkedin, Mail, Phone } from "lucide-react";
import { LucideIcon } from "lucide-react";

interface ContactInfo {
  type: 'email' | 'linkedin' | 'github' | 'phone';
  label: string;
  value: string;
  icon: LucideIcon;
}

export const contactInfo: ContactInfo[] = [
  {
    type: 'email',
    label: 'Email',
    value: 'fernandohanz23@gmail.com',
    icon: Mail
  },
  {
    type: 'linkedin',
    label: 'LinkedIn',
    value: 'https://www.linkedin.com/in/hanz-fernando/',
    icon: Linkedin
  },
  {
    type: 'github',
    label: 'GitHub',
    value: 'https://github.com/hanzfernando',
    icon: Github
  },
  {
    type: 'phone',
    label: 'Phone',
    value: '+63 946 342 4634',
    icon: Phone
  }
]