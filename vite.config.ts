import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [autoimport(), sveltekit()],
    css: {
        preprocessorOptions: {
            scss: {
                additionalData: `
                @use '$lib/scss/variables' as *;    
                @use '$lib/scss/mixins' as *;
            `
            }
        }
    },
    server: {
        proxy: {
            '/python-api': {
                target: 'http://localhost:5000',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/python-api/, ''),
            }
        }
    }
});

function autoimport() {
    return {
        name: 'autoimport',

        transform(src: string, id: string) {
            if (id.endsWith('.svx')) {
                return {
                    code: 'import Note from "$lib/components/dashboard/content/Note.svelte";' + src
                };
            }
        }
    };
}
