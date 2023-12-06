<script lang="ts">
    import {createEventDispatcher} from 'svelte';
    import Tutorial from "./Tutorial.svelte";
    import Modal from "$lib/js/Modal.svelte";

    const dispatch = createEventDispatcher();

</script>

<Modal on:close={() => {dispatch("close")}}>
    <Tutorial/>
</Modal>
