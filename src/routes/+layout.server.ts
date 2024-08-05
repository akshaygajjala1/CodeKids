import type { LayoutServerLoad } from './$types';

export const load = (async (event) => {
    return {
        id: event.locals.user?.id,
        name: event.locals.user?.name,
        email: event.locals.user?.email,
        admin: event.locals.user?.admin
    };
}) satisfies LayoutServerLoad;
