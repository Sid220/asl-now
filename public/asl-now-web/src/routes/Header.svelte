<script lang="ts">
    import {page} from '$app/stores';
    import logo from '$lib/images/logo.png';
    import github from '$lib/images/github.svg';
    import {Settings, GraduationCap} from "lucide-svelte";
    import Modal from "./Modal.svelte";
    import {onMount} from "svelte";
    import ModalTutorial from "./ModalTutorial.svelte";

    let settingsModal: HTMLElement;
    let tutorialModal: HTMLElement;

    let openSettings = (): never | void => {
        throw new Error('openSettings is not defined')
    }
    let openTutorial = (): never | void => {
        throw new Error('openTutorial is not defined')
    }

    onMount(async () => {
        const ModalSettings = (await import('./ModalSettings.svelte')).default;

        openSettings = () => {
            const modal = new ModalSettings({
                target: settingsModal!,
            });
        }

        openTutorial = () => {
            const modal = new ModalTutorial({
                target: tutorialModal!,
            });
        }
    });
</script>

<header>
    <div class="corner">
        <a href="/">
            <img src={logo} alt="Logo"/>
        </a>
    </div>

    <nav>
        <svg viewBox="0 0 2 3" aria-hidden="true">
            <path d="M0,0 L1,2 C1.5,3 1.5,3 2,3 L2,0 Z"/>
        </svg>
        <ul>
            <li aria-current={$page.url.pathname === '/' ? 'page' : undefined}>
                <a href="/">Home</a>
            </li>
            <li aria-current={$page.url.pathname === '/about' ? 'page' : undefined}>
                <a href="/about">About</a>
            </li>
            <li aria-current="false">
                <span on:click={openTutorial} on:keypress={openTutorial} role="button" tabindex="0">
                   <GraduationCap/>
                </span>
            </li>
            <li aria-current="false">
                <span on:click={openSettings} on:keypress={openSettings} role="button" tabindex="0">
                    <Settings/>
                </span>
            </li>
        </ul>
        <svg viewBox="0 0 2 3" aria-hidden="true">
            <path d="M0,0 L0,3 C0.5,3 0.5,3 1,2 L2,0 Z"/>
        </svg>
    </nav>

    <div class="corner">
        <a href="https://github.com/sveltejs/kit">
            <img src={github} alt="GitHub"/>
        </a>
    </div>
</header>
<div bind:this={settingsModal}></div>
<div bind:this={tutorialModal}></div>
