
import { parse } from "node-html-parser";

import https_get from "./https.js";

let num_wiki_entries = 0;
let num_words= 0;

const domain = process.env.WIKI_DOMAIN;

export default function add_wiki(app){
    rec_articles([], "").then(results => {
        set_counts(results);

        app.get("/api/stats/wiki_entries", (req, res) => {
            res.send(num_wiki_entries.toString());
        });

        app.get("/api/stats/wiki_words", (req, res) => {
            res.send(num_words.toString());
        });
        // refresh value every hour
        setInterval(() =>{
            rec_articles([], "").then(results => set_counts(results))
        }, 60 * 60 * 1000); // every hour
    })
}


function set_counts(results){
    num_wiki_entries = results.length;
    num_words = 0;
    for(let result of results){
        https_get({hostname: domain, path : `/api.php?action=parse&page=${encodeURIComponent(result["title"])}&prop=wikitext`})
            .then(result => {
                let html = parse(result);
                let parsed = JSON.parse(html.querySelector(".api-pretty-content").innerText);
                let words = parsed["parse"]["wikitext"]["*"].split(" ");
                num_words += words.length;

            })
    }
}

function rec_articles(articles, apfrom){
    return https_get({hostname: domain, path: `/api.php?action=query&list=allpages${apfrom}`})
        .then(result =>{
            let html = parse(result);
            let parsed = JSON.parse(html.querySelector(".api-pretty-content").innerText);

            let articles_added = articles.concat(parsed["query"]["allpages"]);
            if("continue" in parsed){
                return rec_articles(articles_added, "&apfrom=" + parsed["continue"]["apcontinue"]);
            }else{
                return articles_added;
            }
    });
}
