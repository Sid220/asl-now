<script lang="ts">
    import logo from '$lib/images/logo.svg';
    import checkVideo from "$lib/videos/check.webm"
    import checkAudio from "$lib/audio/correct.mp3"
    import {onDestroy} from "svelte";
    import type {LetterInfo} from "$lib/js/Dic";
    import ModalDic from "./DictionaryModal.svelte";
    import {conf} from "../stores/config";
    import ModalTutorial from "./ModalTutorial.svelte";
    import {ExternalLink} from "lucide-svelte";
    import ErrorModal from "./ErrorModal.svelte";
    import {PUBLIC_WEBSOCKET_URL} from "$env/static/public";
    import ProgressBar from "$lib/js/ProgressBar.svelte";
    import {programmes} from "$lib/programmes/default";
    import {VideoInfo, VideoSize} from "$lib/js/video";
    import FinishedModal from "./FinishedModal.svelte";

    let correctAudio = new Audio(checkAudio);
    let showAnimation = false;
    let checkVideoEle: HTMLVideoElement;
    let videoStartedEvent = new Event("videoStarted");
    const webSocketURL = PUBLIC_WEBSOCKET_URL;
    let letterCorrectEvent = new Event('letterCorrect');
    let currentProgrammeIndex = $conf.currentProgress.findIndex((value) => value.progress <= value.max);
    console.log(currentProgrammeIndex);
    let currentProgramme = programmes[currentProgrammeIndex];

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

    function alertError(message: string, moreInfo?: string) {
        new ErrorModal({
            target: document.body,
            props: {
                message: message,
                moreInfo: moreInfo
            }
        });
    }

    function finish() {
        new FinishedModal({
            target: document.body
        });
    }

    function hide_ele(ele: HTMLElement) {
        ele.style.display = "none";
    }

    function show_ele(ele: HTMLElement) {
        ele.style.display = "block";
    }

    function sendFrame() {
        if (isVideoPlaying(videoElement)) {
            canvasElementTwo.getContext('2d')!.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);
            let resultb64 = canvasElementTwo.toDataURL();

            currentProgramme.type.sendFrame(resultb64);
        } else {
            console.error("Video not playing");
            setTimeout(sendFrame, 1000);
        }
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

    let letters = (programmes[currentProgrammeIndex].data as LetterInfo[]);
    let phrases = (programmes[1].data as LetterInfo[][]);

    function startCamera() {
        videoElement.play().then(() => {
            window.dispatchEvent(videoStartedEvent);
        });
    }

    const startAppSafe = () => {
        try {
            let videoInfo = new VideoInfo(canvasElement, videoElement, new VideoSize(videoWidth, videoHeight));
            let dataHandler = currentProgramme.type.start(videoInfo, currentProgramme, webSocketURL, alertError, $conf, letterCorrectEvent);
            currentProgramme.type.socket!.addEventListener('message', (event: any) => {
                let json;
                try {
                    json = JSON.parse(event.data);
                } catch (e) {
                    console.error(e);
                    return;
                }
                dataHandler(json);
                sendFrame();
            });
            currentProgramme.type.socket!.addEventListener('open', () => {
                console.log("Socket opened");
                sendFrame();
            });
        } catch (e: any) {
            console.error(e);
            alertError("Unknown Error", e.message + "\n" + e.stack);
        }
    }

    window.addEventListener("letterCorrect", () => {
        if ($conf.currentProgress[currentProgrammeIndex].progress < $conf.currentProgress[currentProgrammeIndex].max) {
            $conf.currentProgress[currentProgrammeIndex].progress++;
        } else {
            currentProgramme.type.stop();
            currentProgrammeIndex++;
            currentProgramme = programmes[currentProgrammeIndex];
            $conf.currentProgress[currentProgrammeIndex].progress = 0;
            letters = (programmes[currentProgrammeIndex].data as LetterInfo[]);
            startAppSafe();
        }

        checkVideoEle.play().then(() => {
            showAnimation = true;
            correctAudio.play();
        });
    });

    $: {
        if (typeof letters[$conf.currentProgress[currentProgrammeIndex].progress] === "undefined") {
            finish();
        }
    }
</script>

<svelte:head>
    <title>Home</title>
    <meta name="description" content="Learn ASL Fingerspelling Online"/>
</svelte:head>

<section bind:this={welcome_container}>
    <span class="welcome">
        <img src={logo} alt="ASLNow! Logo"/>
    </span>
    <button on:click={() => { hide_ele(welcome_container); show_ele(content_container); startAppSafe(); startCamera(); }}>
        Start
    </button>
</section>
<!-- Real Content -->
<section bind:this={content_container} style="display: none">
    <h1>
       <span class="letter-btn"
             on:click={() => {openLetter(letters[$conf.currentProgress[currentProgrammeIndex].progress])}}
             on:keydown={() => {openLetter(letters[$conf.currentProgress[currentProgrammeIndex].progress])}}
             role="button" tabindex="0" style="visibility: {showAnimation ? 'hidden' : 'visible'}">
           {letters[$conf.currentProgress[currentProgrammeIndex].progress].letter}
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
<section>
    <ProgressBar sections={$conf.currentProgress}/>
</section>
<div style="position: fixed; display: {showAnimation ? 'flex' : 'none'}; align-items: center; left: 0; bottom: 0; background: #d7ffb8; height: 20vh; width: 100%; z-index: 5">
    <video bind:this={checkVideoEle} style="height: 80%;">
        <source src={checkVideo} type="video/webm">
        <track kind="captions" src="">
    </video>
    <span style="color: #58a700; font-size: 3.5rem; margin-left: 15px">Correct!</span>
    <div style="width: 100%"></div>
    <button on:click={() => {openLetter(letters[$conf.currentProgress[currentProgrammeIndex].progress - 1]) }}
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

