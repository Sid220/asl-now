export class LetterInfo {
    modelPath: string;
    imgPath: string;
    letter: string;
    colour: string;

    constructor(letter: string, modelPath: string, imgPath: string, colour: string) {
        this.modelPath = modelPath;
        this.imgPath = imgPath;
        this.letter = letter;
        this.colour = colour;
    }
}

export const Dic = {
    A: new LetterInfo("A", "/models/A.obj", "/models/A.png", "#000000"),
    B: new LetterInfo("B", "/models/B.obj", "/models/B.png", "#f87171"),
    C: new LetterInfo("C", "/models/C.obj", "/models/C.png", "#f97316"),
    D: new LetterInfo("D", "/models/D.ob", "/models/D.png", "#d97706"),
    E: new LetterInfo("E", "/models/E.obj", "/models/E.png", "#ea580c"),
    F: new LetterInfo("F", "/models/F.obj", "/models/F.png", "#ca8a04"),
    G: new LetterInfo("G", "/models/G.obj", "/models/G.png", "#65a30d"),
    H: new LetterInfo("H", "/models/H.obj", "/models/H.png", "#16a34a"),
    I: new LetterInfo("I", "/models/I.obj", "/models/I.png", "#22c55e"),
    J: new LetterInfo("J", "/models/J.obj", "/models/J.png", "#14b8a6"),
    K: new LetterInfo("K", "/models/K.obj", "/models/K.png", "#0ea5e9"),
    L: new LetterInfo("L", "/models/L.obj", "/models/L.png", "#3b82f6"),
    M: new LetterInfo("M", "/models/M.obj", "/models/M.png", "#6366f1"),
    N: new LetterInfo("N", "/models/N.obj", "/models/N.png", "#8b5cf6"),
    O: new LetterInfo("O", "/models/O.obj", "/models/O.png", "#8b5cf6"),
    P: new LetterInfo("P", "/models/P.obj", "/models/P.png", "#c084fc"),
    Q: new LetterInfo("Q", "/models/Q.obj", "/models/Q.png", "#e879f9"),
    R: new LetterInfo("R", "/models/R.obj", "/models/R.png", "#f472b6"),
    S: new LetterInfo("S", "/models/S.obj", "/models/S.png", "#e11d48"),
    T: new LetterInfo("T", "/models/T.obj", "/models/T.png", "#84cc16"),
    U: new LetterInfo("U", "/models/U.obj", "/models/U.png", "#6b7280"),
    V: new LetterInfo("V", "/models/V.obj", "/models/V.png", "#a1a1aa"),
    W: new LetterInfo("W", "/models/W.obj", "/models/W.png", "#a3e635"),
    X: new LetterInfo("X", "/models/X.obj", "/models/X.png", "#10b981"),
    Y: new LetterInfo("Y", "/models/Y.obj", "/models/Y.png", "#22d3ee"),
    Z: new LetterInfo("Z", "/models/Z.obj", "/models/Z.png", "#0a0a0a")
}
