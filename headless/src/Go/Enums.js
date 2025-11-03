"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoPlayType = exports.GoValidity = exports.GoColor = exports.GoOpponent = void 0;
var GoOpponent;
(function (GoOpponent) {
    GoOpponent["none"] = "No AI";
    GoOpponent["Netburners"] = "Netburners";
    GoOpponent["SlumSnakes"] = "Slum Snakes";
    GoOpponent["TheBlackHand"] = "The Black Hand";
    GoOpponent["Tetrads"] = "Tetrads";
    GoOpponent["Daedalus"] = "Daedalus";
    GoOpponent["Illuminati"] = "Illuminati";
    GoOpponent["w0r1d_d43m0n"] = "????????????";
})(GoOpponent || (exports.GoOpponent = GoOpponent = {}));
var GoColor;
(function (GoColor) {
    GoColor["white"] = "White";
    GoColor["black"] = "Black";
    GoColor["empty"] = "Empty";
})(GoColor || (exports.GoColor = GoColor = {}));
var GoValidity;
(function (GoValidity) {
    GoValidity["pointBroken"] = "That node is offline; a piece cannot be placed there";
    GoValidity["pointNotEmpty"] = "That node is already occupied by a piece";
    GoValidity["boardRepeated"] = "It is illegal to repeat prior board states";
    GoValidity["noSuicide"] = "It is illegal to cause your own pieces to be captured";
    GoValidity["notYourTurn"] = "It is not your turn to play";
    GoValidity["gameOver"] = "The game is over";
    GoValidity["invalid"] = "Invalid move";
    GoValidity["valid"] = "Valid move";
})(GoValidity || (exports.GoValidity = GoValidity = {}));
var GoPlayType;
(function (GoPlayType) {
    GoPlayType["move"] = "move";
    GoPlayType["pass"] = "pass";
    GoPlayType["gameOver"] = "gameOver";
})(GoPlayType || (exports.GoPlayType = GoPlayType = {}));
