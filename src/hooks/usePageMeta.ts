import { useEffect } from 'react'

interface PageMetaOptions {
  title: string
  description?: string
  ogImage?: string
  ogType?: 'website' | 'article'
  canonical?: string
}

const SITE_NAME = 'Gescostay'
const DEFAULT_DESCRIPTION =
  'Discover authentic African hospitality — curated stays, car rentals, and local experiences across Africa.'
const DEFAULT_OG_IMAGE =
  'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=1200&q=80'

/**
 * usePageMeta — sets document title + SEO meta tags dynamically.
 * Call at the top of each page component.
 */
export function usePageMeta({
  title,
  description = DEFAULT_DESCRIPTION,
  ogImage = DEFAULT_OG_IMAGE,
  ogType = 'website',
  canonical,
}: PageMetaOptions) {
  useEffect(() => {
    // Title
    document.title = `${title} — ${SITE_NAME}`

    const setMeta = (name: string, content: string, attr = 'name') => {
      let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null
      if (!el) {
        el = document.createElement('meta')
        el.setAttribute(attr, name)
        document.head.appendChild(el)
      }
      el.content = content
    }

    // Standard meta
    setMeta('description', description)
    setMeta('robots', 'index, follow')

    // Open Graph
    setMeta('og:title', `${title} — ${SITE_NAME}`, 'property')
    setMeta('og:description', description, 'property')
    setMeta('og:image', ogImage, 'property')
    setMeta('og:type', ogType, 'property')
    setMeta('og:site_name', SITE_NAME, 'property')

    // Twitter Card
    setMeta('twitter:card', 'summary_large_image')
    setMeta('twitter:title', `${title} — ${SITE_NAME}`)
    setMeta('twitter:description', description)
    setMeta('twitter:image', ogImage)

    // Canonical
    if (canonical) {
      let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null
      if (!link) {
        link = document.createElement('link')
        link.rel = 'canonical'
        document.head.appendChild(link)
      }
      link.href = canonical
    }

    return () => {
      // Restore default title on unmount
      document.title = SITE_NAME
    }
  }, [title, description, ogImage, ogType, canonical])
}
