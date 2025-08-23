import Link from 'next/link'
import { Github, Twitter, Mail, Heart,Instagram } from 'lucide-react'

const socialLinks = [
  {
    name: 'GitHub',
    href: 'https://github.com/ShangYi7',
    icon: Github,
  },
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/shang_yi6/',
    icon: Instagram,
  },
  {
    name: 'Email',
    href: 'mailto:ast102283@gmail.com',
    icon: Mail,
  },
]

const footerLinks = [
  {
    title: '網頁',
    links: [
      { name: '主業', href: '/' },
      { name: '關於', href: '/about' },
      { name: '文章', href: '/blog' },
      { name: '專案', href: '/projects' },
    ],
  },
  {
    title: '資源',
    links: [
      { name: 'RSS Feed', href: '/rss.xml' },
      { name: 'Sitemap', href: '/sitemap.xml' },
    ],
  },
]

export function Footer() {
  return (
    <footer className="glass border-t border-white/10 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="text-2xl font-bold gradient-text">
              Shang Yi
            </Link>
            <p className="mt-4 text-foreground-muted max-w-md">
              一個熱愛開發的人，分享技術、程式設計和生活的想法。
              一條一條程式碼構建未來。
            </p>

            {/* Social Links */}
            <div className="flex space-x-4 mt-6">
              {socialLinks.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass-button p-3 rounded-lg glow-hover group"
                    aria-label={item.name}
                  >
                    <Icon className="h-5 w-5 group-hover:text-accent transition-colors duration-200" />
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Footer Links */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--foreground)' }}>
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-foreground-muted hover:text-accent transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-foreground-muted text-sm">
            © {new Date().getFullYear()} ShangYi. All rights reserved.
          </p>

          <div className="flex items-center space-x-1 text-foreground-muted text-sm mt-4 sm:mt-0">
            <span>Made with</span>
            <Heart className="h-4 w-4 text-red-500 animate-pulse" />
            <span>using</span>
            <Link
              href="https://nextjs.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:text-accent-light transition-colors duration-200"
            >
              Next.js
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}