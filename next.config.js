/** @type {import('next').NextConfig} */
const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [
      require('remark-gfm'),
    ],
    rehypePlugins: [
      require('rehype-slug'),
      require('rehype-autolink-headings'),
      require('rehype-highlight'),
    ],
  },
})

const nextConfig = {
  output: 'standalone',
  trailingSlash: true,
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  experimental: {
    mdxRs: false,
  },
  images: {
    domains: ['github.com', 'avatars.githubusercontent.com'],
    unoptimized: true,
  },
  async generateBuildId() {
    return 'build-' + Date.now()
  },
}

module.exports = withMDX(nextConfig)