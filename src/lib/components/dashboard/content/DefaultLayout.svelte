<script lang="ts">
    export let title;
    export let readingTime;
    export let toc;
</script>

<h1>{title}</h1>
<p>
    {readingTime.text} | {readingTime.words} words
    {#if toc}
        <span id="in-this-lesson-link"> | <button id="in-this-lesson-button"><u>In this lesson</u></button></span>
    {/if}
</p>
<slot />

<style lang="scss">
    #in-this-lesson-button {
        background: transparent;
        border: none;
        cursor: pointer;
        padding: 0;
    }
</style>
