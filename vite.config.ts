import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import fs from 'fs'

const IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif'])

function publicGalleryPlugin(): Plugin {
  const virtualId = 'virtual:public-gallery'
  const resolvedId = '\0' + virtualId

  const scanGallery = () => {
    const galleryRoot = path.resolve(__dirname, 'public/gallery')
    const categories: { id: string; name: string; description: string; cover_url?: string }[] = []
    const images: { src: string; alt: string; tag: string; desc: string }[] = []

    if (fs.existsSync(galleryRoot)) {
      const dirs = fs
        .readdirSync(galleryRoot, { withFileTypes: true })
        .filter((d) => d.isDirectory())
        .sort((a, b) => a.name.localeCompare(b.name))

      for (const dir of dirs) {
        const folderName = dir.name
        const dirPath = path.join(galleryRoot, folderName)
        const files = fs
          .readdirSync(dirPath, { withFileTypes: true })
          .filter((f) => f.isFile() && IMAGE_EXTS.has(path.extname(f.name).toLowerCase()))
          .map((f) => f.name)
          .sort((a, b) => a.localeCompare(b))

        if (files.length === 0) continue

        const slug = folderName
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '')

        const firstUrl = encodeURI(`/gallery/${folderName}/${files[0]}`)
        categories.push({
          id: `public-${slug}`,
          name: folderName,
          description: `Field gallery archive — ${folderName}`,
          cover_url: firstUrl,
        })

        for (const file of files) {
          images.push({
            src: encodeURI(`/gallery/${folderName}/${file}`),
            alt: folderName,
            tag: folderName.toUpperCase(),
            desc: `On-ground field documentation — ${folderName}`,
          })
        }
      }
    }

    return { categories, images }
  }

  return {
    name: 'public-gallery-auto-loader',
    resolveId(id) {
      if (id === virtualId) return resolvedId
    },
    load(id) {
      if (id !== resolvedId) return
      const { categories, images } = scanGallery()
      return `export const PUBLIC_GALLERY_CATEGORIES = ${JSON.stringify(categories)};\nexport const PUBLIC_GALLERY_IMAGES = ${JSON.stringify(images)};\n`
    },
  }
}

export default defineConfig({
  base: '/',
  envPrefix: ['VITE_', 'SUPABASE_'],
  plugins: [react(), publicGalleryPlugin()],
  server: {
    port: 3000,
    strictPort: true,
    watch: {
      ignored: ['**/dist/**', '**/.git/**']
    }
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') }
  }
})
