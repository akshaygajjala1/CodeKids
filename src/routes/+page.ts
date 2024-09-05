import type { PageLoad } from './$types';

export const load = (async () => {
    const content = await import('./homepageContent.svx');

    return {
        content: content.default
    };
}) satisfies PageLoad;
