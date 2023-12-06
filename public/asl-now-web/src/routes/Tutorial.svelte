<script lang="ts">
    import Tabs from "$lib/js/Tabs.svelte";
    import {Square} from "lucide-svelte";
    import PageOne from "$lib/js/tutorial_pages/PageOne.svelte";
    import PageTwo from "$lib/js/tutorial_pages/PageTwo.svelte";

    let items = [
        {
            label: Square,
            value: 1,
            component: PageOne
        },
        {
            label: Square,
            value: 2,
            component: PageTwo
        }
    ];
</script>
<h1>Tutorial</h1>
<div style="width: 100%">
    <Tabs {items} showArrows={true}/>
</div>
