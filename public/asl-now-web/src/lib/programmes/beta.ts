import {Programme} from "$lib/js/programmes";
import {Dic} from "$lib/js/Dic";
import {LetterHandler} from "$lib/js/handlers/letter";
import {LetterHandlerVTwo} from "$lib/js/handlers/letter_vtwo";

export const programmes = [
    new Programme(new LetterHandlerVTwo(0), [Dic.O, Dic.K, Dic.Y, Dic.O, Dic.C, Dic.Y, Dic.D, Dic.E]),
    new Programme(new LetterHandlerVTwo(1), [Dic.A, Dic.B, Dic.C, Dic.D, Dic.E, Dic.F, Dic.G, Dic.H, Dic.I, Dic.J, Dic.K, Dic.L, Dic.M, Dic.N, Dic.O, Dic.P, Dic.Q, Dic.R, Dic.S, Dic.T, Dic.U, Dic.V, Dic.W, Dic.X, Dic.Y, Dic.Z]),
]