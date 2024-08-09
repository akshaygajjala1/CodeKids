import { createHighlighterCore, type HighlighterCore } from 'shiki/core';
import snazzyLight from 'shiki/themes/snazzy-light.mjs';
import py from 'shiki/langs/py.mjs';
import python from 'shiki/langs/python.mjs';

let highlighter: HighlighterCore;

export const getHighlighter = async () => {
    return (
        highlighter ??
        (await createHighlighterCore({
            themes: [snazzyLight],
            langs: [py, python],
            loadWasm: import('shiki/wasm')
        }))
    );
};

getHighlighter();
