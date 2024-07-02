<script lang="ts">
    import Footer from '$lib/components/home/Footer.svelte';
    import HomeNavbar from '$lib/components/home/Navbar.svelte';
    import HomeMainAction from '$lib/components/home/MainAction.svelte';
</script>

<HomeNavbar />
<div class="container">
    <div class="content">
        <section id='home'>
            <div class="title-container">
                <h2>Empowering the next generation of coders <span class="desktop-only">—</span> through a dynamic teaching platform <span class="desktop-only">—</span> supercharged with code execution.</h2>
                <p>With weekly classes, asynchronous learning, and coding assignments giving instant feedback, CodeKids Academy is a platform designed for the newest generation of learners.</p>
                <HomeMainAction loggedIn={false} />
            </div>
        </section>
        <section id='about'>
            <div class="about-container">
                <p>At CodeKids Academy, we believe in shaping future innovators with a robust and engaging learning experience. Our platform offers weekly classes, asynchronous learning opportunities, and coding assignments that provide instant feedback. Designed specifically for young learners, CodeKids Academy combines interactive lessons with practical coding exercises to foster a deep understanding of programming and computational thinking. Join us and ignite your child's passion for coding today!</p>
            </div>
        </section>
        <section id='meettutors'>
            <div class="meet-container">
                <p>Pranav: Akshay: Ram:</p>
            </div>
        </section>
        <section id='contact'>  
            <div class="contact-container">
                <p><a>Contact Us!</a></p>
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
                    padding-top: var(--padding-md);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: flex-start;
                    gap: var(--padding-md);
                    text-align: center;
                    text-wrap: balance;

                    @media screen and (max-width: 74rem) {
                        .desktop-only {
                            display: none;
                        }
                    }

                    @media screen and (max-width: 767px) {
                        padding-top: 0;
                    }
                }
            }
            #about {
                max-width: 90rem;
                margin: 0 auto;
                padding: 0 var(--page-padding);

                .about-container {
                    padding-top: var(--padding-md);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: flex-start;
                    gap: var(--padding-md);
                    text-align: center;
                    text-wrap: balance;

                    @media screen and (max-width: 74rem) {
                        .desktop-only {
                            display: none;
                        }
                    }

                    @media screen and (max-width: 767px) {
                        padding-top: 0;
                    }
                }
            }
            #meettutors {
                max-width: 90rem;
                margin: 0 auto;
                padding: 0 var(--page-padding);

                .meet-container {
                    padding-top: var(--padding-md);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: flex-start;
                    gap: var(--padding-md);
                    text-align: center;
                    text-wrap: balance;

                    @media screen and (max-width: 74rem) {
                        .desktop-only {
                            display: none;
                        }
                    }

                    @media screen and (max-width: 767px) {
                        padding-top: 0;
                    }
                }
            }
            #contact {
                max-width: 90rem;
                margin: 0 auto;
                padding: 0 var(--page-padding);

                .contact-container {
                    padding-top: var(--padding-md);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: flex-start;
                    gap: var(--padding-md);
                    text-align: center;
                    text-wrap: balance;

                    @media screen and (max-width: 74rem) {
                        .desktop-only {
                            display: none;
                        }
                    }

                    @media screen and (max-width: 767px) {
                        padding-top: 0;
                    }
                }
            }
        }
    }
</style>
