import {Programme} from "$lib/js/programmes";
import {Dic} from "$lib/js/Dic";
import {LetterHandler} from "$lib/js/handlers/letter";
import {LetterHandlerVTwo} from "$lib/js/handlers/letter_vtwo";

export const programmes = [
    new Programme(new LetterHandlerVTwo(0), [
        // Intro
        Dic.O, Dic.K, Dic.Y, Dic.O, Dic.C, Dic.Y, Dic.D, Dic.E,
        // Alphabet with recalling previous signs
        Dic.A, Dic.B, Dic.C, Dic.A, Dic.D, Dic.E, Dic.F, Dic.G, Dic.E, Dic.H, Dic.I, Dic.J, Dic.F, Dic.K, Dic.L, Dic.G, Dic.M,
        Dic.N, Dic.H, Dic.O, Dic.L, Dic.P, Dic.M, Dic.Q, Dic.N,
        Dic.R, Dic.O, Dic.S, Dic.P, Dic.T, Dic.Q, Dic.R, Dic.U, Dic.S, Dic.V, Dic.T, Dic.V, Dic.W, Dic.X, Dic.Y, Dic.Z,
        Dic.Y,
        // Alphabet Backwards
        Dic.Z, Dic.X, Dic.W, Dic.V, Dic.U, Dic.T, Dic.S, Dic.R, Dic.Q, Dic.P, Dic.O, Dic.N, Dic.M, Dic.L, Dic.K, Dic.J, Dic.I, Dic.H, Dic.G, Dic.F, Dic.E, Dic.D, Dic.C, Dic.B, Dic.A,
        // Alphabet
        Dic.B, Dic.C, Dic.D, Dic.E, Dic.F, Dic.G, Dic.H, Dic.I, Dic.J, Dic.K, Dic.L, Dic.M, Dic.N, Dic.O, Dic.P, Dic.Q, Dic.R, Dic.S, Dic.T, Dic.U, Dic.V, Dic.W, Dic.X, Dic.Y, Dic.Z
    ]),
]