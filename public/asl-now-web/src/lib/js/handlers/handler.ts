import type {VideoInfo} from "$lib/js/video";
import type {Programme} from "$lib/js/programmes";
import type {Config} from "../../../stores/config";
import type {CustomWS} from "$lib/js/CustomWS";

export interface Handler {
    socket?: CustomWS | null;
    noSocket?: boolean;

    start(info: VideoInfo, data: Programme, wsUrl: string, errorHandler: (one: string, two?: string) => void, $conf: Config, letterCorrectEvent: Event, detectedLetter?: ((letter: string | null) => void)): ((data: any) => void);

    sendFrame(base64: string): void;

    stop(): void;
}