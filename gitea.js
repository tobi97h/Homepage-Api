import https from "https";
import https_get from "./https.js";


const domain = process.env.GITEA_DOMAIN;

const gitea_token = process.env.GITEA_TOKEN;
const gitea_repos = {
    hostname : domain,
    path : "/api/v1/user/repos",
    headers : {
        Authorization : `token ${gitea_token}`
    }
};

let num_gitea_repos = 0;
let num_commits = 0;

function set_counts(result){
    let parsed = JSON.parse(result);
    num_gitea_repos = Object.keys(parsed).length.toString();
    num_commits = 0;
    for(let repo of parsed){
        let commit_options = {
            hostname : domain,
            path : `/api/v1/repos/tobi/${repo["name"]}/commits`,
            headers : {
                Authorization : `token ${gitea_token}`
            }
        };
        https.get(commit_options, res => {
            num_commits += parseInt(res.headers["x-total"]);
        })
    }
}

export default function add_gitea(app){
    https_get(gitea_repos).then(result => {
        set_counts(result);
        app.get("/api/stats/gitea_repos", (req, res) => {
            res.send(num_gitea_repos.toString());
        });
        app.get("/api/stats/gitea_commits", (req, res) => {
            res.send(num_commits.toString());
        });

        setInterval(() =>{
            https_get(gitea_repos).then(result => set_counts(result))
        }, 60 * 60 * 1000); // every hour
    });
}
