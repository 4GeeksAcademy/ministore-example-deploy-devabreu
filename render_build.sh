#!/usr/bin/env bash
# exit on error
set -o errexit

# Frontend build
npm install
npm run build

# Install pipenv and project dependencies
python -m pip install pipenv
python -m pipenv install --deploy

# Run database migrations / upgrades
python -m flask db merge heads -m "merge multiple heads"
python -m pipenv run upgrade