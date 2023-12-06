import {Programme} from "$lib/js/programmes";
import {Dic} from "$lib/js/Dic";
import {LetterHandler} from "$lib/js/handlers/letter";

export const programmes = [
    new Programme(new LetterHandler(0), [Dic.O
        // , Dic.K, Dic.Y
    ]),
    new Programme(new LetterHandler(1), [Dic.K, Dic.O])
]