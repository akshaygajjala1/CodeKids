<script lang="ts">
    import Button from '$lib/components/Button.svelte';
    import { highlighter } from '$lib/helpers/shiki';
    import { page } from '$app/stores';
    import { onMount } from 'svelte';
    import { toTitleCase } from '$lib/helpers/functions';
    import { io, Socket } from 'socket.io-client';

    import logoSrc from '$lib/assets/CodeKidsAcademy Logo.png';
    import copySrc from '$lib/assets/icons/copy.png';
    import checkSrc from '$lib/assets/icons/check.png';
    import closeSrc from '$lib/assets/icons/close.png';
    import removeSrc from '$lib/assets/icons/remove.png';
    import { fade } from 'svelte/transition';

    export let fixedHeight: number | undefined = undefined;
    export let fixedOutputHeight: number | undefined = undefined;
    export let problemId: string | undefined = undefined;

    let socket: Socket | null;
    let data: HTMLElement;
    let text: string;
    let textarea: HTMLTextAreaElement;
    let consoleElement: HTMLElement;
    let initialText: string;
    let outputText: string = 'Output (try running the code)';
    let outputType:
        | 'success'
        | 'error'
        | 'timeout'
        | 'running'
        | 'input required'
        | 'compile error'
        | undefined = undefined;
    let outputTime: number | undefined = undefined;
    let copyText: string = 'Copy';
    let runDisabled: boolean = false;
    let askingForInput: boolean = false;
    let inputPrefix: string | null;
    let testRunAnswerType: 'correct' | 'incorrect' | 'timeout' | 'error' | undefined = undefined;
    let testRunInfo: string | undefined = undefined;
    let testRunDescription: string | undefined = undefined;
    let submissionResults: {
        info: string;
        status: 'correct' | 'incorrect' | 'timeout' | 'error';
    }[] = [];
    let submissionResult: 'correct' | 'incorrect' | 'running' | undefined = undefined;

    const submitIconsMap: Record<string, any> = {
        correct: checkSrc,
        incorrect: closeSrc,
        error: removeSrc
    };

    const setHighlightedText = () => {
        data.innerHTML = highlighter.codeToHtml(text, {
            lang: 'python',
            theme: 'snazzy-light'
        });
    };

    const submitCode = async () => {
        try {
            submissionResults = [];
            submissionResult = 'running';
            const response = await fetch($page.url.origin + `/python-api/problem/${problemId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ code: text })
            });
            if (!response.ok) {
                throw new Error('Failed to run code');
            }
            submissionResults = await response.json();
            if (submissionResults.every((val) => val.status === 'correct')) {
                submissionResult = 'correct';
            } else {
                submissionResult = 'incorrect';
            }
        } catch (err) {
            submissionResult = undefined;
            if (err instanceof Error) alert('An unexpected error occurred. ' + err.message);
            else alert('An unexpected error occurred.');
        }
    };

    const connectSocket = async () => {
        socket = io($page.url.origin, { auth: { code: text } });
        socket.on('finished', (data) => {
            outputText = data.output;
            consoleElement.textContent = outputText;
            outputType = data.status;
            outputTime = data.time;
            runDisabled = false;
            askingForInput = false;
            inputPrefix = null;
            window.getSelection()?.removeAllRanges();
            socket!.disconnect();
        });
        socket.on('input', (data) => {
            outputText = data.output;
            if (outputText.at(-1) === '\n') {
                outputText += '‎';
            }
            inputPrefix = outputText;
            consoleElement.textContent = outputText;
            outputType = 'input required';
            askingForInput = true;
            setTimeout(() => {
                consoleElement.focus();
                let selection = window.getSelection();
                let focus = selection!.focusNode!;
                let range = document.createRange();
                range.selectNode(focus);
                range.setStart(focus, inputPrefix!.length);
                range.collapse(true);
                selection!.removeAllRanges();
                selection!.addRange(range);
            }, 100);
        });
        outputText = '(running)';
        consoleElement.textContent = outputText;
        outputTime = undefined;
        runDisabled = true;
        outputType = 'running';
        socket.connect();
    };

    const runCode = async () => {
        try {
            runDisabled = true;
            outputText = '(running)';
            consoleElement.textContent = outputText;
            outputTime = undefined;
            testRunAnswerType = undefined;
            testRunInfo = undefined;
            testRunDescription = undefined;
            outputType = 'running';
            let url = $page.url.origin + '/python-api/sandbox';
            if (problemId !== undefined) {
                url += `/${problemId}`;
            }
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ code: text })
            });
            if (!response.ok) {
                throw new Error('Failed to run code');
            }
            const data = await response.json();
            runDisabled = false;
            if (data.status === 'redirect-ws') {
                connectSocket();
            } else if (problemId !== undefined) {
                outputText = data.output.output;
                consoleElement.textContent = outputText;
                outputTime = data.output.time;
                outputType = data.output.status;
                testRunDescription = data.description;
                testRunAnswerType = data.answer.status;
                testRunInfo = data.answer.info;
            } else {
                outputText = data.output;
                consoleElement.textContent = outputText;
                outputType = data.status;
                outputTime = data.time;
            }
        } catch (err) {
            runDisabled = false;
            if (err instanceof Error) alert('An unexpected error occurred. ' + err.message);
            else alert('An unexpected error occurred.');
        }
    };

    const handleTab = (e: Event) => {
        if ('key' in e && e.key == 'Tab') {
            e.preventDefault();
            let start = textarea.selectionStart;
            let end = textarea.selectionEnd;

            textarea.value =
                textarea.value.substring(0, start) + '    ' + textarea.value.substring(end);

            textarea.selectionStart = textarea.selectionEnd = start + 4;
            text = textarea.value;
            setHighlightedText();
        }
    };

    const submit = () => {
        outputText = consoleElement.textContent ?? '';
        askingForInput = false;
        outputType = 'running';
        socket!.emit('input', outputText.substring(inputPrefix!.length));
    };

    const handleConsole = (e: Event) => {
        if ('key' in e && e.key === 'Enter') {
            e.preventDefault();
            submit();
        }
        if ('key' in e && e.key === 'Backspace' && consoleElement.innerText! === inputPrefix) {
            e.preventDefault();
        }
    };

    const handleConsoleRelease = () => {
        if (consoleElement.textContent!.substring(0, inputPrefix!.length) !== inputPrefix) {
            let selection = window.getSelection();
            let focus = selection!.focusNode!;
            focus.textContent = inputPrefix;
            let range = document.createRange();
            range.selectNode(focus);
            range.setStart(focus, inputPrefix!.length);
            range.collapse(true);
            selection!.removeAllRanges();
            selection!.addRange(range);
        }
    };

    onMount(() => {
        text = data?.innerText;
        initialText = text;
        textarea.value = text;
        textarea.onkeydown = handleTab;
        consoleElement.onkeydown = handleConsole;
        consoleElement.onkeyup = handleConsoleRelease;
    });
</script>

<div class="container">
    <div class="language-info">
        <p>Python 3.8.10</p>
        <div class="top-buttons">
            <Button
                variant="ghost"
                on:click={() => {
                    if (socket) {
                        socket.disconnect();
                    }
                    inputPrefix = null;
                    window.getSelection()?.removeAllRanges();
                    text = initialText;
                    outputText = 'Output (try running the code)';
                    consoleElement.textContent = outputText;
                    outputType = undefined;
                    outputTime = undefined;
                    textarea.value = text;
                    copyText = 'Copy';
                    runDisabled = false;
                    askingForInput = false;
                    testRunAnswerType = undefined;
                    testRunInfo = undefined;
                    testRunDescription = undefined;
                    submissionResults = [];
                    submissionResult = undefined;
                    setHighlightedText();
                }}
                disabled={submissionResult === 'running'}
            >
                Reset
            </Button>
            <Button
                variant="secondary"
                on:click={() => {
                    try {
                        navigator.clipboard.writeText(text);
                        copyText = 'Copied!';
                    } catch (err) {
                        alert('There was an error copying the code.');
                    }
                }}
            >
                <span>{copyText}</span>
                <img src={copySrc} alt="copy" />
            </Button>
        </div>
    </div>
    <div
        class="editable-code-container"
        style={fixedHeight ? `height: calc(${fixedHeight} * 1.5rem + 2 * var(--padding-xl))` : ''}
    >
        <div class="editable-code">
            <span bind:this={data}>
                <slot />
            </span>
            <textarea
                autocomplete="off"
                autocorrect="off"
                autocapitalize="off"
                spellcheck="false"
                bind:this={textarea}
                on:input={() => {
                    text = textarea.value;
                    copyText = 'Copy';
                    setHighlightedText();
                }}
            ></textarea>
        </div>
    </div>
    <div class="output">
        <pre
            style={fixedOutputHeight
                ? `height: calc(1.5rem * ${fixedOutputHeight} + 2 * var(--padding-xl));`
                : ''}>
            <code
                bind:this={consoleElement}
                autocorrect="off"
                autocapitalize="off"
                spellcheck="false"
                class={outputType}
                contenteditable={askingForInput}>{outputText}</code
            >
        </pre>
    </div>
    <div class="controls">
        <Button on:click={runCode} disabled={runDisabled}>
            <img src={logoSrc} alt="Logo" />
            <span>
                {#if problemId}
                    Test
                {:else}
                    Run
                {/if}
            </span>
        </Button>
        {#if askingForInput}
            <div class="main-buttons" transition:fade={{ duration: 300 }}>
                <Button on:click={submit}>Submit</Button>
                <Button
                    variant="ghost"
                    on:click={() => {
                        if (socket) {
                            socket.disconnect();
                        }
                        inputPrefix = null;
                        outputText = 'Output (try running the code)';
                        consoleElement.textContent = outputText;
                        outputType = undefined;
                        outputTime = undefined;
                        runDisabled = false;
                        askingForInput = false;
                        window.getSelection()?.removeAllRanges();
                    }}
                >
                    Stop
                </Button>
            </div>
        {/if}
        {#if outputType && testRunAnswerType === undefined}
            {#if outputType === 'timeout'}
                <p class={outputType}>{`${toTitleCase(outputType)} • >2s`}</p>
            {:else}
                <p class={outputType}>
                    {`${toTitleCase(outputType)}`}
                    {#if outputTime && outputType !== 'compile error'}
                        {#if outputTime > 1}
                            {` • ${outputTime.toFixed(3)}s`}
                        {:else}
                            {` • ${(outputTime * 1000).toFixed(3)}ms`}
                        {/if}
                    {/if}
                </p>
            {/if}
        {/if}
        {#if testRunAnswerType && testRunInfo}
            <p class={testRunAnswerType}>
                {testRunDescription} • {testRunInfo}
                {#if outputTime && outputType !== 'compile error'}
                    {#if outputTime > 1}
                        {` • ${outputTime.toFixed(3)}s`}
                    {:else}
                        {` • ${(outputTime * 1000).toFixed(3)}ms`}
                    {/if}
                {/if}
            </p>
        {/if}
    </div>
    {#if problemId}
        <div class="problem-submit">
            <Button
                variant="secondary"
                disabled={submissionResult === 'running'}
                on:click={submitCode}
            >
                Submit
            </Button>
            {#if submissionResult}
                <div class="results">
                    <p class={submissionResult}>
                        {#if submissionResult === 'correct'}
                            All test cases passed
                        {:else if submissionResult === 'running'}
                            Running
                        {:else}
                            One or more test cases failed
                        {/if}
                    </p>
                    {#each submissionResults as result, i (i)}
                        <div class="result {result.status}" title={result.info}>
                            <img src={submitIconsMap[result.status]} alt={result.status} />
                        </div>
                    {/each}
                </div>
            {/if}
        </div>
    {/if}
</div>

<style lang="scss">
    .container {
        display: grid;
        border: 2px solid var(--primary);
        border-radius: 0.5rem;

        .language-info {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: var(--padding-smd) var(--padding-xl);
            box-shadow: 0 0.125rem 0.125rem rgba(0, 0, 0, 0.075);
            flex-wrap: wrap;
            gap: var(--padding-lg);

            p {
                color: var(--text);
                @include paragraph-sm-b;
            }

            .top-buttons {
                display: flex;
                gap: var(--padding-smd);
            }

            :global(img) {
                filter: brightness(100%);
            }
        }

        .output {
            overflow: auto;

            pre {
                padding: var(--padding-xl);
                background-color: rgb(249, 249, 249) !important;
                display: grid;
                width: auto;
                max-height: calc(10 * 1.5rem + 2 * var(--padding-xl));

                code {
                    font-size: 1.125rem;
                    line-height: 1.5rem;
                    width: auto;
                    min-width: max-content;
                    padding: 0;
                    font-family: monospace;
                    color: var(--light-gray);

                    &:focus {
                        border-radius: 0.0625rem;
                        outline: 0.125rem solid var(--light-gray);
                        outline-offset: var(--padding-sm);
                    }

                    &.error,
                    &.timeout {
                        color: var(--error);
                    }

                    &.success,
                    &.input {
                        color: var(--gray);
                    }
                }
            }
        }

        .controls,
        .problem-submit {
            padding: var(--padding-xl);
            display: flex;
            align-items: center;
            column-gap: var(--padding-smd);
            row-gap: var(--padding-xl);
            flex-wrap: wrap;
        }

        .controls {
            .main-buttons {
                display: flex;
                column-gap: var(--padding-smd);
                row-gap: var(--padding-xl);
                flex-wrap: wrap;
            }

            p {
                min-width: fit-content;
                margin-left: auto;
                @include paragraph-sm-b;

                &.success,
                &.correct {
                    color: #2dae58;
                }

                &.error,
                &.incorrect,
                &.timeout {
                    color: var(--error);
                }

                &.running {
                    color: #d9a404;
                }

                &.input {
                    color: var(--primary);
                }
            }
        }

        .problem-submit {
            padding: var(--padding-lg) 0;
            margin: 0 var(--padding-lg);
            border-top: 1px solid var(--light-gray);
            column-gap: var(--padding-lg);
            flex-wrap: nowrap;
            align-items: flex-start;

            .results {
                margin-left: auto;
                display: flex;
                column-gap: var(--padding-sm);
                row-gap: var(--padding-sm);
                flex-wrap: wrap;

                p {
                    margin-right: var(--padding-sm);
                    @include paragraph-sm-b;

                    & {
                        line-height: 2rem;
                    }

                    &.correct {
                        color: #2dae58;
                    }

                    &.incorrect {
                        color: var(--error);
                    }

                    &.running {
                        color: #d9a404;
                    }
                }

                .result {
                    margin: auto 0;
                    width: 1.5rem;
                    height: 1.5rem;
                    border-radius: 50%;
                    display: grid;
                    place-items: center;

                    &.correct {
                        background-color: #2dae58;
                    }

                    &.incorrect,
                    &.error {
                        background-color: var(--error);
                    }

                    img {
                        width: 1.25rem;
                        height: 1.25rem;
                        filter: brightness(0) invert(1);
                    }
                }
            }
        }
    }

    .editable-code-container {
        display: grid;
        overflow: auto;
        max-height: calc(20 * 1.5rem + 2 * var(--padding-xl));
    }

    .editable-code {
        position: relative;

        & > span {
            width: auto;
            max-width: 100%;

            :global(.code-container) {
                border: none;
                width: auto;
            }

            :global(.shiki) {
                width: auto;
                overflow: visible;
            }
        }

        textarea {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border: none;
            background: transparent;
            padding: var(--padding-xl);
            font-size: 1.125rem;
            line-height: 1.5rem;
            font-family: monospace;
            color: transparent;
            caret-color: var(--gray);
            resize: none;

            &:focus-visible {
                outline: none;
            }
        }
    }
</style>
