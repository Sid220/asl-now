<script lang="ts">
    import {ChevronLeft, ChevronRight} from "lucide-svelte";

    export let items: any[] = [];
    export let activeTabValue: number = 1;
    export let showArrows: boolean = false;

    const handleClick = (tabValue: number) => () => (activeTabValue = tabValue);

    const arrowClick = (direction: number) => () => {
        if (activeTabValue === 1 && direction === -1) {
            activeTabValue = items.length;
            return;
        }
        if (activeTabValue === items.length && direction === 1) {
            activeTabValue = 1;
            return;
        }
        activeTabValue = activeTabValue + direction;
    }
</script>

<nav>
    <ul>
        {#if showArrows}
            <li>
                <span on:click={arrowClick(-1)} on:keydown={arrowClick(-1)} tabindex="0" role="button">
                    <ChevronLeft/>
                </span>
            </li>
        {/if}
        {#each items as item}
            <li class={activeTabValue === item.value ? 'active' : ''}>
            <span on:keydown={handleClick(item.value)} on:click={handleClick(item.value)} role="button"
                  tabindex="0"><svelte:component this={item.label}/></span>
            </li>
        {/each}
        {#if showArrows}
            <li>
                <span on:click={arrowClick(1)} on:keydown={arrowClick(1)} tabindex="0" role="button">
                  <ChevronRight/>
                </span>
            </li>
        {/if}
    </ul>

</nav>
{#each items as item}
    <div class="box" style="display: {activeTabValue === item.value ? 'block' : 'none'}">
        <svelte:component this={item.component} {...item.props}/>
    </div>
{/each}

<style>
    .active span {
        color: var(--color-theme-1);
    }
</style>