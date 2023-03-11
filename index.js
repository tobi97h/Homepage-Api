
import express from "express";
import add_backup from "./backup.js";
import add_gitea from "./gitea.js";
import add_wiki from "./wiki.js";
import add_ghost from "./ghost.js";

const app = express();

add_backup(app);
add_gitea(app);
add_wiki(app);
add_ghost(app);

app.listen(80);