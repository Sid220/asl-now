<script lang="ts">
    import welcome from '$lib/images/svelte-welcome.webp';
    import welcome_fallback from '$lib/images/svelte-welcome.png';
    import {onDestroy, onMount} from "svelte";
    import {Video} from 'lucide-svelte';
    import {Dic, LetterInfo} from "$lib/js/Dic";
    import ModalDic from "./ModalDic.svelte";
    import {conf, defaultConf} from "../stores/config";
    import Modal from "./Modal.svelte";
    import Tutorial from "./Tutorial.svelte";
    import ModalTutorial from "./ModalTutorial.svelte";
    import {ExternalLink} from "lucide-svelte";

    let correctAudio = new Audio("/audio/correct.mp3");
    let showAnimation = false;
    let checkVideo: HTMLVideoElement;
    let videoStartedEvent = new Event("videoStarted");

    const isVideoPlaying = (video: HTMLVideoElement) => !!(video.currentTime > 0 && !video.paused && !video.ended && video.readyState > 2);


    onDestroy(() => {
        navigator.mediaDevices.getUserMedia({
            video: true,
        }).then(function (stream) {
            stream.getTracks().forEach(function (track) {
                track.stop();
            });
        });
    });

    const videoWidth = 1280;
    const videoHeight = 720;

    const startApp = (() => {
        let canvasCtx = canvasElement.getContext('2d')!;

        const socket = new WebSocket('ws://localhost:8765');
        socket.addEventListener('error', function () {
            alert("Error connecting to server");
        });
        socket.addEventListener('open', function () {
            console.log("Connected to server")
        });
        socket.addEventListener('close', function () {
            console.warn("Disconnected from server")
        });

        videoElement.width = videoWidth;
        videoElement.height = videoHeight;

        if (!navigator.mediaDevices.getUserMedia) {
            alert("getUserMedia not supported");
            return;
        }

        navigator.mediaDevices
            .getUserMedia({
                video: true,
            })
            .then(function (stream) {
                videoElement.srcObject = stream;
            })
            .catch(function (error) {
                console.error(error);
            });
        const FPS = 2;
        let numberTimesCorrect = 0;

        function handleObjectDetectionResults(data: {
            predictions:
                {
                    confidence: number, class: string, x: number, y: number, width: number, height: number
                }[]
        }) {
            canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
            let predictions = data.predictions;
            if (!predictions.find((p) => p.class === letters[$conf.currentProgress].letter))
                numberTimesCorrect = 0;
            for (let prediction of predictions) {
                if (prediction.confidence > $conf.confidenceThreshold) {
                    if (prediction.class == letters[$conf.currentProgress].letter) {
                        numberTimesCorrect++;
                        if (numberTimesCorrect > $conf.requiredCorrectTimes) {
                            $conf.currentProgress++;
                            if ($conf.currentProgress >= letters.length) {
                                $conf.currentProgress = 0;
                            }

                            checkVideo.play().then(() => {
                                showAnimation = true;
                                correctAudio.play();
                            });
                            numberTimesCorrect = 0;
                        }
                    }
                    // prediction.x = (prediction.x / 640) * videoElement.width;
                    // prediction.y = (prediction.y / 640) * videoElement.height;
                    // prediction.width = (prediction.width / 640) * videoElement.width;
                    // prediction.height = (prediction.height / 640) * videoElement.height;
                    if ($conf.showBoxes) {
                        canvasCtx.beginPath();
                        canvasCtx.rect(prediction.x, prediction.y, prediction.width, prediction.height);
                        canvasCtx.lineWidth = 10;
                        canvasCtx.stroke();
                    }
                    if ($conf.showLabels) {
                        canvasCtx.font = "32px serif";
                        canvasCtx.fillText(prediction.class, prediction.x, prediction.y - 15);
                    }
                }
            }
        }

        function sendFrame() {
            if (isVideoPlaying(videoElement)) {
                canvasElementTwo.getContext('2d')!.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);
                let resultb64 = canvasElementTwo.toDataURL();

                socket.send(resultb64);
            } else {
                console.error("Video not playing");
            }
        }

        window.addEventListener("videoStarted", () => {
            console.info("Video started");
            sendFrame();
        });
        socket.addEventListener('message', function (event) {
            let json;
            try {
                json = JSON.parse(event.data);
            } catch (e) {
                console.error(e);
                return;
            }
            handleObjectDetectionResults(json);
            sendFrame();
        });
        // interval = setInterval(sendFrame, 1000 / FPS);
    });

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
    let canvasElementTwo: HTMLCanvasElement;

    function openLetter(letter: LetterInfo) {
        videoElement.pause();
        let modal = new ModalDic({
            target: document.body,
            props: {
                letter: letter,
            }
        });
        modal.$on("close", () => {
            startCamera();
        });
    }

    let letters = [Dic.O, Dic.K, Dic.Y, Dic.K, Dic.L]

    function startCamera() {
        videoElement.play().then(() => {
            window.dispatchEvent(videoStartedEvent);
        });
    }
</script>

<svelte:head>
    <title>Home</title>
    <meta name="description" content="Learn ASL Fingerspelling Online"/>
</svelte:head>

<section bind:this={welcome_container}>
    <span class="welcome">
        <picture>
            <source srcset={welcome} type="image/webp"/>
            <img src={welcome_fallback} alt="Welcome"/>
        </picture>
    </span>
    <progress max={letters.length} value={$conf.currentProgress}></progress>
    <button on:click={() => { hide_ele(welcome_container); show_ele(content_container); startApp(); startCamera(); }}>
        Start
    </button>
</section>
<!-- Real Content -->
<section bind:this={content_container} style="display: none">
    <h1>
       <span class="letter-btn" on:click={() => {openLetter(letters[$conf.currentProgress])}}
             on:keydown={() => {openLetter(letters[$conf.currentProgress])}}
             role="button" tabindex="0" style="visibility: {showAnimation ? 'hidden' : 'visible'}">
           {letters[$conf.currentProgress].letter}
       </span>
    </h1>
    <div class="container" style="position: relative">
        <div>
            <video class="input_video" bind:this={videoElement} style="width: 100%">
                <track kind="captions" src="">
            </video>
            <canvas class="output_canvas" style="position: absolute; left: 0; top: 0; width: 100%; height: 100%"
                    width="{videoWidth}px" height="{videoHeight}px"
                    bind:this={canvasElement}></canvas>
            <canvas class="output_canvas"
                    style="position: absolute; left: 0; top: 0; width: 100%; height: 100%; display: none"
                    width="{videoWidth}px" height="{videoHeight}px"
                    bind:this={canvasElementTwo}></canvas>
        </div>
    </div>
</section>
<div style="position: fixed; display: {showAnimation ? 'flex' : 'none'}; align-items: center; left: 0; bottom: 0; background: #d7ffb8; height: 20vh; width: 100%; z-index: 5">
    <video bind:this={checkVideo} style="height: 80%;">
        <source src="/check.webm" type="video/webm">
        <track kind="captions" src="">
    </video>
    <span style="color: #58a700; font-size: 3.5rem; margin-left: 15px">Correct!</span>
    <div style="width: 100%"></div>
    <button on:click={() => {openLetter(letters[$conf.currentProgress - 1]) }}
            style="margin: 10px; background: none; font-size: 1.5rem"><span style="font-size: 1rem; margin-right: 3px"><ExternalLink/></span>
        Review
    </button>
    <button on:click={() => {showAnimation = false}} style="margin: 15px">Continue</button>
</div>

{#if !$conf.showedTutorial}
    <ModalTutorial on:close={() => {$conf.showedTutorial = true}}/>
{/if}
<style>
    .letter-btn {
        cursor: pointer;
    }
</style>

