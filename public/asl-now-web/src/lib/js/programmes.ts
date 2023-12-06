import type {LetterInfo} from "$lib/js/Dic";
import type {Handler} from "$lib/js/handlers/handler";

type DataLearningType = LetterInfo | LetterInfo[]


export class Programme {
    type: Handler;
    data: DataLearningType[];

    constructor(type: Handler, data: DataLearningType[]) {
        this.type = type;
        this.data = data;
    }
}