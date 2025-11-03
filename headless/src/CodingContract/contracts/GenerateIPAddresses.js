"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateIPAddresses = void 0;
const _enums_1 = require("@enums");
const ContractTypes_1 = require("../ContractTypes");
const getRandomIntInclusive_1 = require("../../utils/helpers/getRandomIntInclusive");
exports.generateIPAddresses = {
    [_enums_1.CodingContractName.GenerateIPAddresses]: {
        desc: (data) => {
            return [
                "Given the following string containing only digits, return",
                "an array with all possible valid IP address combinations",
                "that can be created from the string:\n\n",
                `${data}\n\n`,
                "Note that an octet cannot begin with a '0' unless the number",
                "itself is exactly '0'. For example, '192.168.010.1' is not a valid IP.\n\n",
                "Examples:\n\n",
                '25525511135 -> ["255.255.11.135", "255.255.111.35"]\n',
                '1938718066 -> ["193.87.180.66"]',
            ].join(" ");
        },
        difficulty: 3,
        generate: () => {
            let str = "";
            for (let i = 0; i < 4; ++i) {
                const num = (0, getRandomIntInclusive_1.getRandomIntInclusive)(0, 255);
                const convNum = num.toString();
                str += convNum;
            }
            return str;
        },
        solver: (data, answer) => {
            const ret = [];
            for (let a = 1; a <= 3; ++a) {
                for (let b = 1; b <= 3; ++b) {
                    for (let c = 1; c <= 3; ++c) {
                        for (let d = 1; d <= 3; ++d) {
                            if (a + b + c + d === data.length) {
                                const A = parseInt(data.substring(0, a), 10);
                                const B = parseInt(data.substring(a, a + b), 10);
                                const C = parseInt(data.substring(a + b, a + b + c), 10);
                                const D = parseInt(data.substring(a + b + c, a + b + c + d), 10);
                                if (A <= 255 && B <= 255 && C <= 255 && D <= 255) {
                                    const ip = [A.toString(), ".", B.toString(), ".", C.toString(), ".", D.toString()].join("");
                                    if (ip.length === data.length + 3) {
                                        ret.push(ip);
                                    }
                                }
                            }
                        }
                    }
                }
            }
            return ret.length === answer.length && ret.every((ip) => answer.includes(ip));
        },
        convertAnswer: (ans) => {
            const sanitized = (0, ContractTypes_1.removeBracketsFromArrayString)(ans).replace(/\s/g, "");
            return sanitized.split(",").map((ip) => ip.replace(/^(?<quote>['"])([\d.]*)\k<quote>$/g, "$2"));
        },
        validateAnswer: (ans) => typeof ans === "object" && Array.isArray(ans) && ans.every((s) => typeof s === "string"),
    },
};
