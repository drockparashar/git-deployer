import { S3 } from "aws-sdk";
import fs from 'fs';
import path from "path";


const s3=new S3({
    accessKeyId:"351f4ff82de9690bfb892cb03ad39e0d",
    secretAccessKey:"b6ee3c2991bce20ebf1d8091dd81fc0b6812921f867d2239cc8443f5e26aac10",
    endpoint:"https://23068beee6a05ea630fd8e18391c3273.r2.cloudflarestorage.com"
})

export async function downloadS3Folder(prefix: string) {
    console.log("start")
    const allFiles = await s3.listObjectsV2({
        Bucket: "vercel",
        Prefix: prefix
    }).promise();
    console.log(allFiles);

    const allPromises = allFiles.Contents?.map(async ({Key}) => {
        return new Promise(async (resolve) => {
            if (!Key) {
                resolve("");
                return;
            }
            const finalOutputPath = path.join(__dirname, Key);
            const outputFile = fs.createWriteStream(finalOutputPath);
            const dirName = path.dirname(finalOutputPath);
            if (!fs.existsSync(dirName)){
                fs.mkdirSync(dirName, { recursive: true });
            }
            s3.getObject({
                Bucket: "vercel",
                Key
            }).createReadStream().pipe(outputFile).on("finish", () => {
                console.log("downloaded")
                resolve("");
            })
        })
    }) || []
    console.log("awaiting");

    await Promise.all(allPromises?.filter(x => x !== undefined));
}

export function copyFinalDist(id:string){
    const folderPath=path.join(__dirname,`output/${id}/dist`)
    const allFiles=getAllFiles(folderPath);
    allFiles.forEach(file =>{
        uploadFile(`dist/${id}/`+convertPath(file.slice(folderPath.length+1)),file);
    })
}

 function convertPath(windowsPath:string){
    let path=windowsPath.replace(/\\/g,'/');
    return path;
}

export const getAllFiles=(folderPath:string)=>{
    let response:string[]=[];
    const allFilesAndFolders=fs.readdirSync(folderPath);
    allFilesAndFolders.forEach(file=>{
        const fullFilePath=path.join(folderPath,file);
        if(fs.statSync(fullFilePath).isDirectory()) {
            response=response.concat(getAllFiles(fullFilePath))
        }else{
            response.push(fullFilePath);
        }
    })

    return response;
}

const uploadFile = async (fileName: string, localFilePath: string) => {
    const fileContent = fs.readFileSync(localFilePath);
    const response = await s3.upload({
        Body: fileContent,
        Bucket: "vercel",
        Key: fileName,
    }).promise();
    console.log(response);
}