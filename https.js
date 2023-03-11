import https from "https";

export  default function https_get(options){
    return new Promise(resolve => {
        https.get(options, https_res => {
            let result = ""
            https_res.on("data", (chunk) => {
                result += chunk;
            });

            https_res.on('end',  () => {
                resolve(result);
            });
        });
    })
}