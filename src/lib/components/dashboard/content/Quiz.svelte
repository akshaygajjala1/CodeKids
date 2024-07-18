<script lang="ts">
    import Button from "$lib/components/Button.svelte";
    import { fade } from "svelte/transition";

    import downArrowSrc from '$lib/assets/icons/keyboard_arrow_down.png';

    export let answers: string[];
    export let correctAnswerIndex: number;
    export let explanation: string;

    let selectedIndex: number | null = null;
    let answered: boolean = false;
    let correct: boolean | null = null;
    let explanationExpanded: boolean = false;

    $: if (answered) correct = selectedIndex === correctAnswerIndex;
</script>

<div class="quiz">
    <!-- preloading purposes -->
    <img src={downArrowSrc} alt="down arrow" style="display: none;" />
    <!---->
    <div class="title">
        <h3><slot /></h3>
        <p>Select one answer</p>
    </div>
    <div class="answers">
        {#each answers as answer, i}
            <div class="answer">
                <button 
                    on:click={() => selectedIndex = i} 
                    disabled={answered}
                    class:incorrect={answered && i !== correctAnswerIndex}
                    class:answered
                >
                    <div class="radio-btn">
                        <div class="btn" class:selected={selectedIndex === i}></div>
                    </div>
                    <p>{answer}</p>
                </button>
            </div>
        {/each}
    </div>
    <div class="controls-explanation">
        <div class="controls">
            <div class="submit-clear">
                <Button
                    disabled={answered || selectedIndex === null}
                    on:click={() => answered = true}
                >
                    Submit
                </Button>
                <Button
                    variant="ghost"
                    disabled={answered || selectedIndex === null}
                    on:click={() => {
                        selectedIndex = null;
                    }}
                >
                    Clear
                </Button>
            </div>
            {#if answered}
                <div class="result" transition:fade={{ duration: 300 }}>
                    <p class:correct>{correct ? 'Correct!' : 'Incorrect'}</p>
                    <Button
                        variant="secondary"
                        on:click={() => explanationExpanded = !explanationExpanded}
                    >
                        <span>View explanation</span>
                        <img src={downArrowSrc} class:active={explanationExpanded} alt="down arrow" />
                    </Button>
                </div>
            {/if}
        </div>
        <div class="explanation-container" class:expanded={explanationExpanded}>
            <div class="explanation">
                <p>{explanation}</p>
            </div>
        </div>
    </div>
</div>

<style lang="scss">
    .quiz {
        display: flex;
        flex-direction: column;
        gap: var(--padding-xl);
        padding: var(--padding-xl);
        border: 2px solid var(--primary);
        border-radius: 0.5rem;

        .title {
            display: flex;
            flex-direction: column;
            gap: var(--padding-sm);

            p {
                @include paragraph-sm;
            }
        }

        .answers {
            display: flex;
            flex-direction: column;
            gap: var(--padding-md);

            .answer {
                display: flex;
                align-items: center;

                button {
                    background-color: transparent;
                    border: none;
                    padding: 0;
                    display: flex;
                    align-items: center;
                    gap: var(--padding-md);
                    cursor: pointer;

                    .radio-btn {
                        width: 1.125rem;
                        height: 1.125rem;
                        border: 0.125rem solid var(--primary);
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        padding: 0.125rem;
                        transition: border-color 300ms ease;

                        .btn {
                            width: 0.625rem;
                            height: 0.625rem;
                            border-radius: 50%;
                            background-color: var(--primary);
                            transform: scale(0);
                            transition: transform 300ms ease, background-color 300ms ease;
                            
                            &.selected {
                                transform: scale(1);
                            }
                        }
                    }

                    p {
                        color: var(--dark-gray);
                        transition: color 300ms ease;
                    }

                    &.answered {
                        cursor: initial;
                    }

                    &.incorrect {
                        p {
                            color: var(--light-gray);
                        }

                        .radio-btn {
                            border-color: var(--light-gray);

                            .btn {
                                background-color: var(--light-gray);
                            }
                        }
                    }
                }
            }
        }

        .controls-explanation {
            display: flex;
            flex-direction: column;
            padding-top: var(--padding-xl);
            border-top: 1px solid var(--light-gray);

            .controls {
                display: flex;
                column-gap: var(--padding-sm);
                row-gap: var(--padding-xl);
                align-items: center;
                justify-content: space-between;
                flex-wrap: wrap;

                .submit-clear {
                    display: flex;
                    align-items: center;
                    gap: var(--padding-smd);
                }

                .result {
                    display: flex;
                    align-items: center;
                    gap: var(--padding-xl);

                    p {
                        text-align: right;
                        color: var(--error);
                        padding-left: var(--padding-md);
                        @include paragraph-sm-b;

                        &.correct {
                            color: #2DAE58;
                        }
                    }

                    :global(button img) {
                        transition: transform 300ms ease;
                    }

                    :global(button img.active) {
                        transform: rotate(180deg);
                    }
                }
            }

            .explanation-container {
                display: grid;
                grid-template-rows: 0fr;
                overflow: hidden;
                transition: grid-template-rows 300ms ease;
                
                &.expanded {
                    grid-template-rows: 1fr;
                }

                .explanation {
                    min-height: 0;
                    
                    p {
                        padding-top: var(--padding-xl);
                    }
                }
            }
        }
    }
</style>