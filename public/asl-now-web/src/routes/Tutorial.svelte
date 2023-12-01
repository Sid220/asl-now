<script lang="ts">
    import Tabs from "./Tabs.svelte";
    import {Box, Image, Square} from "lucide-svelte";
    import Img from "$lib/js/Img.svelte";
    import PageOne from "./tutorial_pages/PageOne.svelte";
    import PageTwo from "./tutorial_pages/PageTwo.svelte";

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
    <Tabs {items}/>
</div>
