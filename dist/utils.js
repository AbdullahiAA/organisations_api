"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasCommonElement = hasCommonElement;
function hasCommonElement(arr1, arr2) {
    return arr1.some((element) => arr2.includes(element));
}
