"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertPath = void 0;
function convertPath(windowsPath) {
    let path = windowsPath.replace(/\\/g, '/');
    return path;
}
exports.convertPath = convertPath;
