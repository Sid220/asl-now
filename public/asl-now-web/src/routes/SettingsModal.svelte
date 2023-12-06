<script lang="ts">
    import Modal from "$lib/js/Modal.svelte";
    import {createEventDispatcher} from 'svelte';
    import SettingsPage from "$lib/js/SettingsPage.svelte";

    const dispatch = createEventDispatcher();

</script>

<Modal on:close={() => {dispatch("close")}}>
    <SettingsPage/>
</Modal>
