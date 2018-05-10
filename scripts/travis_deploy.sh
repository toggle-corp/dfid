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

set -e;
echo "::::::  >> Generating Reacts Builds"
python -c "import fcntl; fcntl.fcntl(1, fcntl.F_SETFL, 0)"
docker run -t -v ${ROOT_DIR}/build:/code/build \
    # --env-file=${CLIENT_DIR}/.env \
    devtc/dfid:latest bash -c 'yarn install && CI=false yarn build'
set +e;

cd ${ROOT_DIR}/build
mv index.html 200.html
surge -d dfid.surge.sh
