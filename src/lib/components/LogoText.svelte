<script lang="ts">
    import Logo from './Logo.svelte';
</script>

<a class="logo-text" href="/">
    <Logo />
    <h3>CodeKids Academy</h3>
</a>

<style lang="scss">
    .logo-text {
        display: flex;
        gap: var(--padding-smd);
        object-fit: cover;
        width: fit-content;
        text-decoration: none;
    }
</style>
