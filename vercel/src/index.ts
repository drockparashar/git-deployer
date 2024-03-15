import express from "express";
import cors from "cors";
import simpleGit from "simple-git";
import {generate} from "./utils";

const app=express();

app.use(cors());
app.use(express.json());



app.post("/deploy", async (req,res)=>{
    const repoUrl=req.body.repoUrl;
    console.log(req.body.repoUrl);
    const id=generate();
    await simpleGit().clone(repoUrl,`output/${id}`)
    res.json({})
})

app.listen(3002,()=>console.log("Server started"));