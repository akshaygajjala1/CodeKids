import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { escapeSvelte, mdsvex } from 'mdsvex';
import { visit } from 'unist-util-visit';
import footnotes from 'remark-footnotes';
import supersub from 'remark-supersub';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import readingTime from 'mdsvex-reading-time';
import { createHighlighter } from 'shiki';
import {
    transformerNotationDiff,
    transformerNotationHighlight,
    transformerNotationFocus,
    transformerNotationErrorLevel
} from '@shikijs/transformers';

const highlighter = await createHighlighter({
    themes: ['snazzy-light'],
    langs: ['python', 'py', 'sh']
});
await highlighter.loadLanguage('python', 'py', 'sh');

const injectTocFrontmatter = () => {
    return (tree, file) => {
        const headings = [];

        visit(tree, 'heading', (node) => {
            const heading = {
                text: node.children
                    .reduce((acc, cur) => acc + cur.value, '')
                    .toLowerCase()
                    .replaceAll(/\s/g, '-')
                    .replaceAll(/[^\w\-]/g, ''),
                original: node.children.reduce((acc, cur) => acc + cur.value, ''),
                depth: node.depth
            };

            if (heading.depth <= 3) {
                if (headings.find((h) => h.text === heading.text)) {
                    if (
                        headings.find(
                            (h) => h.text.split('-').slice(0, -1).join('-') === heading.text
                        )
                    ) {
                        heading.text = `${heading.text}-${headings.filter((h) => h.text.split('-').slice(0, -1).join('-') === heading.text).length + 1}`;
                    } else {
                        heading.text = `${heading.text}-1`;
                    }
                }
                headings.push(heading);
            }
        });

        file.data.fm['toc'] = headings;
    };
};

/** @type {import('mdsvex').MdsvexOptions} */
const mdsvexOptions = {
    extensions: ['.svx', '.md'],
    layout: {
        _: './src/lib/components/dashboard/content/DefaultLayout.svelte'
    },
    remarkPlugins: [footnotes, supersub, [readingTime, { wpm: 170 }], injectTocFrontmatter],
    rehypePlugins: [rehypeSlug, [rehypeAutolinkHeadings, { behavior: 'append' }]],
    smartypants: {
        quotes: true,
        ellipses: true,
        dashes: true
    },
    highlight: {
        highlighter: async (code, lang = 'text') => {
            const html = escapeSvelte(
                highlighter.codeToHtml(code, {
                    lang,
                    theme: 'snazzy-light',
                    transformers: [
                        transformerNotationDiff(),
                        transformerNotationHighlight(),
                        transformerNotationFocus(),
                        transformerNotationErrorLevel()
                    ]
                })
            );
            return `<div class="code-container">{@html \`${html}\`}</div>`;
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
