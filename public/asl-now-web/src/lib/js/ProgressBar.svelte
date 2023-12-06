<script lang="ts">
    export let sections: {
        progress: number,
        max: number,
    }[];

    let max: number;
    let progress: number;
    $: {
        max = sections.reduce((acc, cur) => acc + cur.max, 0);
    }
    $: {
        progress = sections.reduce((acc, cur) => acc + cur.progress, 0);
    }
</script>

<div style="display: flex; width: 100%; gap: 10px">
    {#each sections as section}
        <div style="background: var(--color-bg-1); width: 100%; height: 20px">
            <div style="background: var(--color-theme-1); width: {(section.progress / section.max) * 100}%; height: 100%"></div>
        </div>
    {/each}
</div>
{progress}/{max}
