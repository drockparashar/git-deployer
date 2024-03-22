//id- 351f4ff82de9690bfb892cb03ad39e0d
//secret- b6ee3c2991bce20ebf1d8091dd81fc0b6812921f867d2239cc8443f5e26aac10
//url- https://23068beee6a05ea630fd8e18391c3273.r2.cloudflarestorage.com


import express from "express";
import cors from "cors";
import simpleGit from "simple-git";
import {generate} from "./utils";
import path from "path";
import { getAllFiles } from "./files";
import { uploadFile } from "./aws";
import { convertPath } from "./path";
import { createClient } from "redis";
const publisher=createClient();
publisher.connect();
const subscriber=createClient();
subscriber.connect();
const app=express();

app.use(cors());
app.use(express.json());



app.post("/deploy", async (req,res)=>{
    const repoUrl=req.body.repoUrl;
    console.log(req.body.repoUrl);
    const id=generate();
    await simpleGit().clone(repoUrl,path.join(__dirname,`output/${id}`))
    const files=getAllFiles(path.join(__dirname,`output/${id}`))
    files.forEach((file)=>{
        
        uploadFile(convertPath(file.slice(__dirname.length+1)),file);
        console.log(convertPath(file.slice(__dirname.length+2)))
    })
    publisher.lPush("build-queue",id);
    publisher.hSet("status",id,"uploaded");//Similar to .create in MongoDB
    // console.log(files)
    res.json({id:id,__dirname})
})

app.get("/status",async (req,res)=>{
    const id=req.query.id;
    const response= await subscriber.hGet("status",id as string);
    res.json({status:response})
})

app.listen(3002,()=>console.log("Server started"));