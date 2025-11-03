"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.squareRoot = void 0;
const _enums_1 = require("@enums");
const randomBigIntExclusive_1 = require("../../utils/helpers/randomBigIntExclusive");
exports.squareRoot = {
    [_enums_1.CodingContractName.SquareRoot]: {
        difficulty: 5,
        desc(data) {
            return `You are given a ~200 digit BigInt. Find the square root of this number, to the nearest integer.\n
The input is a BigInt value. The answer must be the string representing the solution's BigInt value. The trailing "n" is not part of the string.\n
Hint: If you are having trouble, you might consult https://en.wikipedia.org/wiki/Methods_of_computing_square_roots

Input number:
${data}`;
        },
        generate() {
            const half = BigInt(2 ** 332);
            // We will square this, meaning the result won't be uniformly distributed anymore.
            // That's OK, we never claimed that (just that it would be random).
            // We cap the low end to 2^332 so that the problem input is always in the range [2^664, 2^666) which is 200-201 digits.
            const ans = (0, randomBigIntExclusive_1.randomBigIntExclusive)(half) + half;
            let offset;
            // The numbers x for which round(sqrt(x)) = n are the integer range [n^2 - n + 1, n^2 + n + 1)
            if (Math.random() >= 0.5) {
                // Half the time, we will test the edge cases
                offset = Math.random() >= 0.5 ? ans : 1n - ans;
            }
            else {
                offset = (0, randomBigIntExclusive_1.randomBigIntExclusive)(ans + ans) + 1n - ans;
            }
            // Bigints can't be JSON serialized, so we use strings.
            return [ans.toString(), offset.toString()];
        },
        getData(state) {
            const ans = BigInt(state[0]);
            return ans * ans + BigInt(state[1]);
        },
        solver: (state, answer) => {
            return state[0] === answer.toString();
        },
        convertAnswer: (ans) => BigInt(ans),
        validateAnswer: (ans) => typeof ans === "bigint",
    },
};
