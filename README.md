# Project

This project fetches various stats from my private services.

It Listens on port 80.

Saves `/sneaky-backup` post requests to `/files/` inside the docker container.

# Init

The project requires the following env variables to be set

```
export GITEA_DOMAIN=
export GITEA_TOKEN=
export GHOST_DOMAIN=
export GHOST_TOKEN=
export WIKI_DOMAIN=
```

