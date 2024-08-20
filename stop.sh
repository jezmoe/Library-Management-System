#!/bin/sh

pg_ctlcluster 12 main stop
pg_dropcluster 12 main