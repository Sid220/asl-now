import type {Handler} from "$lib/js/handlers/handler";
import type {VideoInfo} from "$lib/js/video";
import type {Programme} from "$lib/js/programmes";
import {
    HandLandmarker,
    FilesetResolver,
    type HandLandmarkerResult,
    type NormalizedLandmark,
    type DrawingOptions
} from "@mediapipe/tasks-vision";
import * as tf from '@tensorflow/tfjs';
import type {Config} from "../../../stores/config";
import type {LandmarkConnectionArray} from "@mediapipe/holistic";
import type {LetterInfo} from "$lib/js/Dic";
import Stats from "stats.js";

function convertToConnections(...connections: Array<[number, number]>):
    Connection[] {
    return connections.map(([start, end]) => ({start, end}));
}

const HAND_CONNECTIONS = convertToConnections(
    [0, 1], [1, 2], [2, 3], [3, 4], [0, 5], [5, 6], [6, 7], [7, 8], [5, 9],
    [9, 10], [10, 11], [11, 12], [9, 13], [13, 14], [14, 15], [15, 16],
    [13, 17], [0, 17], [17, 18], [18, 19], [19, 20]);

/** A connection between two landmarks. */
export declare interface Connection {
    start: number;
    end: number;
}

export type Callback<I, O> = (input: I) => O;

const DEFAULT_OPTIONS: DrawingOptions = {
    color: 'white',
    lineWidth: 4,
    radius: 6
};

/** Merges the user's options with the default options. */
function addDefaultOptions(style?: DrawingOptions): DrawingOptions {
    style = style || {};
    return {
        ...DEFAULT_OPTIONS,
        ...{fillColor: style.color},
        ...style,
    };
}

/**
 * Resolve the value from `value`. Invokes `value` with `data` if it is a
 * function.
 */
function resolve<O, I>(value: O | Callback<I, O>, data: I): O {
    return value instanceof Function ? value(data) : value;
}

function drawLandmarks(ctx: CanvasRenderingContext2D, landmarks?: NormalizedLandmark[], style?: DrawingOptions):
    void {
    if (!landmarks) {
        return;
    }
    const options = addDefaultOptions(style);
    ctx.save();
    const canvas = ctx.canvas;
    let index = 0;
    for (const landmark of landmarks) {
        // All of our points are normalized, so we need to scale the unit canvas
        // to match our actual canvas size.
        ctx.fillStyle = resolve(options.fillColor!, {index, from: landmark});
        ctx.strokeStyle = resolve(options.color!, {index, from: landmark});
        ctx.lineWidth = resolve(options.lineWidth!, {index, from: landmark});

        const circle = new Path2D();
        // Decrease the size of the arc to compensate for the scale()
        circle.arc(
            landmark.x * canvas.width, landmark.y * canvas.height,
            resolve(options.radius!, {index, from: landmark}), 0, 2 * Math.PI);
        ctx.fill(circle);
        ctx.stroke(circle);
        ++index;
    }
    ctx.restore();
}

function drawConnectors(ctx: CanvasRenderingContext2D,
                        landmarks?: NormalizedLandmark[], connections?: Connection[],
                        style?: DrawingOptions): void {
    if (!landmarks || !connections) {
        return;
    }
    const options = addDefaultOptions(style);
    ctx.save();
    const canvas = ctx.canvas;
    let index = 0;
    for (const connection of connections) {
        ctx.beginPath();
        const from = landmarks[connection.start];
        const to = landmarks[connection.end];
        if (from && to) {
            ctx.strokeStyle = resolve(options.color!, {index, from, to});
            ctx.lineWidth = resolve(options.lineWidth!, {index, from, to});
            ctx.moveTo(from.x * canvas.width, from.y * canvas.height);
            ctx.lineTo(to.x * canvas.width, to.y * canvas.height);
        }
        ++index;
        ctx.stroke();
    }
    ctx.restore();
}

const isVideoPlaying = (video: HTMLVideoElement) => (video.currentTime > 0 && !video.paused && !video.ended && video.readyState > 2);

export class LetterHandlerVTwo implements Handler {
    index: number;

    constructor(index: number) {
        this.index = index;
    }

    noSocket = true;

    start = (info: VideoInfo, data: Programme, wsUrl: string, errorHandler: (one: string, two?: string) => void, $conf: Config, letterCorrectEvent: Event, detectedLetter: ((letter: string | null) => void)) => {
        let handLandmarker: HandLandmarker | undefined = undefined;
        let aslModel: tf.LayersModel | undefined = undefined;
        const letters = (data.data as LetterInfo[]);
        let numberTimesCorrect = 0;
        const stats = new Stats();
        if ($conf.showDebug) document.body.appendChild(stats.dom);
        stats.showPanel(0);

        // Before we can use HandLandmarker class we must wait for it to finish
        // loading. Machine Learning models can be large and take a moment to
        // get everything needed to run.
        const createHandLandmarker = async () => {
            const vision = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm");
            handLandmarker = await HandLandmarker.createFromOptions(vision, {
                baseOptions: {
                    modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
                    delegate: "GPU"
                },
                runningMode: "VIDEO",
                numHands: 1
            });
        };
        createHandLandmarker().then(() => {
            console.log("HandLandmarker loaded!");
        });
        tf.loadLayersModel('tfjs-model/model.json').then((model) => {
            console.log("ASL model loaded!");
            aslModel = model;
        });

        const canvasCtx = info.firstCanvasEle.getContext("2d")!;

        let lastVideoTime = -1;
        let results: HandLandmarkerResult | undefined = undefined;

        function landMarksToTensor(landmarks: NormalizedLandmark[]) {
            const data = [];
            for (const landmark of landmarks) {
                data.push([landmark.x, landmark.y, landmark.z]);
            }
            return tf.tensor([data]);
        }

        let FPS = 1;

        const predict = async () => {
            stats.begin();

            if (!isVideoPlaying(info.videoEle)) {
                setTimeout(predict, 1000);
                return;
            }

            if (!aslModel) {
                console.log("Wait! ASL model not loaded yet.");
                setTimeout(predict, 1000);
                return;
            }
            if (!handLandmarker) {
                console.log("Wait! objectDetector not loaded yet.");
                setTimeout(predict, 1000);
                return;
            }

            info.firstCanvasEle.style.width = String(info.videoEle.videoWidth);
            info.firstCanvasEle.style.height = String(info.videoEle.videoHeight);
            info.firstCanvasEle.width = (info.videoEle.videoWidth);
            info.firstCanvasEle.height = (info.videoEle.videoHeight);
            // Now let's start detecting the stream.
            const startTimeMs = performance.now();
            if (lastVideoTime !== info.videoEle.currentTime) {
                lastVideoTime = info.videoEle.currentTime;
                results = handLandmarker.detectForVideo(info.videoEle, startTimeMs);
            }
            canvasCtx.save();
            canvasCtx.clearRect(0, 0, info.firstCanvasEle.width, info.firstCanvasEle.height);

            if (results) {
                if (results.landmarks.length > 0) {
                    if ($conf.showHands) {
                        for (const landmarks of results.landmarks) {
                            drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, {
                                color: "#00FF00",
                                lineWidth: 5
                            });
                            drawLandmarks(canvasCtx, landmarks, {color: "#FF0000", lineWidth: 2});
                        }
                    }
                    const tensor = landMarksToTensor(results.landmarks[0]);
                    const prediction = aslModel.predict(tensor);
                    // @ts-expect-error TODO: argMax isn't in the types for some reason
                    const pred_index = await prediction.argMax(1).array();
                    // @ts-expect-error TODO: max isn't in the types for some reason
                    const pred_value = await prediction.max(1).array();
                    const pred_value_letter = String.fromCharCode(65 + pred_index[0]);
                    const pred_value_str = (pred_value_letter + " " + Math.round(pred_value[0]) + "%");

                    detectedLetter(pred_value_str)
                    if (pred_value_letter === letters[$conf.currentProgress[this.index].progress].letter) {
                        numberTimesCorrect++;
                        if (numberTimesCorrect > ((FPS / 2) * $conf.requiredCorrectTimes)) {
                            window.dispatchEvent(letterCorrectEvent);
                            numberTimesCorrect = 0;
                        }
                    }
                } else {
                    detectedLetter(null)
                }
                canvasCtx.restore();
            }

            stats.end();
            FPS = 1000 / (performance.now() - startTimeMs);

            // Call this function again to keep predicting when the browser is ready.
            window.requestAnimationFrame(predict);

        }

        return predict;
    };

    sendFrame(base64: string): void {
    }

    stop(): void {
    }

}