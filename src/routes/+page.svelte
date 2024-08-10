<script lang="ts">
    import { onMount } from 'svelte';
    import Footer from '$lib/components/home/Footer.svelte';
    import HomeNavbar from '$lib/components/home/Navbar.svelte';
    import HomeMainAction from '$lib/components/home/MainAction.svelte';
    import EditableCode from '$lib/components/dashboard/content/EditableCode.svelte';
    import type { PageData } from './$types';
    import { highlighter } from '$lib/helpers/shiki';
    import Label from '$lib/components/Label.svelte';

    export let data: PageData;

    let loggedIn: boolean;
    let innerWidth: number;
    let debounceCallbacks: any[] = [];
    let allowScrollAnimations = true;
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

num = int(input('Enter a number: '))
print(fibonacci(num))  # edit me!`;
    let htmlCode: string;
    if (highlighter) {
        htmlCode = highlighter.codeToHtml(codeSnippet, {
            lang: 'python',
            theme: 'snazzy-light'
        });
    }
    
    onMount(() => {
        htmlCode = highlighter.codeToHtml(codeSnippet, {
            lang: 'python',
            theme: 'snazzy-light'
        });
    })

    $: loggedIn = data.id !== undefined;

    const remToPx = (rem: string) => {
        return (
            parseFloat(rem.split('rem')[0]) *
            parseFloat(getComputedStyle(document.querySelector('html')!).fontSize)
        );
    };

    const pauseScrollAnimations = () => {
        debounceCallbacks.forEach((e) => clearTimeout(e));
        allowScrollAnimations = false;
        debounceCallbacks.push(setTimeout(() => (allowScrollAnimations = true), 1500));
    };

    onMount(() => {
        const prose = document.querySelector('#about-prose')! as HTMLElement;
        const allAboutText = document.querySelectorAll(
            '.about-text-container'
        )! as NodeListOf<HTMLElement>;

        const observer = new IntersectionObserver(
            ([e]) => {
                if (!allowScrollAnimations || innerWidth <= remToPx('76rem')) {
                    if (e.target === allAboutText[allAboutText.length - 1]) {
                        if (e.boundingClientRect.top > remToPx('4.75rem') + 1) {
                            for (let i = 0; i < allAboutText.length - 1; i++) {
                                allAboutText[i].style.opacity = '1';
                            }
                        }
                    }
                    if (e.target === allAboutText[0]) {
                        if (e.boundingClientRect.top <= remToPx('4.75rem') + 1) {
                            prose.style.opacity = '1';
                        } else {
                            prose.style.opacity = '0';
                        }
                    }
                    return;
                }

                if (e.target === allAboutText[0]) {
                    if (e.boundingClientRect.top <= remToPx('4.75rem') + 1) {
                        prose.style.opacity = '1';
                        prose.scrollTo({ top: 0, behavior: 'instant' });
                        for (let i = 0; i < allAboutText.length - 1; i++) {
                            allAboutText[i].style.opacity = '1';
                        }
                    } else {
                        prose.style.opacity = '0';
                    }
                } else if (e.target === allAboutText[allAboutText.length - 1]) {
                    if (e.boundingClientRect.top <= remToPx('4.75rem') + 1) {
                        for (let i = 0; i < allAboutText.length - 1; i++) {
                            allAboutText[i].style.opacity = '0';
                            const textTop = document.getElementById('quizzes')!.offsetTop;
                            prose.scrollTo({ top: textTop - 32 });
                        }
                    } else {
                        for (let i = 0; i < allAboutText.length - 1; i++) {
                            allAboutText[i].style.opacity = '1';
                        }

                        if (e.intersectionRatio === 1) {
                            const textTop = document.getElementById('code-execution')!.offsetTop;
                            prose.scrollTo({ top: textTop - 32 });
                        }
                    }
                } else if (e.target === allAboutText[1]) {
                    if (e.boundingClientRect.top <= remToPx('4.75rem') + 1) {
                        const textTop = document.getElementById('markdown')!.offsetTop;
                        prose.scrollTo({ top: textTop - 32 });
                    } else if (e.intersectionRatio === 1) {
                        prose.scrollTo({ top: 0 });
                    }
                } else if (e.target === allAboutText[2]) {
                    if (e.boundingClientRect.top <= remToPx('4.75rem') + 1) {
                        const textTop = document.getElementById('code-execution')!.offsetTop;
                        prose.scrollTo({ top: textTop - 32 });
                    } else if (e.intersectionRatio === 1) {
                        const textTop = document.getElementById('markdown')!.offsetTop;
                        prose.scrollTo({ top: textTop - 32 });
                    }
                }
            },
            {
                rootMargin: `-${remToPx('4.75rem') + 1}px 0px 0px 0px`,
                threshold: [1]
            }
        );

        allAboutText.forEach((e) => observer.observe(e));

        document
            .querySelectorAll("a[href*='#']")
            .forEach((anchor) => anchor.addEventListener('click', pauseScrollAnimations));

        return () => {
            allAboutText.forEach((e) => observer.unobserve(e));
            document
                .querySelectorAll("a[href*='#']")
                .forEach((anchor) => anchor.removeEventListener('click', pauseScrollAnimations));
        };
    });
</script>

<svelte:window bind:innerWidth />

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
                            {@html htmlCode}
                        </div>
                    </EditableCode>
                </div>
            </div>
        </section>
        <section id="about">
            <div class="about-container">
                <div class="about-text">
                    <div class="about-text-container">
                        <Label>About</Label>
                        <h1>Interactivity.</h1>
                        <p>
                            CodeKids Academy was designed from the ground up with a focus on
                            interactivity, as we believe learning how to code should be done
                            hands-on. Keep scrolling, and discover how we made interactivity the
                            forefront of CodeKids Academy.
                        </p>
                    </div>
                    <div class="about-text-container">
                        <p class="powered-by">
                            Powered by <a href="https://mdsvex.pngwn.io">mdsvex</a> and the
                            <a href="https://unifiedjs.com/">Unified</a> ecosystem.
                        </p>
                        <h2>Markdown — <i>supercharged.</i></h2>
                        <p>
                            Each and every one of our lessons is written in Markdown, a lightweight
                            text format widely used in the web. This allows us to convey information
                            elegantly, using <b>bold headings</b>, <i>italicized</i> text, tables,
                            emphasized quotes, and every other feature standard to Markdown (and
                            some more!). However, where CodeKids Academy shines is with its ability
                            to integrate
                            <b>interactive</b> components within our content, such as quizzes, and most
                            importantly, editable code snippets.
                        </p>
                    </div>
                    <div class="about-text-container">
                        <p class="powered-by">
                            Powered by <a href="https://flask.palletsprojects.com/">Flask</a> and
                            <a href="https://github.com/zopefoundation/RestrictedPython"
                                >RestrictedPython</a
                            >.
                        </p>
                        <h2>Code execution — <i>supercharged.</i></h2>
                        <p>
                            To implement our hands-on approach to coding education, we needed a way
                            to integrate interactive Python code snippets safely. To achieve this,
                            we built a backend that executes code made by our students within a
                            <b>sandboxed</b> environment that still allows many of Python's most
                            <b>powerful</b> features to be used.
                        </p>
                    </div>
                    <div class="about-text-container">
                        <p class="powered-by">
                            Powered by <a href="https://socket.io/">socket.io</a>.
                        </p>
                        <h2>Quizzes — <i>supercharged.</i></h2>
                        <p>
                            Simply reading lessons isn't enough for concepts to be hardwired into
                            our brains— it takes repetition, and hands-on practice. This is why we
                            have two types of quizzes to check for understanding: traditional,
                            multiple-choice questions; and free-response quizzes where students
                            write a short program and have it pass several test cases.
                        </p>
                    </div>
                </div>
                <div class="prose-container">
                    <div class="shadow-container">
                        <div class="prose" id="about-prose">
                            <svelte:component this={data.content} />
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <section id="meet-the-tutors">
            <div class="meet-container">
                <div class="meet-text-container">
                    <Label>Meet the Tutors</Label>
                    <h1>A small yet effective team.</h1>
                    <p>
                        This team of three has a solid foundation in computer science, with
                        experience in several programming languages. Being students ourselves, we
                        have learned various concepts and topics, and have an understanding of the
                        most effective ways to learn new material.
                    </p>
                </div>
                <div class="meet-tutor-profiles">
                    <div class="tutor-profile">
                        <div class="picture"></div>
                        <div class="tutor-info">
                            <Label>asdf</Label>
                            <h3>Name</h3>
                            <p>asdf</p>
                        </div>
                    </div>
                    <div class="tutor-profile">
                        <div class="picture"></div>
                        <div class="tutor-info">
                            <Label>Lead Developer & Founder</Label>
                            <h3>Pranav Pakanati</h3>
                            <p>
                                Hi! I'm Pranav, a senior in high school. I've been coding in Python
                                for 6 years, and have experience in several other languages,
                                including Java and TypeScript. I'm so excited to help you guys start
                                your coding adventure!
                            </p>
                        </div>
                    </div>
                    <div class="tutor-profile">
                        <div class="picture"></div>
                        <div class="tutor-info">
                            <Label>asdf</Label>
                            <h3>Name</h3>
                            <p>asdf</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <section id="contact-us">
            <div class="contact-container">
                <div class="contact-text">
                    <Label>Contact</Label>
                    <h1>Get in touch!</h1>
                    <p>
                        Have a question, suggestion, or concern? Please don't hesitate to reach out
                        to us— we would love to hear from you!
                    </p>
                </div>
                <div class="contact-link">
                    <h3>
                        <a href="mailto:contact@codekidsacademy.com">Contact us</a>
                    </h3>
                </div>
            </div>
        </section>
        <section id="get-started">
            <div class="get-started-container">
                <h3>Ready to kickstart your coding journey?</h3>
                <h3>
                    <a href={loggedIn ? '/dashboard' : '/signup'}>Start now</a>
                </h3>
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
                width: 100%;
                margin: 0 auto;
                padding: 0 var(--page-padding);
                scroll-margin-top: 4.75rem;

                .about-container {
                    display: flex;
                    width: 100%;
                    gap: 4rem;

                    .about-text {
                        max-width: 48rem;
                        width: 100%;
                        flex-grow: 2;
                        display: grid;
                        gap: 4rem;
                        isolation: isolate;
                        margin: 0 auto;

                        &::after {
                            content: '';
                            height: 80vh;
                        }

                        .about-text-container {
                            position: sticky;
                            top: 4.75rem;
                            height: clamp(0rem, 50vh, 32rem);
                            display: flex;
                            flex-direction: column;
                            gap: var(--padding-md);
                            background: var(--background);

                            &:not(:first-child)::before {
                                content: '';
                                z-index: 2;
                                position: absolute;
                                bottom: 100%;
                                left: 0;
                                right: 0;
                                height: 4rem;
                                background: linear-gradient(
                                    to bottom,
                                    transparent,
                                    var(--background)
                                );
                            }

                            &:last-child {
                                height: auto;
                            }

                            .powered-by {
                                color: var(--primary);
                                @include paragraph-md;
                            }
                        }
                    }

                    .prose-container {
                        max-width: 36rem;
                        flex-grow: 1;
                        margin: 0 auto;

                        .shadow-container {
                            position: sticky;
                            top: 4.75rem;

                            &::before {
                                content: '';
                                position: absolute;
                                display: block;
                                min-width: calc(100% - 2 * var(--page-padding));
                                min-height: calc(100%);
                                left: var(--page-padding);
                                background: linear-gradient(to top, transparent, var(--background)),
                                    linear-gradient(to bottom, transparent, var(--background));
                                background-repeat: no-repeat;
                                background-size:
                                    100% var(--page-padding),
                                    100% var(--page-padding);
                                background-position:
                                    center top,
                                    center bottom;
                                pointer-events: none;
                                z-index: 2;
                            }
                        }

                        .prose {
                            position: relative;
                            width: 100%;
                            padding: var(--page-padding);
                            height: calc(100vh - 4.75rem - var(--page-padding));
                            max-height: 50rem;
                            border-radius: 0.5rem;
                            outline: 0.125rem solid var(--primary);
                            box-shadow: 0 0.25rem 0.75rem rgba(0, 0, 0, 0.25);
                            opacity: 0;
                            display: flex;
                            flex-direction: column;
                            overflow-y: auto;
                            transition: 600ms opacity ease;
                            scroll-behavior: smooth;

                            :global(h1) {
                                margin-top: 0;
                            }
                        }

                        :global(.prose > *:last-child) {
                            margin-bottom: 0;
                        }
                    }

                    @media screen and (max-width: 76rem) {
                        flex-direction: column;

                        .about-text {
                            max-width: 60rem;

                            &::after {
                                height: 0;
                            }

                            .about-text-container {
                                position: static;
                                height: auto;
                            }
                        }

                        .prose-container {
                            max-width: 60rem;
                        }
                    }
                }
            }

            #meet-the-tutors {
                max-width: 90rem;
                width: 100%;
                margin: 0 auto;
                padding: 0 var(--page-padding);
                scroll-margin-top: 4.75rem;

                .meet-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: flex-start;
                    gap: var(--padding-3xl);
                    text-align: center;

                    .meet-text-container {
                        display: flex;
                        flex-direction: column;
                        gap: var(--padding-md);
                        align-items: center;
                        text-wrap: balance;
                    }

                    .meet-tutor-profiles {
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(16.875rem, 1fr));
                        gap: var(--padding-3xl);
                        width: 100%;

                        .tutor-profile {
                            margin: 0 auto;
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            gap: var(--padding-3xl);
                            min-width: 16.875rem;
                            max-width: 25rem;
                            flex: 1 0 0;

                            .picture {
                                width: 10rem;
                                height: 10rem;
                                border-radius: 50%;
                                background: var(--background);
                                border: 0.25rem solid var(--primary);
                                box-shadow: 0 0 0.25rem rgba(0, 0, 0, 0.5);
                            }

                            .tutor-info {
                                display: flex;
                                flex-direction: column;
                                align-items: center;
                                gap: var(--padding-smd);

                                h3 {
                                    margin-top: var(--padding-xs);
                                }
                            }
                        }
                    }
                }
            }

            #contact-us {
                max-width: 90rem;
                width: 100%;
                margin: 0 auto;
                padding: 0 var(--page-padding);
                scroll-margin-top: 4.75rem;

                .contact-container {
                    display: flex;
                    align-items: center;
                    column-gap: 4rem;
                    row-gap: var(--padding-md);
                    flex-wrap: wrap;

                    .contact-text {
                        display: flex;
                        flex-direction: column;
                        gap: var(--padding-md);
                        flex: 1 0 0;
                        text-wrap: balance;

                        p {
                            max-width: 33rem;
                            min-width: 16rem;
                        }
                    }
                }
            }

            #get-started {
                width: 100%;
                display: grid;
                place-items: center;
                background: linear-gradient(to right, #9309de 0%, rgba(147, 9, 222, 0.5) 100%);

                .get-started-container {
                    width: 100%;
                    max-width: 90rem;
                    margin: 0 auto;
                    padding: 3.53rem var(--page-padding);
                    display: flex;
                    justify-content: space-between;
                    flex-wrap: wrap;
                    column-gap: 4rem;
                    row-gap: var(--padding-3xl);

                    h3 {
                        color: var(--background);
                    }
                }
            }
        }
    }
</style>
