import {writable} from 'svelte/store'
import {programmes} from "$lib/programmes/default";

export interface Config {
    showPose: boolean,
    showFace: boolean,
    showHands: boolean,
    showBoxes: boolean,
    showLabels: boolean,
    confidenceThreshold: number,
    showedTutorial: boolean,
    currentProgress: {
        progress: number,
        max: number
    }[],
    requiredCorrectTimes: number
}

export const defaultConf: Config = {
    showPose: true,
    showFace: true,
    showHands: true,
    showBoxes: true,
    showLabels: true,
    confidenceThreshold: 0.5,
    showedTutorial: false,
    currentProgress: [{
        progress: 0,
        max: programmes[0].data.length
    }, {
        progress: 0,
        max: programmes[1].data.length
    }],
    requiredCorrectTimes: 3
}

const fromStorage = JSON.parse(localStorage.getItem('config')!)
export const conf = writable<Config>(fromStorage || defaultConf)

conf.subscribe((value) => localStorage.setItem('config', JSON.stringify(value)))
