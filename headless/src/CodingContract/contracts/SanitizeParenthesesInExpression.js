"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizeParenthesesInExpression = void 0;
const getRandomIntInclusive_1 = require("../../utils/helpers/getRandomIntInclusive");
const ContractTypes_1 = require("../ContractTypes");
const _enums_1 = require("@enums");
exports.sanitizeParenthesesInExpression = {
    [_enums_1.CodingContractName.SanitizeParenthesesInExpression]: {
        desc: (data) => {
            return [
                "Given the following string:\n\n",
                `${data}\n\n`,
                "remove the minimum number of invalid parentheses in order to validate",
                "the string. If there are multiple minimal ways to validate the string,",
                "provide all of the possible results. The answer should be provided",
                "as an array of strings. If it is impossible to validate the string",
                "the result should be an array with only an empty string.\n\n",
                "IMPORTANT: The string may contain letters, not just parentheses.\n\n",
                `Examples:\n\n`,
                `"()())()" -> ["()()()", "(())()"]\n`,
                `"(a)())()" -> ["(a)()()", "(a())()"]\n`,
                `")(" -> [""]`,
            ].join(" ");
        },
        difficulty: 10,
        generate: () => {
            const len = (0, getRandomIntInclusive_1.getRandomIntInclusive)(6, 20);
            const chars = [];
            chars.length = len;
            // 80% chance of the first parenthesis being (
            Math.random() < 0.8 ? (chars[0] = "(") : (chars[0] = ")");
            for (let i = 1; i < len; ++i) {
                const roll = Math.random();
                if (roll < 0.4) {
                    chars[i] = "(";
                }
                else if (roll < 0.8) {
                    chars[i] = ")";
                }
                else {
                    chars[i] = "a";
                }
            }
            return chars.join("");
        },
        solver: (data, answer) => {
            let left = 0;
            let right = 0;
            const res = [];
            for (let i = 0; i < data.length; ++i) {
                if (data[i] === "(") {
                    ++left;
                }
                else if (data[i] === ")") {
                    left > 0 ? --left : ++right;
                }
            }
            function dfs(pair, index, left, right, s, solution, res) {
                if (s.length === index) {
                    if (left === 0 && right === 0 && pair === 0) {
                        for (let i = 0; i < res.length; i++) {
                            if (res[i] === solution) {
                                return;
                            }
                        }
                        res.push(solution);
                    }
                    return;
                }
                if (s[index] === "(") {
                    if (left > 0) {
                        dfs(pair, index + 1, left - 1, right, s, solution, res);
                    }
                    dfs(pair + 1, index + 1, left, right, s, solution + s[index], res);
                }
                else if (s[index] === ")") {
                    if (right > 0)
                        dfs(pair, index + 1, left, right - 1, s, solution, res);
                    if (pair > 0)
                        dfs(pair - 1, index + 1, left, right, s, solution + s[index], res);
                }
                else {
                    dfs(pair, index + 1, left, right, s, solution + s[index], res);
                }
            }
            dfs(0, 0, left, right, data, "", res);
            if (res.length !== answer.length)
                return false;
            return res.every((sol) => answer.includes(sol));
        },
        convertAnswer: (ans) => {
            const sanitized = (0, ContractTypes_1.removeBracketsFromArrayString)(ans).split(",");
            return sanitized.map((s) => (0, ContractTypes_1.removeQuotesFromString)(s.replace(/\s/g, "")));
        },
        validateAnswer: (ans) => typeof ans === "object" && Array.isArray(ans) && ans.every((s) => typeof s === "string"),
    },
};
