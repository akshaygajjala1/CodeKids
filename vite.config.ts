import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
// @ts-ignore
import autoImport from 'sveltekit-autoimport';

export default defineConfig({
    plugins: [
        autoImport({
            include: ['**/*.(svx|svelte)'],
            components: [{ name: './src/lib/components', flat: true }]
        }),
        sveltekit()
    ],
    css: {
        preprocessorOptions: {
            scss: {
                additionalData: `
                @use '$lib/scss/variables' as *;    
                @use '$lib/scss/mixins' as *;
            `
            }
        }
    }
});
