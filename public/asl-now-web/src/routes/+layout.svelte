<script lang="ts">
	import Header from './Header.svelte';
	import '$lib/style/main.css';
</script>

<div class="app">
	<Header />

	<main>
		<slot />
	</main>

	<footer>
		<p>Copyright © 2024  <a href="https://about.sidtrz.com/">Sidney Trzepacz</a>, Some Rights Reserved. <a href="https://opensource.org/license/mit/">MIT License</a>.</p>
	</footer>
</div>
