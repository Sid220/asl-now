<script lang="ts">
    import tutorialVideo from "$lib/videos/tutorial/one.webm"
</script>
<div>
    <p>To learn a letter click on it</p>
    <video style="width: 100%; max-height: 55vh;" autoplay loop muted>
        <source src={tutorialVideo}>
        <track kind="captions" src="">
    </video>
</div>