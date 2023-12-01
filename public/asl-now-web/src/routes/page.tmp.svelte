<script lang="ts">
    import welcome from '$lib/images/svelte-welcome.webp';
    import welcome_fallback from '$lib/images/svelte-welcome.png';
    import {FACEMESH_TESSELATION, HAND_CONNECTIONS, POSE_CONNECTIONS} from "@mediapipe/holistic";
    import {drawLandmarks} from "@mediapipe/drawing_utils";
    import {Camera} from "@mediapipe/camera_utils";
    import {Holistic} from "@mediapipe/holistic";
    import {drawConnectors} from "@mediapipe/drawing_utils";
    import {onMount, onDestroy} from "svelte";
    import {Video} from 'lucide-svelte';
    import {Dic, LetterInfo} from "$lib/js/Dic";
    import Modal from "./Modal.svelte";
    import Dictionary from "./Dictionary.svelte";
    import ModalDic from "./ModalDic.svelte";
    import {defaultConf, conf} from "../stores/config";

    let holisticConfig = defaultConf;
    conf.subscribe((value) => {
        holisticConfig = value;
    });

    let camera: Camera;

    onMount(() => {
        let canvasCtx = canvasElement.getContext('2d')!;

        const socket = new WebSocket('ws://localhost:8000');
        socket.addEventListener('open', function (event) {
            console.log("Connected to server")
        });
        socket.addEventListener('message', function (event) {
            console.log(event.data);
        });


        let i = 1;

        let landmarks: any[] = [];
        function onResults(results: any) {
            canvasCtx.save();
            canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

            landmarks.push(results);
            if (i++ % 20 == 0) {
                console.log("Sending")
                socket.send(JSON.stringify(landmarks));
                landmarks = [];
            }


            canvasCtx.globalCompositeOperation = 'source-over';
            if (holisticConfig.showPose) {
                drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS,
                    {color: '#00FF00', lineWidth: 4});
                drawLandmarks(canvasCtx, results.poseLandmarks,
                    {color: '#FF0000', lineWidth: 2});
            }
            if (holisticConfig.showFace) {
                drawConnectors(canvasCtx, results.faceLandmarks, FACEMESH_TESSELATION,
                    {color: '#C0C0C070', lineWidth: 1});
            }
            if (holisticConfig.showHands) {
                drawConnectors(canvasCtx, results.leftHandLandmarks, HAND_CONNECTIONS,
                    {color: '#CC0000', lineWidth: 5});
                drawLandmarks(canvasCtx, results.leftHandLandmarks,
                    {color: '#00FF00', lineWidth: 2});
                drawConnectors(canvasCtx, results.rightHandLandmarks, HAND_CONNECTIONS,
                    {color: '#00CC00', lineWidth: 5});
                drawLandmarks(canvasCtx, results.rightHandLandmarks,
                    {color: '#FF0000', lineWidth: 2});
            }
            canvasCtx.restore();
        }

        const holistic = new Holistic({
            locateFile: (file) => {
                return `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`;
            }
        });
        holistic.setOptions({
            modelComplexity: 1,
            smoothLandmarks: true,
            enableSegmentation: true,
            smoothSegmentation: true,
            refineFaceLandmarks: true,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5
        });
        holistic.onResults(onResults);

        camera = new Camera(videoElement, {
            onFrame: async () => {
                await holistic.send({image: videoElement});
            },
            width: 1280,
            height: 720
        });
    });
    onDestroy(() => {
        if (typeof camera !== "undefined") {
            camera.stop();
        }
    })

    function hide_ele(ele: HTMLElement) {
        ele.style.display = "none";
    }

    function show_ele(ele: HTMLElement) {
        ele.style.display = "block";
    }


    let welcome_container: HTMLElement;
    let content_container: HTMLElement;


    let videoElement: HTMLVideoElement;
    let canvasElement: HTMLCanvasElement;

    function openLetter(letter: LetterInfo) {
        if (typeof camera !== "undefined") {
            camera.stop();
        }
        let modal = new ModalDic({
            target: document.body,
            props: {
                letter: letter,
            }
        });
        modal.$on("close", () => {
            if (typeof camera !== "undefined") {
                camera.start();
            }
        });
    }

    let letters = [Dic.N, Dic.O]
</script>

<svelte:head>
    <title>Home</title>
    <meta name="description" content="Svelte demo app"/>
</svelte:head>

<section bind:this={welcome_container}>
    <h1>
		<span class="welcome">
			<picture>
				<source srcset={welcome} type="image/webp"/>
				<img src={welcome_fallback} alt="Welcome"/>
			</picture>
		</span>

    </h1>
    <button on:click={() => { hide_ele(welcome_container); show_ele(content_container); if(typeof camera !== "undefined") {
            camera.start();
        } }}>Start
    </button>
</section>
<!-- Real Content -->
<section bind:this={content_container} style="display: none">
    <h1>
        {#each letters as letter}
            <span class="letter-btn" on:click={() => {openLetter(letter)}} on:keydown={() => {openLetter(letter)}}
                  role="button" tabindex="0">{letter.letter}</span>
        {/each}
        <!--        <span class="letter-btn" on:click={() => {openLetter(Dic.N)}}>N</span> <span class="letter-btn">O</span>-->
        <Video style="display: inline-block; height: 1em; width: 1em;"/>
    </h1>
    <div class="container" style="position: relative">
        <div style="position: absolute">
            <video class="input_video" bind:this={videoElement} style="width: 100%"></video>
            <canvas class="output_canvas" style="position: absolute; left: 0; top: 0; width: 100%; height: 100%"
                    width="1280px" height="720px"
                    bind:this={canvasElement}></canvas>
        </div>
    </div>
</section>

