<script>
    import {conf} from "../stores/config";
</script>
<h1>Bounding Boxes</h1>
<label>
    <input bind:checked={$conf.showBoxes} type="checkbox" class="form-control">
    Show boxes
</label><br>
<label>
    <input bind:checked={$conf.showLabels} type="checkbox" class="form-control">
    Show labels
</label><br>
<label>
    Confidence threshold
    <input bind:value={$conf.confidenceThreshold} type="number" min="0" max="1" placeholder="0.5">
</label><br>
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
</label>