<script lang="ts">
    export let text: string;
    export let current: boolean;
</script>

<div class="text-container">
    <p class={current ? "current" : ""}>{text}</p>
</div>

<style lang="scss">

    .text-container{
        display: flex;
        width: 20.5rem;
        height: 2.5rem;
        padding: 0rem var(--padding-sm, 0.5rem);
        justify-content: space-between;
        align-items: center;
        flex-shrink: 0;
        border-radius: 0.5rem;


        &:hover{
            box-shadow: var(--shadow-sm-medium);
        }

        p {
        display: flex;
        height: 1.597rem;
        flex-direction: column;
        justify-content: center;
        flex: 1 0 0;
        @include paragraph-xl;
        color: var(--colors-gray, #565656);
        }
        .current{
        @include paragraph-xl-b;
        color: var(--colors-dark-gray, #383838);
        }
        
        
    }
    

</style>

