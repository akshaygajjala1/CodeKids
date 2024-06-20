<script lang="ts">
    import { fly } from "svelte/transition";
</script>

<div class="transition"
    in:fly={{ x: 40, duration: 300, delay: 400 }}
    out:fly={{ x: -40, duration: 300 }}
>
    <slot />
</div>