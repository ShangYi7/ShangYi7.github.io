import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Github, Twitter, Mail, MapPin, Calendar, ExternalLink } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn more about ShangYi7 - A passionate developer crafting digital experiences.',
}

const skills = [
  {
    category: 'Frontend',
    technologies: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Vue.js', 'Nuxt.js']
  },
  {
    category: 'Backend',
    technologies: ['Node.js', 'Python', 'Express', 'FastAPI', 'PostgreSQL', 'MongoDB']
  },
  {
    category: 'Tools & Others',
    technologies: ['Git', 'Docker', 'AWS', 'Vercel', 'Figma', 'Linux']
  }
]

const experiences = [
  {
    title: 'Senior Frontend Developer',
    company: 'Tech Company',
    period: '2022 - Present',
    description: 'Leading frontend development for web applications using React and Next.js. Mentoring junior developers and establishing best practices.'
  },
  {
    title: 'Full Stack Developer',
    company: 'Startup Inc.',
    period: '2020 - 2022',
    description: 'Built and maintained full-stack applications using modern web technologies. Collaborated with design and product teams to deliver user-centric solutions.'
  },
  {
    title: 'Junior Developer',
    company: 'Digital Agency',
    period: '2019 - 2020',
    description: 'Started my professional journey developing websites and web applications. Learned the fundamentals of software development and teamwork.'
  }
]

const socialLinks = [
  {
    name: 'GitHub',
    href: 'https://github.com/ShangYi7',
    icon: Github,
    description: 'Check out my code and projects'
  },
  {
    name: 'Twitter',
    href: 'https://twitter.com/ShangYi7',
    icon: Twitter,
    description: 'Follow me for tech updates and thoughts'
  },
  {
    name: 'Email',
    href: 'mailto:contact@shangyi7.com',
    icon: Mail,
    description: 'Get in touch for collaborations'
  }
]

export default function AboutPage() {
  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="relative w-32 h-32 mx-auto mb-8">
            <div className="w-full h-full rounded-full glass-medium p-1">
              <div className="w-full h-full rounded-full bg-gradient-to-br from-accent to-blue-500 flex items-center justify-center text-4xl font-bold text-black">
                SY
              </div>
            </div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-background animate-pulse" />
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            About <span className="gradient-text">ShangYi7</span>
          </h1>
          
          <p className="text-xl text-foreground-muted max-w-2xl mx-auto leading-relaxed">
            A passionate developer with a love for creating beautiful, functional, and user-friendly applications.
            Always learning, always building, always improving.
          </p>
          
          <div className="flex items-center justify-center gap-4 mt-6 text-foreground-muted">
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>Taiwan</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>Available for work</span>
            </div>
          </div>
        </div>

        {/* Bio Section */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>My Story</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-invert max-w-none">
            <p>
              Hello! I&apos;m ShangYi7, a passionate developer who loves crafting digital experiences that make a difference. 
              My journey in technology started several years ago, and I&apos;ve been fascinated by the endless possibilities 
              that code can bring to life.
            </p>
            <p>
              I specialize in modern web development, with a focus on creating performant, accessible, and beautiful 
              applications. I believe in writing clean, maintainable code and staying up-to-date with the latest 
              technologies and best practices.
            </p>
            <p>
              When I&apos;m not coding, you can find me exploring new technologies, contributing to open-source projects, 
              or sharing my knowledge through blog posts and tutorials. I&apos;m always excited to collaborate on interesting 
              projects and connect with fellow developers.
            </p>
          </CardContent>
        </Card>

        {/* Skills Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Skills & Technologies</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {skills.map((skill) => (
              <Card key={skill.category}>
                <CardHeader>
                  <CardTitle className="text-lg">{skill.category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {skill.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 text-sm rounded-full text-accent transition-colors duration-200 hover:opacity-80"
                        style={{ backgroundColor: 'var(--glass-bg)' }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Experience Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Experience</h2>
          <div className="space-y-6">
            {experiences.map((exp, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{exp.title}</CardTitle>
                      <CardDescription className="text-accent font-medium">
                        {exp.company}
                      </CardDescription>
                    </div>
                    <span className="text-sm text-foreground-muted px-3 py-1 rounded-full" style={{ backgroundColor: 'var(--glass-bg)' }}>
                      {exp.period}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground-muted">{exp.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Connect Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-8">Let&apos;s Connect</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            {socialLinks.map((link) => {
              const Icon = link.icon
              return (
                <Card key={link.name} hover className="group">
                  <CardContent className="p-6 text-center">
                    <Icon className="h-8 w-8 mx-auto mb-4 text-accent group-hover:scale-110 transition-transform duration-200" />
                    <h3 className="font-semibold text-white mb-2">{link.name}</h3>
                    <p className="text-sm text-foreground-muted mb-4">{link.description}</p>
                    <Button asChild variant="ghost" size="sm">
                      <Link href={link.href} target="_blank" rel="noopener noreferrer">
                        Connect
                        <ExternalLink className="ml-2 h-3 w-3" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
          
          <Card className="glass-medium">
            <CardContent className="p-8 text-center">
              <h3 className="text-xl font-semibold text-white mb-4">
                Interested in working together?
              </h3>
              <p className="text-foreground-muted mb-6">
                I&apos;m always open to discussing new opportunities, interesting projects, or just having a chat about technology.
              </p>
              <Button asChild variant="accent" size="lg">
                <Link href="mailto:contact@shangyi7.com">
                  Get In Touch
                  <Mail className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}