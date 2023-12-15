import {writable} from 'svelte/store'
import {programmes} from "$lib/programmes/default";
import {version} from '$app/environment';

export interface Config {
    version: string,
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
    requiredCorrectTimes: number,
    showDebug: boolean
}

export const defaultConf: Config = {
    version: version,
    showPose: true,
    showFace: true,
    showHands: true,
    showBoxes: true,
    showLabels: true,
    confidenceThreshold: 0.5,
    showedTutorial: false,
    currentProgress: Array.from(new Array(programmes.length), (val, index) => {
        return {
            progress: 0,
            max: programmes[index].data.length
        }
    }),
    requiredCorrectTimes: 3,
    showDebug: false
}


const fromStorage = JSON.parse(localStorage.getItem('config')!)
export const conf = writable<Config>(fromStorage || defaultConf)

conf.subscribe((value) => localStorage.setItem('config', JSON.stringify(value)))
