"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate = void 0;
function generate() {
    const subset = "1234567890qwertyuiopasdfghjklzxcvbnm";
    const len = 5;
    var id = "";
    for (let i = 0; i < len; i++) {
        id += subset[Math.floor(Math.random() * subset.length)];
    }
    return id;
}
exports.generate = generate;
