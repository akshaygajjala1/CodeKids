import { createHighlighterCore, type HighlighterCore } from 'shiki/core';
import snazzyLight from 'shiki/themes/snazzy-light.mjs';
import py from 'shiki/langs/py.mjs';
import python from 'shiki/langs/python.mjs';
import wasm from 'shiki/wasm';

export let highlighter: HighlighterCore;
// top-level await hack
(async () =>
    (highlighter = await createHighlighterCore({
        themes: [snazzyLight],
        langs: [py, python],
        loadWasm: wasm
    })))();
