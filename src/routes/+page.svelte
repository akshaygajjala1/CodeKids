<script lang="ts">
    import Footer from '$lib/components/Footer.svelte';
    import HomeNavbar from '$lib/components/HomeNavbar.svelte';
    import HomeMainAction from '$lib/components/HomeMainAction.svelte';
</script>

<HomeNavbar />
<div class="container">
    <div class="content">
        <section id='home'>
            <div class="title-container">
                <h2>Empowering the next generation of coders — through a dynamic teaching platform — supercharged with code execution.</h2>
                <p>With weekly classes, asynchronous learning, and coding assignments giving instant feedback, CodeKids Academy is a platform designed for the newest generation of learners.</p>
                <HomeMainAction loggedIn={false} />
            </div>
        </section>
    </div>
    <Footer />
</div>

<style lang="scss">
    .container {
        display: flex;
        flex-direction: column;

        .content {
            height: 100%;
            min-height: 50rem;
            margin-top: 3.75rem;
            padding: var(--padding-3xl) 0; 
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: flex-start;

            #home {
                max-width: 90rem;
                margin: 0 auto;
                padding: 0 var(--page-padding);

                .title-container {
                    padding-top: var(--padding-3xl);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: flex-start;
                    gap: var(--padding-md);
                    text-align: center;
                    text-wrap: balance;

                    p {
                        color: var(--gray);
                    }

                    @media screen and (max-width: 767px) {
                        padding-top: 0;
                    }
                }
            }
        }
    }
</style>
