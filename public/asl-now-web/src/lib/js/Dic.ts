export class LetterInfo {
    modelPath: string;
    imgPath: string;
    letter: string;

    constructor(letter: string, modelPath: string, imgPath: string) {
        this.modelPath = modelPath;
        this.imgPath = imgPath;
        this.letter = letter;
    }
}

export const Dic = {
    A: new LetterInfo("A", "/models/A.obj", "/models/A.png"),
    B: new LetterInfo("B", "/models/B.obj", "/models/B.png"),
    C: new LetterInfo("C", "/models/C.obj", "/models/C.png"),
    D: new LetterInfo("D", "/models/D.ob", "/models/D.png"),
    E: new LetterInfo("E","/models/E.obj", "/models/E.png"),
    F: new LetterInfo("F","/models/F.obj", "/models/F.png"),
    G: new LetterInfo("G","/models/G.obj", "/models/G.png"),
    H: new LetterInfo("H", "/models/H.obj", "/models/H.png"),
    I: new LetterInfo("I", "/models/I.obj", "/models/I.png"),
    J: new LetterInfo("J", "/models/J.obj", "/models/J.png"),
    K: new LetterInfo("K", "/models/K.obj", "/models/K.png"),
    L: new LetterInfo("L", "/models/L.obj", "/models/L.png"),
    M: new LetterInfo("M", "/models/M.obj", "/models/M.png"),
    N: new LetterInfo("N", "/models/N.obj", "/models/N.png"),
    O: new LetterInfo("O", "/models/O.obj", "/models/O.png"),
    P: new LetterInfo("P", "/models/P.obj", "/models/P.png"),
    Q: new LetterInfo("Q", "/models/Q.obj", "/models/Q.png"),
    R: new LetterInfo("R", "/models/R.obj", "/models/R.png"),
    S: new LetterInfo("S", "/models/S.obj", "/models/S.png"),
    T: new LetterInfo("T", "/models/T.obj", "/models/T.png"),
    U: new LetterInfo("U", "/models/U.obj", "/models/U.png"),
    V: new LetterInfo("V", "/models/V.obj", "/models/V.png"),
    W: new LetterInfo("W", "/models/W.obj", "/models/W.png"),
    X: new LetterInfo("X", "/models/X.obj", "/models/X.png"),
    Y: new LetterInfo("Y", "/models/Y.obj", "/models/Y.png"),
    Z: new LetterInfo("Z", "/models/Z.obj", "/models/Z.png")
}
