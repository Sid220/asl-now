export class CustomWS {
    errorHandler: (one: string, two?: string) => void;
    ws: WebSocket;

    constructor(url: string, errorHandler: (one: string, two?: string) => void) {
        this.errorHandler = errorHandler;
        this.ws = new WebSocket(url);
    }

    addEventListener(type: string, listener: (ev: Event) => any) {
        this.ws.addEventListener(type, (event) => {
            if (type === "error")
                this.errorHandler("Error connecting to server", "WebSocket URL: " + this.ws.url + "\n" + "Number connection attempts: 1");
            listener(event);
        });
    }

    send(data: string | ArrayBufferLike | Blob | ArrayBufferView) {
        this.ws.send(data);
    }
}