import { createHighlighter } from 'shiki';

export const highlighter = await createHighlighter({
    themes: ['snazzy-light'],
    langs: ['py', 'python']
});