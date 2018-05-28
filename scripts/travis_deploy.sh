#!/bin/bash

# Ignore pull request
if ! [ "${TRAVIS_PULL_REQUEST}" == "false" ]; then
    echo '[Travis Build] Pull request found ... exiting...'
    exit
fi

# Ignore non rc branch
if ! [ "${TRAVIS_BRANCH}" == "${DFID_RC_BRANCH}" ]; then
    echo "Non Rc Branch: ${TRAVIS_BRANCH}, current RC branch: ${DFID_RC_BRANCH} ...exiting...";
    exit
fi


BASE_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )" # /code/scripts/
ROOT_DIR=$(dirname "$BASE_DIR") # /code/

set -xe;
echo "::::::  >> Generating Reacts Builds"
    python -c "import fcntl; fcntl.fcntl(1, fcntl.F_SETFL, 0)"
    docker run -t -v ${ROOT_DIR}/build:/code/build \
        devtc/dfid:latest bash -c 'yarn install && CI=false yarn build && mv build/index.html build/200.html'
        # --env-file=${CLIENT_DIR}/.env
set +xe;

#cd ${ROOT_DIR}/build
#python -c "import fcntl; fcntl.fcntl(1, fcntl.F_SETFL, 0)"
#surge -d dfid.surge.sh
