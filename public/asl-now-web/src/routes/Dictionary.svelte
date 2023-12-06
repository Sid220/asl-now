<script lang="ts">
    import type {LetterInfo} from "$lib/js/Dic";
    import {Box, Image} from 'lucide-svelte';

    export let letter: LetterInfo;
    import Model from '$lib/js/Model.svelte';
    import Tabs from "$lib/js/Tabs.svelte";
    import Img from "$lib/js/Img.svelte";

    let items = [
        {
            label: Box,
            value: 1,
            component: Model,
            props: {
                model: letter.modelPath
            }
        },
        {
            label: Image,
            value: 2,
            component: Img,
            props: {
                src: letter.imgPath,
                alt: letter.letter,
                classes: "sign-img"
            }
        }
    ];
</script>
<h1>{letter.letter}</h1>
<Tabs {items}/>