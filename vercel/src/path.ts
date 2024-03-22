export function convertPath(windowsPath:string){
    let path=windowsPath.replace(/\\/g,'/');
    return path;
}