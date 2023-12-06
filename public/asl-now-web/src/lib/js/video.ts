export class VideoSize {
    width: number;
    height: number;

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
    }

    area() {
        return this.width * this.height;
    }
}

export class VideoInfo {
    firstCanvasEle: HTMLCanvasElement;
    videoEle: HTMLVideoElement;
    size: VideoSize;

    constructor(firstCanvasEle: HTMLCanvasElement, videoEle: HTMLVideoElement, size: VideoSize) {
        this.firstCanvasEle = firstCanvasEle;
        this.videoEle = videoEle;
        this.size = size;
    }

}