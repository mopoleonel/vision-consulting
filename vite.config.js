import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { viteSingleFile } from 'vite-plugin-singlefile'

// `npm run build`        -> site classique (dossier dist/, à déployer sur n'importe quel hébergeur)
// `npm run build:single` -> un seul fichier HTML autonome (aperçu / partage)
export default defineConfig(({ mode }) => ({
  plugins: [react(), tailwindcss(), ...(mode === 'single' ? [viteSingleFile()] : [])],
  base: './',
  build: mode === 'single' ? { outDir: 'dist-single', assetsInlineLimit: 100000000 } : {},
}))
