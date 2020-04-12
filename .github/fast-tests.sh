#!/bin/sh
curl -o- -L https://yarnpkg.com/install.sh | bash -s -- --version 1.22.4
yarn
yarn test