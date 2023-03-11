import https_get from "./https.js";
import { parse } from "node-html-parser";

const domain = process.env.GHOST_DOMAIN;

const ghost_key = process.env.GHOST_TOKEN;
const posts = {
    hostname: domain,
    path: `/ghost/api/v3/content/posts/?key=${ghost_key}&limit=1`
}

function get_blog_posts(){
    return https_get(posts).then(value => {
        let parsed = JSON.parse(value);
        return (parsed["meta"]["pagination"]["total"].toString());
    })
}

let num_blog_posts = 0;
let num_words = 0;

export default function add_ghost(app){
    get_blog_posts().then(value => num_blog_posts = value)
        .then(() =>{
            app.get("/api/stats/ghost_entries", (req, res) =>{
                res.send(num_blog_posts.toString());
            });
            // refresh value every hour
            setInterval(() =>{
                get_blog_posts().then(num_repos => num_blog_posts = num_repos)
            }, 60 * 60 * 1000); // every hour
        });

    get_words().then(value => num_words = value)
        .then(() =>{
            app.get("/api/stats/ghost_words", (req, res) =>{
                res.send(num_words.toString());
            });
            setInterval(() =>{
                get_words().then(value => num_words = value)
            }, 60 * 60 * 1000); // every hour
        });

}

const words = {
    hostname: domain,
    path: `/ghost/api/v3/content/posts/?key=${ghost_key}&limit=all&fields=html`
}
function get_words(){
    return https_get(words).then(result => {
        let word_count = 0;
        let parsed = JSON.parse(result);
        for(let post of parsed["posts"]){
            let html = parse(post["html"]);
            word_count += html.text.split(" ").length;
        }
        return word_count;
    })
}

