<script lang="ts">
	import Header from './Header.svelte';
	import '$lib/style/main.css';

	import {version} from '$app/environment';
	import {conf, defaultConf} from "../stores/config";

	console.info(`App version: ${version}`);

	// Check if major version is the same
	if ($conf.version.split('.')[0] !== version.split('.')[0]) {
		console.warn(`Major version mismatch: ${$conf.version} != ${version}`);
		$conf = defaultConf;
	}
</script>

<div class="app">
	<Header />

	<main>
		<slot />
	</main>

	<footer>
		<p>Copyright © 2023  <a href="https://github.com/sid220">Sidney Trzepacz</a>, Some Rights Reserved. <a href="https://opensource.org/license/mit/">MIT License</a>.</p>
	</footer>
</div>