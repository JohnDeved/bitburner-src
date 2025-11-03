"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodingContractTypes = exports.CodingContractDefinitions = void 0;
exports.removeBracketsFromArrayString = removeBracketsFromArrayString;
exports.removeQuotesFromString = removeQuotesFromString;
exports.convert2DArrayToString = convert2DArrayToString;
const AlgorithmicStockTrader_1 = require("./contracts/AlgorithmicStockTrader");
const ArrayJumpingGame_1 = require("./contracts/ArrayJumpingGame");
const Compression_1 = require("./contracts/Compression");
const Encryption_1 = require("./contracts/Encryption");
const FindAllValidMathExpressions_1 = require("./contracts/FindAllValidMathExpressions");
const FindLargestPrimeFactor_1 = require("./contracts/FindLargestPrimeFactor");
const GenerateIPAddresses_1 = require("./contracts/GenerateIPAddresses");
const HammingCode_1 = require("./contracts/HammingCode");
const MergeOverlappingIntervals_1 = require("./contracts/MergeOverlappingIntervals");
const MinimumPathSumInATriangle_1 = require("./contracts/MinimumPathSumInATriangle");
const Proper2ColoringOfAGraph_1 = require("./contracts/Proper2ColoringOfAGraph");
const SanitizeParenthesesInExpression_1 = require("./contracts/SanitizeParenthesesInExpression");
const ShortestPathInAGrid_1 = require("./contracts/ShortestPathInAGrid");
const SpiralizeMatrix_1 = require("./contracts/SpiralizeMatrix");
const SquareRoot_1 = require("./contracts/SquareRoot");
const SubarrayWithMaximumSum_1 = require("./contracts/SubarrayWithMaximumSum");
const TotalPrimesInRange_1 = require("./contracts/TotalPrimesInRange");
const TotalWaysToSum_1 = require("./contracts/TotalWaysToSum");
const UniquePathsInAGrid_1 = require("./contracts/UniquePathsInAGrid");
/* Helper functions for Coding Contract implementations */
function removeBracketsFromArrayString(str) {
    let strCpy = str;
    if (strCpy.startsWith("[")) {
        strCpy = strCpy.slice(1);
    }
    if (strCpy.endsWith("]")) {
        strCpy = strCpy.slice(0, -1);
    }
    return strCpy;
}
function removeQuotesFromString(str) {
    let strCpy = str;
    if (strCpy.startsWith('"') || strCpy.startsWith("'")) {
        strCpy = strCpy.slice(1);
    }
    if (strCpy.endsWith('"') || strCpy.endsWith("'")) {
        strCpy = strCpy.slice(0, -1);
    }
    return strCpy;
}
function convert2DArrayToString(arr) {
    const components = [];
    for (const e of arr) {
        let s = String(e);
        s = ["[", s, "]"].join("");
        components.push(s);
    }
    return components.join(",").replace(/\s/g, "");
}
exports.CodingContractDefinitions = {
    ...AlgorithmicStockTrader_1.algorithmicStockTrader,
    ...ArrayJumpingGame_1.arrayJumpingGame,
    ...Compression_1.compression,
    ...Encryption_1.encryption,
    ...FindAllValidMathExpressions_1.findAllValidMathExpressions,
    ...FindLargestPrimeFactor_1.findLargestPrimeFactor,
    ...GenerateIPAddresses_1.generateIPAddresses,
    ...HammingCode_1.hammingCode,
    ...MergeOverlappingIntervals_1.mergeOverlappingIntervals,
    ...MinimumPathSumInATriangle_1.minimumPathSumInATriangle,
    ...Proper2ColoringOfAGraph_1.proper2ColoringOfAGraph,
    ...TotalPrimesInRange_1.totalPrimesInRange,
    ...SanitizeParenthesesInExpression_1.sanitizeParenthesesInExpression,
    ...ShortestPathInAGrid_1.shortestPathInAGrid,
    ...SpiralizeMatrix_1.spiralizeMatrix,
    ...SquareRoot_1.squareRoot,
    ...SubarrayWithMaximumSum_1.subarrayWithMaximumSum,
    ...TotalWaysToSum_1.totalWaysToSum,
    ...UniquePathsInAGrid_1.uniquePathsInAGrid,
};
// This untyped variant is easier to work with when the specific type is not known.
// The specific shape is already checked by the CodingContractDefinitions type, so it is safe to assert the type.
exports.CodingContractTypes = exports.CodingContractDefinitions;
