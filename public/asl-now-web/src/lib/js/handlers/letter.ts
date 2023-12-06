import type {Config} from "../../../stores/config";
import {Dic, LetterInfo} from "$lib/js/Dic";
import type {Handler} from "$lib/js/handlers/handler";
import type {VideoInfo} from "$lib/js/video";
import type {Programme} from "$lib/js/programmes";
import {CustomWS} from "$lib/js/CustomWS";

export class LetterHandler implements Handler {
    index: number;

    constructor(index: number) {
        this.index = index;
    }


    socket: CustomWS | null = null;

    start = (info: VideoInfo, data: Programme, wsUrl: string, errorHandler: (one: string, two?: string) => void, $conf: Config, letterCorrectEvent: Event) => {
        const letters = (data.data as LetterInfo[]);

        const canvasCtx = info.firstCanvasEle.getContext('2d')!;

        const socket = new CustomWS(wsUrl, errorHandler);
        this.socket = socket;
        socket.addEventListener('error', () => {
        });
        socket.addEventListener('close', function () {
            console.warn("Disconnected from server")
        });

        info.videoEle.width = info.size.width;
        info.videoEle.height = info.size.height;
        info.firstCanvasEle.width = info.size.width;
        info.firstCanvasEle.height = info.size.height;

        let numberTimesCorrect = 0;

        return (data: {
            predictions:
                {
                    confidence: number, class: string, x: number, y: number, width: number, height: number
                }[]
        }) => {
            canvasCtx.clearRect(0, 0, info.firstCanvasEle.width, info.firstCanvasEle.height);
            const predictions = data.predictions;
            if (!predictions.find((p) => p.class === letters[$conf.currentProgress[this.index].progress].letter))
                numberTimesCorrect = 0;
            for (const prediction of predictions) {
                if (prediction.confidence >= $conf.confidenceThreshold) {
                    if (prediction.class == letters[$conf.currentProgress[this.index].progress].letter) {
                        numberTimesCorrect++;
                        if (numberTimesCorrect > $conf.requiredCorrectTimes) {
                            window.dispatchEvent(letterCorrectEvent);
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
                        canvasCtx.strokeStyle = Dic[prediction.class as keyof typeof Dic].colour;
                        canvasCtx.lineWidth = 10;
                        canvasCtx.stroke();
                    }
                    if ($conf.showLabels) {
                        canvasCtx.font = "32px inter serif";
                        canvasCtx.fillStyle = Dic[prediction.class as keyof typeof Dic].colour;
                        canvasCtx.fillText(prediction.class, prediction.x, prediction.y - 15);
                    }
                }
            }
        }
    }

    sendFrame = (base64: string) => {
        if (!this.socket) {
            console.error("Socket not initialised");
            return;
        }
        this.socket.send(base64);
    }

    stop = () => {
        if (!this.socket) {
            console.error("Socket not initialised");
            return;
        }
        this.socket.ws.close();
    }
}
