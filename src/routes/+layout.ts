import type { LayoutLoad } from './$types';

export const load = (async ({ url, data }) => {
    return {
        url: url.pathname,
        ...data
    };
}) satisfies LayoutLoad;
