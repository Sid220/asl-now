import {writable} from 'svelte/store'

export interface Config {
    showPose: boolean,
    showFace: boolean,
    showHands: boolean,
    showBoxes: boolean,
    showLabels: boolean,
    confidenceThreshold: number,
    showedTutorial: boolean,
    currentProgress: number,
    requiredCorrectTimes: number
}

export const defaultConf = {
    showPose: true,
    showFace: true,
    showHands: true,
    showBoxes: true,
    showLabels: true,
    confidenceThreshold: 0.5,
    showedTutorial: false,
    currentProgress: 0,
    requiredCorrectTimes: 3
}

const fromStorage = JSON.parse(localStorage.getItem('config')!)
export const conf = writable<Config>(fromStorage || defaultConf)

conf.subscribe((value) => localStorage.setItem('config', JSON.stringify(value)))
