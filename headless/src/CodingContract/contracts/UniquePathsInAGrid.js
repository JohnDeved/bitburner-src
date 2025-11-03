"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uniquePathsInAGrid = void 0;
const getRandomIntInclusive_1 = require("../../utils/helpers/getRandomIntInclusive");
const _enums_1 = require("@enums");
exports.uniquePathsInAGrid = {
    [_enums_1.CodingContractName.UniquePathsInAGridI]: {
        desc: (data) => {
            const numRows = data[0];
            const numColumns = data[1];
            return [
                "You are in a grid with",
                `${numRows} rows and ${numColumns} columns, and you are`,
                "positioned in the top-left corner of that grid. You are trying to",
                "reach the bottom-right corner of the grid, but you can only",
                "move down or right on each step. Determine how many",
                "unique paths there are from start to finish.\n\n",
                "NOTE: The data returned for this contract is an array",
                "with the number of rows and columns:\n\n",
                `[${numRows}, ${numColumns}]`,
            ].join(" ");
        },
        difficulty: 3,
        generate: () => {
            const numRows = (0, getRandomIntInclusive_1.getRandomIntInclusive)(2, 14);
            const numColumns = (0, getRandomIntInclusive_1.getRandomIntInclusive)(2, 14);
            return [numRows, numColumns];
        },
        solver: (data, answer) => {
            const n = data[0]; // Number of rows
            const m = data[1]; // Number of columns
            const currentRow = [];
            currentRow.length = n;
            for (let i = 0; i < n; i++) {
                currentRow[i] = 1;
            }
            for (let row = 1; row < m; row++) {
                for (let i = 1; i < n; i++) {
                    currentRow[i] += currentRow[i - 1];
                }
            }
            return currentRow[n - 1] === answer;
        },
        convertAnswer: (ans) => parseInt(ans, 10),
        validateAnswer: (ans) => typeof ans === "number",
    },
    [_enums_1.CodingContractName.UniquePathsInAGridII]: {
        desc: (data) => {
            let gridString = "";
            for (const line of data) {
                gridString += `${line.toString()},\n`;
            }
            return [
                "You are located in the top-left corner of the following grid:\n\n",
                `${gridString}\n`,
                "You are trying reach the bottom-right corner of the grid, but you can only",
                "move down or right on each step. Furthermore, there are obstacles on the grid",
                "that you cannot move onto. These obstacles are denoted by '1', while empty",
                "spaces are denoted by 0.\n\n",
                "Determine how many unique paths there are from start to finish.\n\n",
                "NOTE: The data returned for this contract is an 2D array of numbers representing the grid.",
            ].join(" ");
        },
        difficulty: 5,
        generate: () => {
            const numRows = (0, getRandomIntInclusive_1.getRandomIntInclusive)(2, 12);
            const numColumns = (0, getRandomIntInclusive_1.getRandomIntInclusive)(2, 12);
            const grid = [];
            grid.length = numRows;
            for (let i = 0; i < numRows; ++i) {
                grid[i] = [];
                grid[i].length = numColumns;
                grid[i].fill(0);
            }
            for (let r = 0; r < numRows; ++r) {
                for (let c = 0; c < numColumns; ++c) {
                    if (r === 0 && c === 0) {
                        continue;
                    }
                    if (r === numRows - 1 && c === numColumns - 1) {
                        continue;
                    }
                    // 15% chance of an element being an obstacle
                    if (Math.random() < 0.15) {
                        grid[r][c] = 1;
                    }
                }
            }
            return grid;
        },
        solver: (data, answer) => {
            const obstacleGrid = [];
            obstacleGrid.length = data.length;
            for (let i = 0; i < obstacleGrid.length; ++i) {
                obstacleGrid[i] = data[i].slice();
            }
            for (let i = 0; i < obstacleGrid.length; i++) {
                for (let j = 0; j < obstacleGrid[0].length; j++) {
                    if (obstacleGrid[i][j] == 1) {
                        obstacleGrid[i][j] = 0;
                    }
                    else if (i == 0 && j == 0) {
                        obstacleGrid[0][0] = 1;
                    }
                    else {
                        obstacleGrid[i][j] = (i > 0 ? obstacleGrid[i - 1][j] : 0) + (j > 0 ? obstacleGrid[i][j - 1] : 0);
                    }
                }
            }
            return obstacleGrid[obstacleGrid.length - 1][obstacleGrid[0].length - 1] === answer;
        },
        convertAnswer: (ans) => parseInt(ans, 10),
        validateAnswer: (ans) => typeof ans === "number",
    },
};
