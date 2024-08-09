import { getHighlighter } from '$lib/helpers/shiki';
import type { PageLoad } from './$types';

export const load = (async () => {
    const content = await import('./homepageContent.svx');
    const highlighter = await getHighlighter();

    return {
        content: content.default,
        highlighter: highlighter
    };
}) satisfies PageLoad;
