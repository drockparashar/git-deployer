import {commandOptions, createClient} from "redis";
import { copyFinalDist, downloadS3Folder } from "./aws";
import { buildProject } from "./utils";
const publisher=createClient();
publisher.connect();
const subscriber=createClient();
subscriber.connect();
//in redis cannot publish and create from same client

async function main(){
    while(1){
        const response=await subscriber.brPop(
            commandOptions({isolated:true}),
            "build-queue",
            0
        );
        console.log(response);
        //@ts-ignore
        const id=response.element;

        await downloadS3Folder(`output/${id}`)
        console.log("downloaded")
        await buildProject(id);
        console.log("Build Complete")
        copyFinalDist(id);
        console.log("Copied")
        publisher.hSet("status",id,"deployed");
    }
}

main();