"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shortestPathInAGrid = void 0;
const getRandomIntInclusive_1 = require("../../utils/helpers/getRandomIntInclusive");
const _enums_1 = require("@enums");
exports.shortestPathInAGrid = {
    [_enums_1.CodingContractName.ShortestPathInAGrid]: {
        desc: (data) => {
            return [
                "You are located in the top-left corner of the following grid:\n\n",
                `  [${data.map((line) => `[${line}]`).join(",\n   ")}]\n\n`,
                "You are trying to find the shortest path to the bottom-right corner of the grid,",
                "but there are obstacles on the grid that you cannot move onto.",
                "These obstacles are denoted by '1', while empty spaces are denoted by 0.\n\n",
                "Determine the shortest path from start to finish, if one exists.",
                "The answer should be given as a string of UDLR characters, indicating the moves along the path\n\n",
                "NOTE: If there are multiple equally short paths, any of them is accepted as answer.",
                "If there is no path, the answer should be an empty string.\n",
                "NOTE: The data returned for this contract is an 2D array of numbers representing the grid.\n\n",
                "Examples:\n\n",
                "    [[0,1,0,0,0],\n",
                "     [0,0,0,1,0]]\n",
                "\n",
                "Answer: 'DRRURRD'\n\n",
                "    [[0,1],\n",
                "     [1,0]]\n",
                "\n",
                "Answer: ''",
            ].join(" ");
        },
        difficulty: 7,
        generate: () => {
            const height = (0, getRandomIntInclusive_1.getRandomIntInclusive)(6, 12);
            const width = (0, getRandomIntInclusive_1.getRandomIntInclusive)(6, 12);
            const dstY = height - 1;
            const dstX = width - 1;
            const minPathLength = dstY + dstX; // Math.abs(dstY - srcY) + Math.abs(dstX - srcX)
            const grid = new Array(height);
            for (let y = 0; y < height; y++)
                grid[y] = new Array(width).fill(0);
            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    if (y == 0 && x == 0)
                        continue; // Don't block start
                    if (y == dstY && x == dstX)
                        continue; // Don't block destination
                    // Generate more obstacles the farther a position is from start and destination.
                    // Raw distance factor peaks at 50% at half-way mark. Rescale to 40% max.
                    // Obstacle chance range of [15%, 40%] produces ~78% solvable puzzles
                    const distanceFactor = (Math.min(y + x, dstY - y + dstX - x) / minPathLength) * 0.8;
                    if (Math.random() < Math.max(0.15, distanceFactor))
                        grid[y][x] = 1;
                }
            }
            return grid;
        },
        solver: (data, answer) => {
            const width = data[0].length;
            const height = data.length;
            const dstY = height - 1;
            const dstX = width - 1;
            const distance = new Array(height);
            //const prev: [[number, number] | undefined][] = new Array(height);
            const queue = [];
            for (let y = 0; y < height; y++) {
                distance[y] = new Array(width).fill(Infinity);
                //prev[y] = new Array(width).fill(undefined) as [undefined];
            }
            function validPosition(y, x) {
                return y >= 0 && y < height && x >= 0 && x < width && data[y][x] == 0;
            }
            // List in-bounds and passable neighbors
            function* neighbors(y, x) {
                if (validPosition(y - 1, x))
                    yield [y - 1, x]; // Up
                if (validPosition(y + 1, x))
                    yield [y + 1, x]; // Down
                if (validPosition(y, x - 1))
                    yield [y, x - 1]; // Left
                if (validPosition(y, x + 1))
                    yield [y, x + 1]; // Right
            }
            // Prepare starting point
            distance[0][0] = 0;
            queue.push([0, 0]);
            // Take next-nearest position and expand potential paths from there
            while (queue.length > 0) {
                const [y, x] = queue.shift();
                for (const [yN, xN] of neighbors(y, x)) {
                    if (distance[yN][xN] == Infinity) {
                        queue.push([yN, xN]);
                        distance[yN][xN] = distance[y][x] + 1;
                    }
                }
            }
            if (!Number.isFinite(distance[dstY][dstX]))
                return answer === "";
            if (answer.length > distance[dstY][dstX])
                return false;
            let ansX = 0;
            let ansY = 0;
            for (const direction of answer.split("")) {
                switch (direction) {
                    case "U":
                        ansY -= 1;
                        break;
                    case "D":
                        ansY += 1;
                        break;
                    case "L":
                        ansX -= 1;
                        break;
                    case "R":
                        ansX += 1;
                        break;
                    default:
                        return false;
                }
            }
            return ansX === dstX && ansY === dstY;
        },
        convertAnswer: (ans) => ans.replace(/\s/g, ""),
        validateAnswer: (ans) => typeof ans === "string" && ans.split("").every((c) => ["U", "D", "L", "R"].includes(c)),
    },
};
