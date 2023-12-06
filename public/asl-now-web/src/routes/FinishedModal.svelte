<script lang="ts">
    import Modal from "$lib/js/Modal.svelte";
    import {conf, defaultConf} from "../stores/config";
    import logo from '$lib/images/logo.svg';

    let modal: Modal;
</script>

<Modal bind:this={modal}>
    <div>
        <div style="display: flex; justify-content: center;">
            <img src={logo} alt="ASLNow Logo" class="logo" style="max-width: 100%;"/>
        </div>
        <h1>Thanks for learning with ASLNow!</h1>
        <form method="get" action="certificate" target="_blank">
            <div style="width: 100%; display: flex; justify-content: center;">
                <input type="text" required name="name" placeholder="Name">
                <button type="submit" formtarget="_blank">Get Certificate!</button>
            </div>
        </form>
        <p>You've finished all our content for now, but watch out for more! Here are some other great resources for
            learning ASL</p>
        <ul style="list-style: inside; display: inline;">
            <li><a href="https://www.youtube.com/watch?v=0FcwzMq4iWg" target="_blank">25 Basic Signs</a></li>
            <li><a href="https://www.lifeprint.com/asl101/pages-layout/concepts.htm" target="_blank">Lifeprint 100 Basic
                Signs</a></li>
            <li><a href="https://www.handspeak.com/" target="_blank">Handspeak</a></li>
        </ul>
        <br/>

        <span class="link" tabindex="0" role="button" on:click={() => {
    $conf.currentProgress = defaultConf.currentProgress; window.location.href = "/";
}} on:keydown={() => {
    $conf.currentProgress = defaultConf.currentProgress; window.location.href = "/";
}}>
    Restart
</span>
    </div>
</Modal>