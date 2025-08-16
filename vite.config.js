
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Use repo name as base when deploying to GitHub Pages under a project site.
// Update this if you rename the repository.
const repoName = '/PhilippineInflationCalculator/'

export default defineConfig({
	base: repoName,
	plugins: [react()],
})
