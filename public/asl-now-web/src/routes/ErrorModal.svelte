<script lang="ts">
    import Modal from "$lib/js/Modal.svelte"
    import {XCircle} from "lucide-svelte"
    import {invalidateAll} from "$app/navigation";

    export let message: string;
    export let moreInfo: string | null = null;
    let showMoreInfo = false;
</script>

<Modal>
    <h1>
        <XCircle style="margin: auto"/>
    </h1>
    <p>{message}</p>
    <a href="/" data-sveltekit-reload>Refresh</a>
    {#if moreInfo}
        <p>
            <span class="link" on:click={() => {showMoreInfo = !showMoreInfo}}
                  on:keydown={() => {showMoreInfo = !showMoreInfo}} role="button" tabindex="0">
                {#if showMoreInfo}
                    Less Info
                {:else}
                    More Info
                {/if}
            </span>
        </p>
        {#if showMoreInfo}
            <div style="max-height: 50vh; overflow: scroll">
                <pre style="background: black; color: white">{moreInfo}</pre>
            </div>
            <a href="https://github.com/Sid220/asl-now/issues/new?title={message}&body=%60%60%60{moreInfo}%60%60%60"
               target="_blank"
               rel="noopener noreferrer">Report this issue</a>
        {/if}
    {/if}
</Modal>
