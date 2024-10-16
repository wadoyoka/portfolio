'use client'

import { usePathname } from 'next/navigation'
import Script from 'next/script'

type BreadcrumbItem = {
  position: number
  name: string
  item: string
}

const getBreadcrumbs = (pathname: string): BreadcrumbItem[] => {
  const segments = pathname.split('/').filter((segment) => segment.length > 0)

  const breadcrumbs: BreadcrumbItem[] = [
    {
      position: 1,
      name: 'Home',
      item: '/',
    },
  ]

  segments.forEach((segment, index) => {
    const href = '/' + segments.slice(0, index + 1).join('/')
    const name = segment.charAt(0).toUpperCase() + segment.slice(1)
    breadcrumbs.push({
      position: index + 2,
      name: name,
      item: href,
    })
  })

  return breadcrumbs
}

export default function BreadcrumbJsonLd() {
  const pathname = usePathname()
  const breadcrumbs = getBreadcrumbs(pathname)

  const breadcrumbListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': breadcrumbs.map((breadcrumb) => ({
      '@type': 'ListItem',
      'position': breadcrumb.position,
      'name': breadcrumb.name,
      'item': `${process.env.NEXT_PUBLIC_SITE_URL}${breadcrumb.item}`,
    })),
  }

  return (
    <Script id="breadcrumb-jsonld" type="application/ld+json">
      {JSON.stringify(breadcrumbListJsonLd)}
    </Script>
  )
}