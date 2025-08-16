import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// When deploying to GitHub Pages at https://<user>.github.io/<repo>/
// set `base` to `/<repo>/` so built asset URLs are correct.
export default defineConfig({
	base: '/PhilippineInflationCalculator/',
	plugins: [react()]
})
