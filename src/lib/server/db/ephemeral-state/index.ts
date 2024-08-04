import type { Cookies } from '@sveltejs/kit';

export const setAfterCookie = (cookies: Cookies, email: string) => {
    cookies.set('afterConfirmation', email, {
        path: '/',
        expires: new Date(Date.now() + 1000 * 60),
        secure: import.meta.env.PROD
    });
};

export const getAndDeleteAfterCookie = (cookies: Cookies): string => {
    const email = cookies.get('afterConfirmation') ?? '';
    if (email) {
        cookies.delete('afterConfirmation', { path: '' });
        return email;
    }
    return '';
};
