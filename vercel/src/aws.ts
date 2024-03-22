import { S3 } from "aws-sdk";
import fs from "fs";

const s3=new S3({
    accessKeyId:"351f4ff82de9690bfb892cb03ad39e0d",
    secretAccessKey:"b6ee3c2991bce20ebf1d8091dd81fc0b6812921f867d2239cc8443f5e26aac10",
    endpoint:"https://23068beee6a05ea630fd8e18391c3273.r2.cloudflarestorage.com"
})

export const uploadFile=async(filePath:string,localFilePath:string)=>{
console.log("called");
const fileContent=fs.readFileSync(localFilePath);
const response= s3.upload({
    Body:fileContent,
    Bucket:"vercel",
    Key:filePath
}).promise();
    console.log(response);
}