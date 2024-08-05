<script lang="ts">
    export let title;
    export let readingTime;
    export let toc;
    export let lockedUntil = undefined;

    let date = lockedUntil ? new Date(lockedUntil) : undefined;
</script>

<h1>{title}</h1>
<p>
    {readingTime.text} | {readingTime.words} words
    {#if date}
        | Unlocked on {date.toLocaleDateString()} at {date.toLocaleTimeString()}
    {/if}
    {#if toc}
        <span id="in-this-lesson-link">
            | <button id="in-this-lesson-button"><u>In this lesson</u></button></span
        >
    {/if}
</p>
<slot />

<style>
    #in-this-lesson-link {
        display: none;
    }

    #in-this-lesson-button {
        background: transparent;
        border: none;
        cursor: pointer;
        padding: 0;
    }
</style>
