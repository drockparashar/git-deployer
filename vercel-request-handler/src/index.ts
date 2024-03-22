import express from "express";
import {S3} from "aws-sdk"

const app=express();

const s3=new S3({
    accessKeyId:"351f4ff82de9690bfb892cb03ad39e0d",
    secretAccessKey:"b6ee3c2991bce20ebf1d8091dd81fc0b6812921f867d2239cc8443f5e26aac10",
    endpoint:"https://23068beee6a05ea630fd8e18391c3273.r2.cloudflarestorage.com"
})

app.get("/*", async (req,res)=>{
    const host=req.hostname;
    const id=host.split(".")[0];
    const filePath=req.path;

    const content=s3.getObject({
        Bucket:"vercel",
        Key:`dist/${id}/${filePath}`
    }).promise();

    const type=filePath.endsWith("html")?"text/html":filePath.endsWith("css")?"text/css":"application/javascript";
    res.set("Content-Type",type); //It prvents the browser from downloading the requested file

    res.send((await content).Body);
})

app.listen(3001);