#!/bin/bash

# /code/scripts/
BASE_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
# /code/
ROOT_DIR=$(dirname "$BASE_DIR")

cd $ROOT_DIR

yarn add --force node-sass@4.7.2
yarn start

