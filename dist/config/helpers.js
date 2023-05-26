"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertValue = void 0;
function assertValue(obj, name, assertedValuesOptional) {
    const assertedValues = assertedValuesOptional !== null && assertedValuesOptional !== void 0 ? assertedValuesOptional : [undefined];
    const keys = Object.keys(obj);
    const values = keys.map((value) => obj[value]);
    values.forEach((value, index) => {
        if (assertedValues.includes(value)) {
            throw new Error(`Configuration Error: ${name}.${keys[index]} is undefined or in [${assertedValues}]`);
        }
    });
}
exports.assertValue = assertValue;
