// https://stackoverflow.com/questions/40031688/javascript-arraybuffer-to-hex

import crypto, { randomInt } from "crypto";

export function randomString(byteLength: number) : string {
    return [...new Uint8Array(crypto.getRandomValues(new Uint8Array(byteLength)))]
        .map(x => x.toString(16).padStart(2, '0'))
        .join('');
}

export function randomNumber(start: number, end: number) : number {
    return randomInt(end-start)+start
}

export function count0Required(count: number = 2, func: Function) {
    return () => {
        count--;
        if ( count === 0 ) {
            func();
        }
    }
}