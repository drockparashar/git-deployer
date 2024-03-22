"use strict";
//id- 351f4ff82de9690bfb892cb03ad39e0d
//secret- b6ee3c2991bce20ebf1d8091dd81fc0b6812921f867d2239cc8443f5e26aac10
//url- https://23068beee6a05ea630fd8e18391c3273.r2.cloudflarestorage.com
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
const cors_1 = __importDefault(require("cors"));
const simple_git_1 = __importDefault(require("simple-git"));
const utils_1 = require("./utils");
const path_1 = __importDefault(require("path"));
const files_1 = require("./files");
const aws_1 = require("./aws");
const path_2 = require("./path");
const redis_1 = require("redis");
const publisher = (0, redis_1.createClient)();
publisher.connect();
const subscriber = (0, redis_1.createClient)();
subscriber.connect();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.post("/deploy", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const repoUrl = req.body.repoUrl;
    console.log(req.body.repoUrl);
    const id = (0, utils_1.generate)();
    yield (0, simple_git_1.default)().clone(repoUrl, path_1.default.join(__dirname, `output/${id}`));
    const files = (0, files_1.getAllFiles)(path_1.default.join(__dirname, `output/${id}`));
    files.forEach((file) => {
        (0, aws_1.uploadFile)((0, path_2.convertPath)(file.slice(__dirname.length + 1)), file);
        console.log((0, path_2.convertPath)(file.slice(__dirname.length + 2)));
    });
    publisher.lPush("build-queue", id);
    publisher.hSet("status", id, "uploaded"); //Similar to .create in MongoDB
    // console.log(files)
    res.json({ id: id, __dirname });
}));
app.get("/status", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.query.id;
    const response = yield subscriber.hGet("status", id);
    res.json({ status: response });
}));
app.listen(3002, () => console.log("Server started"));
