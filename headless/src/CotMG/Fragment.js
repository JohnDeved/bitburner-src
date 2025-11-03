"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Fragment = exports.Fragments = void 0;
exports.FragmentById = FragmentById;
const FragmentType_1 = require("./FragmentType");
const Shapes_1 = require("./data/Shapes");
exports.Fragments = [];
class Fragment {
    constructor(id, shape, type, power, limit, effect) {
        this.id = id;
        this.shape = shape;
        this.type = type;
        this.power = power;
        this.limit = limit;
        this.effect = effect;
    }
    fullAt(x, y, rotation) {
        if (y < 0)
            return false;
        if (y >= this.height(rotation))
            return false;
        if (x < 0)
            return false;
        if (x >= this.width(rotation))
            return false;
        // start xy, modifier xy
        let [sx, sy, mx, my] = [0, 0, 1, 1];
        if (rotation === 1) {
            [sx, sy, mx, my] = [this.width(rotation) - 1, 0, -1, 1];
        }
        else if (rotation === 2) {
            [sx, sy, mx, my] = [this.width(rotation) - 1, this.height(rotation) - 1, -1, -1];
        }
        else if (rotation === 3) {
            [sx, sy, mx, my] = [0, this.height(rotation) - 1, 1, -1];
        }
        let [qx, qy] = [sx + mx * x, sy + my * y];
        if (rotation % 2 === 1)
            [qx, qy] = [qy, qx];
        return this.shape[qy][qx];
    }
    width(rotation) {
        if (rotation % 2 === 0)
            return this.shape[0].length;
        return this.shape.length;
    }
    height(rotation) {
        if (rotation % 2 === 0)
            return this.shape.length;
        return this.shape[0].length;
    }
    // List of direct neighbors of this fragment.
    neighbors(rotation) {
        const candidates = [];
        const add = (x, y) => {
            if (this.fullAt(x, y, rotation))
                return;
            if (candidates.some((coord) => coord[0] === x && coord[1] === y))
                return;
            candidates.push([x, y]);
        };
        for (let y = 0; y < this.height(rotation); y++) {
            for (let x = 0; x < this.width(rotation); x++) {
                // This cell is full, add all it's neighbors.
                if (!this.fullAt(x, y, rotation))
                    continue;
                add(x - 1, y);
                add(x + 1, y);
                add(x, y - 1);
                add(x, y + 1);
            }
        }
        const cells = [];
        for (const candidate of candidates) {
            if (cells.some((cell) => cell[0] === candidate[0] && cell[1] === candidate[1]))
                continue;
            cells.push(candidate);
        }
        return cells;
    }
    copy() {
        return Object.assign({}, this);
    }
}
exports.Fragment = Fragment;
function FragmentById(id) {
    for (const fragment of exports.Fragments) {
        if (fragment.id === id)
            return fragment;
    }
    return null;
}
(function () {
    const _ = false;
    const X = true;
    exports.Fragments.push(new Fragment(0, // id
    Shapes_1.Shapes.S, FragmentType_1.FragmentTypeEnum.Hacking, 1, 1, // limit
    (0, FragmentType_1.Effect)(FragmentType_1.FragmentTypeEnum.Hacking)));
    exports.Fragments.push(new Fragment(1, // id
    Shapes_1.Shapes.Z, FragmentType_1.FragmentTypeEnum.Hacking, 1, 1, // limit
    (0, FragmentType_1.Effect)(FragmentType_1.FragmentTypeEnum.Hacking)));
    exports.Fragments.push(new Fragment(5, // id
    Shapes_1.Shapes.T, FragmentType_1.FragmentTypeEnum.HackingSpeed, 1.3, 1, // limit
    (0, FragmentType_1.Effect)(FragmentType_1.FragmentTypeEnum.HackingSpeed)));
    exports.Fragments.push(new Fragment(6, // id
    Shapes_1.Shapes.I, FragmentType_1.FragmentTypeEnum.HackingMoney, 2, // power
    1, // limit
    (0, FragmentType_1.Effect)(FragmentType_1.FragmentTypeEnum.HackingMoney)));
    exports.Fragments.push(new Fragment(7, // id
    Shapes_1.Shapes.J, FragmentType_1.FragmentTypeEnum.HackingGrow, 0.5, // power
    1, // limit
    (0, FragmentType_1.Effect)(FragmentType_1.FragmentTypeEnum.HackingGrow)));
    exports.Fragments.push(new Fragment(10, // id
    Shapes_1.Shapes.T, FragmentType_1.FragmentTypeEnum.Strength, 2, // power
    1, // limit
    (0, FragmentType_1.Effect)(FragmentType_1.FragmentTypeEnum.Strength)));
    exports.Fragments.push(new Fragment(12, // id
    Shapes_1.Shapes.L, FragmentType_1.FragmentTypeEnum.Defense, 2, // power
    1, // limit
    (0, FragmentType_1.Effect)(FragmentType_1.FragmentTypeEnum.Defense)));
    exports.Fragments.push(new Fragment(14, // id
    Shapes_1.Shapes.L, FragmentType_1.FragmentTypeEnum.Dexterity, 2, // power
    1, // limit
    (0, FragmentType_1.Effect)(FragmentType_1.FragmentTypeEnum.Dexterity)));
    exports.Fragments.push(new Fragment(16, // id
    Shapes_1.Shapes.S, FragmentType_1.FragmentTypeEnum.Agility, 2, // power
    1, // limit
    (0, FragmentType_1.Effect)(FragmentType_1.FragmentTypeEnum.Agility)));
    exports.Fragments.push(new Fragment(18, // id
    Shapes_1.Shapes.S, FragmentType_1.FragmentTypeEnum.Charisma, 3, // power
    1, // limit
    (0, FragmentType_1.Effect)(FragmentType_1.FragmentTypeEnum.Charisma)));
    exports.Fragments.push(new Fragment(20, // id
    Shapes_1.Shapes.I, FragmentType_1.FragmentTypeEnum.HacknetMoney, 1, // power
    1, // limit
    (0, FragmentType_1.Effect)(FragmentType_1.FragmentTypeEnum.HacknetMoney)));
    exports.Fragments.push(new Fragment(21, // id
    Shapes_1.Shapes.O, FragmentType_1.FragmentTypeEnum.HacknetCost, 2, // power
    1, // limit
    (0, FragmentType_1.Effect)(FragmentType_1.FragmentTypeEnum.HacknetCost)));
    exports.Fragments.push(new Fragment(25, // id
    Shapes_1.Shapes.J, FragmentType_1.FragmentTypeEnum.Rep, 0.5, // power
    1, // limit
    (0, FragmentType_1.Effect)(FragmentType_1.FragmentTypeEnum.Rep)));
    exports.Fragments.push(new Fragment(27, // id
    Shapes_1.Shapes.J, FragmentType_1.FragmentTypeEnum.WorkMoney, 10, // power
    1, // limit
    (0, FragmentType_1.Effect)(FragmentType_1.FragmentTypeEnum.WorkMoney)));
    exports.Fragments.push(new Fragment(28, // id
    Shapes_1.Shapes.L, FragmentType_1.FragmentTypeEnum.Crime, 2, // power
    1, // limit
    (0, FragmentType_1.Effect)(FragmentType_1.FragmentTypeEnum.Crime)));
    exports.Fragments.push(new Fragment(30, // id
    Shapes_1.Shapes.S, FragmentType_1.FragmentTypeEnum.Bladeburner, 0.4, // power
    1, // limit
    (0, FragmentType_1.Effect)(FragmentType_1.FragmentTypeEnum.Bladeburner)));
    exports.Fragments.push(new Fragment(100, // id
    [
        // shape
        [_, X, X],
        [X, X, _],
        [_, X, _],
    ], FragmentType_1.FragmentTypeEnum.Booster, 1.1, // power
    99, // limit
    (0, FragmentType_1.Effect)(FragmentType_1.FragmentTypeEnum.Booster)));
    exports.Fragments.push(new Fragment(101, // id
    [
        // shape
        [X, X, X, X],
        [X, _, _, _],
    ], FragmentType_1.FragmentTypeEnum.Booster, 1.1, // power
    99, // limit
    (0, FragmentType_1.Effect)(FragmentType_1.FragmentTypeEnum.Booster)));
    exports.Fragments.push(new Fragment(102, // id
    [
        // shape
        [_, X, X, X],
        [X, X, _, _],
    ], FragmentType_1.FragmentTypeEnum.Booster, 1.1, // power
    99, // limit
    (0, FragmentType_1.Effect)(FragmentType_1.FragmentTypeEnum.Booster)));
    exports.Fragments.push(new Fragment(103, // id
    [
        // shape
        [X, X, X, _],
        [_, _, X, X],
    ], FragmentType_1.FragmentTypeEnum.Booster, 1.1, // power
    99, // limit
    (0, FragmentType_1.Effect)(FragmentType_1.FragmentTypeEnum.Booster)));
    exports.Fragments.push(new Fragment(104, // id
    [
        // shape
        [_, X, X],
        [_, X, _],
        [X, X, _],
    ], FragmentType_1.FragmentTypeEnum.Booster, 1.1, // power
    99, // limit
    (0, FragmentType_1.Effect)(FragmentType_1.FragmentTypeEnum.Booster)));
    exports.Fragments.push(new Fragment(105, // id
    [
        // shape
        [_, _, X],
        [_, X, X],
        [X, X, _],
    ], FragmentType_1.FragmentTypeEnum.Booster, 1.1, // power
    99, // limit
    (0, FragmentType_1.Effect)(FragmentType_1.FragmentTypeEnum.Booster)));
    exports.Fragments.push(new Fragment(106, // id
    [
        // shape
        [X, _, _],
        [X, X, X],
        [X, _, _],
    ], FragmentType_1.FragmentTypeEnum.Booster, 1.1, // power
    99, // limit
    (0, FragmentType_1.Effect)(FragmentType_1.FragmentTypeEnum.Booster)));
    exports.Fragments.push(new Fragment(107, // id
    [
        // shape
        [_, X, _],
        [X, X, X],
        [_, X, _],
    ], FragmentType_1.FragmentTypeEnum.Booster, 1.1, // power
    99, // limit
    (0, FragmentType_1.Effect)(FragmentType_1.FragmentTypeEnum.Booster)));
})();
