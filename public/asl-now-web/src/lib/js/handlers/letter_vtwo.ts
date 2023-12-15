import type {Handler} from "$lib/js/handlers/handler";
import type {VideoInfo} from "$lib/js/video";
import type {Programme} from "$lib/js/programmes";
import {
    HandLandmarker,
    FilesetResolver,
    type HandLandmarkerResult,
    type NormalizedLandmark
} from "@mediapipe/tasks-vision";
import * as tf from '@tensorflow/tfjs';
import type {Config} from "../../../stores/config";
import {drawConnectors, drawLandmarks} from "@mediapipe/drawing_utils";
import {HAND_CONNECTIONS} from "@mediapipe/holistic";
import "@tensorflow/tfjs-core/dist/public/chained_ops/arg_max";
import type {LetterInfo} from "$lib/js/Dic";
import Stats from "stats.js"

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
                    for (const landmarks of results.landmarks) {
                        drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, {
                            color: "#00FF00",
                            lineWidth: 5
                        });
                        drawLandmarks(canvasCtx, landmarks, {color: "#FF0000", lineWidth: 2});
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
                    // TODO: CHANGE TO INDEX
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