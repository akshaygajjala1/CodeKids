<script lang="ts">
    import Footer from '$lib/components/Footer.svelte';
    import HomeNavbar from '$lib/components/HomeNavbar.svelte';
</script>

<HomeNavbar />
<div class="container">
    <div class="content"></div>
    <Footer />
</div>

<style lang="scss">
    .container {
        display: flex;
        flex-direction: column;
        height: 100vh;

        .content {
            height: 100%;
            margin-top: 3.75rem;
            padding: var(--padding-3xl) 0; 
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: flex-start;
        }
    }
</style>
