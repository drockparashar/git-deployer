"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const aws_sdk_1 = require("aws-sdk");
const app = (0, express_1.default)();
const s3 = new aws_sdk_1.S3({
    accessKeyId: "351f4ff82de9690bfb892cb03ad39e0d",
    secretAccessKey: "b6ee3c2991bce20ebf1d8091dd81fc0b6812921f867d2239cc8443f5e26aac10",
    endpoint: "https://23068beee6a05ea630fd8e18391c3273.r2.cloudflarestorage.com"
});
app.get("/*", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const host = req.hostname;
    const id = host.split(".")[0];
    const filePath = req.path;
    const content = s3.getObject({
        Bucket: "vercel",
        Key: `dist/${id}/${filePath}`
    }).promise();
    const type = filePath.endsWith("html") ? "text/html" : filePath.endsWith("css") ? "text/css" : "application/javascript";
    res.set("Content-Type", type); //It prvents the browser from downloading the requested file
    res.send((yield content).Body);
}));
app.listen(3001);
