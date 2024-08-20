#!/bin/sh
./stop.sh
pg_createcluster 12 main --port=5432 -- --auth=trust
pg_ctlcluster 12 main start
cd ./frontend 
npm run build
cd ..
cd ./backend
npm install
node endpoints.js
