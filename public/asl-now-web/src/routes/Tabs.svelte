<script lang="ts">
    export let items: any[] = [];
    export let activeTabValue: number = 1;

    const handleClick = (tabValue: number) => () => (activeTabValue = tabValue);
</script>

<nav>
    <ul>
        {#each items as item}
            <li class={activeTabValue === item.value ? 'active' : ''}>
            <span on:keydown={handleClick(item.value)} on:click={handleClick(item.value)} role="button"
                  tabindex="0"><svelte:component this={item.label}/></span>
            </li>
        {/each}
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