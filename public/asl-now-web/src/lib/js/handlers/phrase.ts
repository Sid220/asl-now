import type {Config} from "../../../stores/config";
import {Dic, LetterInfo} from "$lib/js/Dic";
import type {Handler} from "$lib/js/handlers/handler";
import type {VideoInfo} from "$lib/js/video";
import type {Programme} from "$lib/js/programmes";
import {programmes} from "$lib/programmes/default";

export class LetterHandler implements Handler {
    start = (info: VideoInfo, data: Programme, wsUrl: string, errorHandler: (one: string, two?: string) => void, $conf: Config, letterCorrectEvent: Event) => {
        const phrases = (data.data as LetterInfo[]);
        const canvasCtx = info.firstCanvasEle.getContext('2d')!;
        const socket = new WebSocket(wsUrl + "/phrase");
    }
}