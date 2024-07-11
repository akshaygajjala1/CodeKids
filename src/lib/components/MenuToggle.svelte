<script lang="ts">
    export let menuActive = false;
</script>

<button
    id="menu-button"
    class={menuActive ? 'menu-active' : ''}
    on:click={() => (menuActive = !menuActive)}
>
    <div id="menu-icon">
        <div id="menu-icon-bar-1"></div>
        <div id="menu-icon-bar-2">
            <div id="menu-icon-bar-flip"></div>
        </div>
        <div id="menu-icon-bar-3"></div>
    </div>
</button>

<style lang="scss">
    #menu-button {
        border: none;
        background: none;
        cursor: pointer;
        display: none;
        place-items: center;
        padding: 0.375rem var(--padding-md);
        margin-left: var(--padding-smd);
        border-radius: 1rem;
        transition:
            background-color 600ms ease,
            box-shadow 600ms ease;

        &:hover {
            box-shadow: var(--shadow-sm-light);
        }

        &:active {
            box-shadow: var(--shadow-sm-medium);
        }

        #menu-icon {
            width: 1.25rem;
            height: 1.25rem;
            display: flex;
            flex-direction: column;
            align-items: stretch;
            justify-content: space-around;

            div {
                background-color: var(--secondary);
                height: calc(1.6rem / 16);
                transition:
                    background-color 600ms ease,
                    opacity 600ms ease,
                    transform 500ms ease;
            }
        }

        &.menu-active {
            background: var(--secondary);

            &:hover {
                box-shadow: var(--shadow-sm-heavy);
            }

            &:active {
                box-shadow: var(--shadow-sm-black);
            }

            #menu-icon {
                #menu-icon-bar-2,
                #menu-icon-bar-flip {
                    background-color: var(--background);
                }

                #menu-icon-bar-2 {
                    transform: rotate(45deg);
                }

                #menu-icon-bar-flip {
                    transform: rotate(-90deg);
                }

                #menu-icon-bar-1,
                #menu-icon-bar-3 {
                    opacity: 0;
                }
            }
        }
    }
</style>
