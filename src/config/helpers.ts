export function assertValue(obj: {[key: string] : any}, name: string, assertedValuesOptional?: any[]) : void {
    const assertedValues = assertedValuesOptional ?? [undefined];
    const keys = Object.keys(obj);
    const values = keys.map((value) => obj[value]);
    values.forEach((value, index) => {
        if (assertedValues.includes(value)) {
            throw new Error(`Configuration Error: ${name}.${keys[index]} is undefined or in [${assertedValues}]`)
        }
    });
}