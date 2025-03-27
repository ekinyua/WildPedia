#!/bin/bash

# Create a new database
psql -U postgres -c "CREATE DATABASE biodiversity_db;"
psql -U postgres -d biodiversity_db < 01-types.sql
psql -U postgres -d biodiversity_db < 02-tables.sql
psql -U postgres -d biodiversity_db < 03-data.sql
psql -U postgres -d biodiversity_db < 04-constraints.sql
psql -U postgres -d biodiversity_db < 05-import-species.sql
psql -U postgres -d biodiversity_db < 06-species-details.sql