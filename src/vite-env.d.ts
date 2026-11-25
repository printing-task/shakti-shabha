/// <reference types="vite/client" />

declare module 'virtual:public-gallery' {
  export const PUBLIC_GALLERY_CATEGORIES: {
    id: string
    name: string
    description?: string
    cover_url?: string
  }[]
  export const PUBLIC_GALLERY_IMAGES: {
    src: string
    alt: string
    tag?: string
    desc?: string
  }[]
}
