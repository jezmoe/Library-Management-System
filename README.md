## Prerequisites
- Node V21+
- Nginx

`npm install` in the `frontend` and `backend` folders

Open these ports:
- Port 80 - HTTP
- Port 3000 - Backend for DB
- Port 5432 - DB port

## Starting the project
Must be on a unix system

Start using
```
./deploy.sh
```

Nginx has to exist and point to `./frontend/dist/index.html`

Stop DB and wipe it using
```
./stop.sh
```