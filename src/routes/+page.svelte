<script lang="ts">
    import Footer from '$lib/components/home/Footer.svelte';
    import HomeNavbar from '$lib/components/home/Navbar.svelte';
    import HomeMainAction from '$lib/components/home/MainAction.svelte';
    import EditableCode from '$lib/components/dashboard/content/EditableCode.svelte';
    import type { PageData } from './$types';
    import { highlighter } from '$lib/helpers/shiki';

    export let data: PageData;
    let loggedIn: boolean;

    const codeSnippet = `# return the nth number in the Fibonacci sequence
# assuming first number is 0
def fibonacci(n: int) -> int:
    a, b = 0, 1
    if n == 1:
        return a
    if n == 2:
        return b
    for i in range(2, n):
        a, b = b, a + b 
    return b

print(fibonacci(10))  # edit me!`;

    $: loggedIn = data.id !== undefined;
</script>

<HomeNavbar {loggedIn} />
<div class="container">
    <div class="content">
        <section id="home">
            <div class="title-container">
                <h2>
                    Empowering the next generation of coders <span class="desktop-only">—</span>
                    through a dynamic teaching platform <span class="desktop-only">—</span> supercharged
                    with code execution.
                </h2>
                <p>
                    With weekly classes, asynchronous learning, and coding assignments giving
                    instant feedback, CodeKids Academy is a platform designed for the newest
                    generation of learners.
                </p>
                <HomeMainAction {loggedIn} hideSignOut />
                <div class="prose">
                    <EditableCode>
                        <div class="code-container">
                            {@html highlighter.codeToHtml(codeSnippet, {
                                lang: 'python',
                                theme: 'snazzy-light'
                            })}
                        </div>
                    </EditableCode>
                </div>
            </div>
        </section>
        <section id="about">
            <div class="about-container">
                <p>
                    At CodeKids Academy, we believe in shaping future innovators with a robust and
                    engaging learning experience. Our platform offers weekly classes, asynchronous
                    learning opportunities, and coding assignments that provide instant feedback.
                    Designed specifically for young learners, CodeKids Academy combines interactive
                    lessons with practical coding exercises to foster a deep understanding of
                    programming and computational thinking. Join us and ignite your child's passion
                    for coding today!
                </p>
            </div>
        </section>
        <section id="meet-the-tutors">
            <div class="meet-container">
                <p>Pranav: Akshay: Ram:</p>
            </div>
        </section>
        <section id="contact-us">
            <div class="contact-container">
                <p><a href="contact@example.com">Contact Us!</a></p>
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
            gap: 8rem;

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

                    .prose {
                        margin-top: var(--padding-3xl);
                        text-align: left;
                        max-width: 55rem;
                        width: 100%;

                        :global(.container) {
                            margin: 0;
                            box-shadow: 0 0.25rem 0.75rem rgba(0, 0, 0, 0.25);
                        }
                    }
                }
            }
            #about {
                max-width: 90rem;
                margin: 0 auto;
                padding: 0 var(--page-padding);
                scroll-margin-top: 3.75rem;

                .about-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: flex-start;
                    gap: var(--padding-md);
                    text-align: center;
                    text-wrap: balance;
                }
            }
            #meet-the-tutors {
                max-width: 90rem;
                margin: 0 auto;
                padding: 0 var(--page-padding);

                .meet-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: flex-start;
                    gap: var(--padding-md);
                    text-align: center;
                    text-wrap: balance;
                }
            }
            #contact-us {
                max-width: 90rem;
                margin: 0 auto;
                padding: 0 var(--page-padding);

                .contact-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: flex-start;
                    gap: var(--padding-md);
                    text-align: center;
                    text-wrap: balance;
                }
            }
        }
    }
</style>
