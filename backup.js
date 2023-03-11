import fs from "fs";

export default function make(app){

    app.post("/api/sneaky-backup", (req, res) => {

        req.on('data', function(chunk){
            fs.appendFile("/files/" +  req.headers["filename"], chunk, err => {
                console.log(err);
            });
        });
        req.on('end', function() {
            res.end();
        });
    });

}