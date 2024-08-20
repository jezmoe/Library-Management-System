pg_ctl -D ./db-data stop
rm -r ./db-data
pg_ctl -D ./db-data init -o"--username=postgres"
pg_ctl -D ./db-data start
