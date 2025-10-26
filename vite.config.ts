import { paraglideVitePlugin } from '@inlang/paraglide-js';
import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';
import Icons from 'unplugin-icons/vite';

export default defineConfig({
	plugins: [
		paraglideVitePlugin({
			project: './project.inlang',
			outdir: './src/lib/paraglide',
			strategy: ['cookie', 'globalVariable', 'baseLocale'],
			disableAsyncLocalStorage: true // only because we're deploying on Cloudflare Pages
		}),
		sveltekit(),
		Icons({ compiler: 'svelte' })
	],

	test: { include: ['src/**/*.{test,spec}.{js,ts}'] }
});
