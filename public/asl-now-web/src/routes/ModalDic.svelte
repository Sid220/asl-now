<script lang="ts">
    import Dictionary from "./Dictionary.svelte";
    import type {LetterInfo} from "$lib/js/Dic.js";
    import Modal from "./Modal.svelte";
    import {createEventDispatcher} from 'svelte';

    const dispatch = createEventDispatcher();

    export let letter: LetterInfo;
</script>

<Modal on:close={() => {dispatch("close")}}>
    <Dictionary {letter}/>
</Modal>