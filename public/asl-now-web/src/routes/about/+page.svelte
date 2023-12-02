<script lang="ts">
    import tfImg from "$lib/images/tech/tf.svg";
	import compImg from "$lib/images/tech/comp.png";
	import svelteImg from "$lib/images/svelte-logo.svg";
    import flaskImg from "$lib/images/tech/flask.png";
    import mpImg from "$lib/images/tech/mp.svg";
</script>

<svelte:head>
    <title>About</title>
    <meta name="description" content="About this app"/>
</svelte:head>

<div class="text-column">
    <h1>About ASLNow!</h1>

    <p>
        This is an app for learning <a href="https://en.wikipedia.org/wiki/American_Sign_Language#Fingerspelling" target="_blank">American Sign Language (ASL)</a>. It is a work in progress.
    </p>
    <h2>Technologies Used</h2>
    <a href="https://www.tensorflow.org/" target="_blank">
        <img src={tfImg} alt="Tensorflow" class="tech-img"/>
    </a>
	<a href="https://www.kaggle.com/competitions/asl-fingerspelling/overview" target="_blank">
		<img src={compImg} alt="Google - American Sign Language Fingerspelling Recognition" class="tech-img"/>
	</a>
	<a href="https://kit.svelte.dev/" target="_blank">
		<img src={svelteImg} alt="Svelte" class="tech-img"/>
	</a>
    <a href="https://flask.palletsprojects.com/" target="_blank">
        <img src={flaskImg} alt="Flask" class="tech-img"/>
    </a>
    <a href="https://developers.google.com/mediapipe" target="_blank">
        <img src={mpImg} alt="MediaPipe" class="tech-img"/>
    </a>
</div>
<style>
	.tech-img {
		height: 100px;
		margin: 10px;
	}
</style>