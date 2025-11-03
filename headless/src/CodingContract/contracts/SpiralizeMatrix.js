"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.spiralizeMatrix = void 0;
const _enums_1 = require("@enums");
const ContractTypes_1 = require("../ContractTypes");
const getRandomIntInclusive_1 = require("../../utils/helpers/getRandomIntInclusive");
exports.spiralizeMatrix = {
    [_enums_1.CodingContractName.SpiralizeMatrix]: {
        desc: (n) => {
            let d = [
                "Given the following array of arrays of numbers representing a 2D matrix,",
                "return the elements of the matrix as an array in spiral order:\n\n",
            ].join(" ");
            // for (const line of n) {
            //   d += `${line.toString()},\n`;
            // }
            d += "    [\n";
            d += n
                .map((line) => "        [" + line.map((x) => `${x}`.padStart(2, " ")).join(",") + "]")
                .join("\n");
            d += "\n    ]\n";
            d += [
                "\nHere is an example of what spiral order should be:\n\n",
                "    [\n",
                "        [1, 2, 3]\n",
                "        [4, 5, 6]\n",
                "        [7, 8, 9]\n",
                "    ]\n\n",
                "Answer: [1, 2, 3, 6, 9, 8 ,7, 4, 5]\n\n",
                "Note that the matrix will not always be square:\n\n",
                "    [\n",
                "        [1,  2,  3,  4]\n",
                "        [5,  6,  7,  8]\n",
                "        [9, 10, 11, 12]\n",
                "    ]\n\n",
                "Answer: [1, 2, 3, 4, 8, 12, 11, 10, 9, 5, 6, 7]",
            ].join(" ");
            return d;
        },
        difficulty: 2,
        generate: () => {
            const m = (0, getRandomIntInclusive_1.getRandomIntInclusive)(1, 15);
            const n = (0, getRandomIntInclusive_1.getRandomIntInclusive)(1, 15);
            const matrix = [];
            matrix.length = m;
            for (let i = 0; i < m; ++i) {
                matrix[i] = [];
                matrix[i].length = n;
            }
            for (let i = 0; i < m; ++i) {
                for (let j = 0; j < n; ++j) {
                    matrix[i][j] = (0, getRandomIntInclusive_1.getRandomIntInclusive)(1, 50);
                }
            }
            return matrix;
        },
        solver: (data, answer) => {
            const spiral = [];
            const m = data.length;
            const n = data[0].length;
            let u = 0;
            let d = m - 1;
            let l = 0;
            let r = n - 1;
            let k = 0;
            let done = false;
            while (!done) {
                // Up
                for (let col = l; col <= r; col++) {
                    spiral[k] = data[u][col];
                    ++k;
                }
                if (++u > d) {
                    done = true;
                    continue;
                }
                // Right
                for (let row = u; row <= d; row++) {
                    spiral[k] = data[row][r];
                    ++k;
                }
                if (--r < l) {
                    done = true;
                    continue;
                }
                // Down
                for (let col = r; col >= l; col--) {
                    spiral[k] = data[d][col];
                    ++k;
                }
                if (--d < u) {
                    done = true;
                    continue;
                }
                // Left
                for (let row = d; row >= u; row--) {
                    spiral[k] = data[row][l];
                    ++k;
                }
                if (++l > r) {
                    done = true;
                    continue;
                }
            }
            return spiral.length === answer.length && spiral.every((n, i) => n === answer[i]);
        },
        convertAnswer: (ans) => {
            const sanitized = (0, ContractTypes_1.removeBracketsFromArrayString)(ans).replace(/\s/g, "").split(",");
            return sanitized.map((s) => parseInt(s));
        },
        validateAnswer: (ans) => typeof ans === "object" && Array.isArray(ans) && ans.every((n) => typeof n === "number"),
    },
};
