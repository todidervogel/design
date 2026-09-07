import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/** Nur für die Galerie. Das Design-System selbst wird nicht gebaut,
 *  sondern als Quelltext eingespielt (siehe README). */
export default defineConfig({
  base: process.env.VITE_BASE ?? '/',
  plugins: [react()],
})
