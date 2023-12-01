<script lang="ts">
    import Modal from "./Modal.svelte";
    import {createEventDispatcher} from 'svelte';
    import SettingsPage from "./SettingsPage.svelte";

    const dispatch = createEventDispatcher();

</script>

<Modal on:close={() => {dispatch("close")}}>
    <SettingsPage/>
</Modal>
