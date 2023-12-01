<script lang="ts">
    import {X} from "lucide-svelte";

    import {createEventDispatcher, onMount} from 'svelte';

    const dispatch = createEventDispatcher();

    let nodeRef: HTMLElement;
    export function close() {
        dispatch('close');
        nodeRef.parentNode!.removeChild(nodeRef);
    }

    export function open() {
        document.body.appendChild(nodeRef);
    }

    export function hide() {
        nodeRef.style.display = 'none';
    }

    export function show() {
        nodeRef.style.display = 'flex';
    }
</script>
<div bind:this={nodeRef} class="modal-container">
    <div class="modal" on:click={close} on:keydown={close} tabindex="-1" role="button"></div>
    <div class="modal-content">
        <span on:click={close} on:keydown={close} role="button" tabindex="0" class="close-btn">
            <X class="close"/>
        </span>
        <slot></slot>
    </div>
</div>
<style>
    .modal-container {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 999;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .modal {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 999;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
    }

    .modal-content {
        background-color: #fff;
        padding: 20px;
        border-radius: 5px;
        width: 50vw;
        height: 80vh;
        z-index: 1000;
        position: relative;
    }

    .close-btn {
        position: absolute;
        top: 10px;
        right: 15px;
        cursor: pointer;
    }
</style>