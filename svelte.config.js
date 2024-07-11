import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { escapeSvelte, mdsvex } from 'mdsvex';
import { createHighlighter } from 'shiki';
import {
    transformerNotationDiff,
    transformerNotationHighlight,
    transformerNotationFocus,
    transformerNotationErrorLevel
} from '@shikijs/transformers';

const highlighter = await createHighlighter({
    themes: ['snazzy-light'],
    langs: ['python', 'py'],
});
await highlighter.loadLanguage('python', 'py');

/** @type {import('mdsvex').MdsvexOptions} */
const mdsvexOptions = {
    extensions: ['.svx', '.md'],
    highlight: {
        highlighter: async (code, lang = 'text') => {
            const html = escapeSvelte(highlighter.codeToHtml(code, 
                { 
                    lang, 
                    theme: 'snazzy-light',
                    transformers: [
                        transformerNotationDiff(),
                        transformerNotationHighlight(),
                        transformerNotationFocus(),
                        transformerNotationErrorLevel()
                    ] 
                }
            ));
            return `{@html \`${html}\`}`;
        }
    }
};

/** @type {import('@sveltejs/kit').Config} */
const config = {
    // Consult https://kit.svelte.dev/docs/integrations#preprocessors
    // for more information about preprocessors
    extensions: ['.svelte', '.svx', '.md'],
    preprocess: [vitePreprocess(), mdsvex(mdsvexOptions)],

    kit: {
        // adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
        // If your environment is not supported, or you settled on a specific environment, switch out the adapter.
        // See https://kit.svelte.dev/docs/adapters for more information about adapters.
        adapter: adapter()
    }
};

export default config;
