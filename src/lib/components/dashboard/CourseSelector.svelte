<script lang="ts">
    export let courseIcon: string;
    export let courseName: string;
    export let selected: boolean = false;
</script>

<a class={selected ? "course selected" : "course"} href={`/dashboard/${courseName.toLowerCase()}`}>
    <img src={courseIcon} alt={courseName} />
    <h3>{courseName}</h3>
</a>

<style lang="scss">
    .course {
        display: flex;
        align-items: center;
        gap: var(--padding-smd);
        width: fit-content;
        text-decoration: none;

        img {
            width: 1.9375rem;
            height: 1.9375rem;
            filter: brightness(0) saturate(100%) invert(35%) sepia(0%) saturate(12%) hue-rotate(165deg) brightness(92%) contrast(92%);
            transition: filter 300ms ease;
        }

        h3 {
            color: var(--gray);
            transition: color 300ms ease;
        }

        &:not(.selected):hover {
            img {
                filter: brightness(0) saturate(100%) invert(18%) sepia(0%) saturate(124%) hue-rotate(204deg) brightness(84%) contrast(80%);
            }

            h3 {
                color: var(--dark-gray);
            }
        }

        &.selected {
            img {
                filter: brightness(0) saturate(100%) invert(13%) sepia(91%) saturate(7360%) hue-rotate(281deg) brightness(91%) contrast(105%);
            }

            h3 {
                color: var(--primary);
            }
        }
    }
</style>