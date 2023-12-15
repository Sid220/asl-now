<script lang="ts">
    import {conf, defaultConf} from "../../stores/config";
    import ProgressBar from "$lib/js/ProgressBar.svelte";
    import {version} from '$app/environment';
</script>
<h1>Body detection</h1>
<label>
    <input bind:checked={$conf.showHands} type="checkbox" class="form-control">
    Show hands
</label><br>
<label>
    <input bind:checked={$conf.showFace} type="checkbox" class="form-control">
    Show face
</label><br>
<label>
    <input bind:checked={$conf.showPose} type="checkbox" class="form-control">
    Show pose
</label><br>
<h1>Bounding Boxes</h1>
<label>
    <input bind:checked={$conf.showBoxes} type="checkbox" class="form-control">
    Show boxes
</label><br>
<label>
    <input bind:checked={$conf.showLabels} type="checkbox" class="form-control show-labels-checkbox">
    Show labels
</label><br>
<label>
    Confidence threshold
    <input bind:value={$conf.confidenceThreshold} type="number" min="0" max="1" placeholder="0.5">
</label><br>
<h1>Progress</h1>
<ProgressBar sections={$conf.currentProgress}/>
<span class="link" tabindex="0" role="button" on:click={() => {
    $conf.currentProgress = defaultConf.currentProgress; window.location.href = "/";
}} on:keydown={() => {
    $conf.currentProgress = defaultConf.currentProgress; window.location.href = "/";
}}>
    Restart
</span><br>
<h1>Developer</h1>
<label>
    <input bind:checked={$conf.showDebug} type="checkbox" class="form-control" on:change={() => {window.location.href = "/";}}>
    Show debug
</label><br>
<pre>ASLNow! v{version}</pre>