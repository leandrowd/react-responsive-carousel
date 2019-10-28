# Contributing

Found a bug? Want a new feature? Don't like the docs? Please send a pull request or raise an issue. 

## Raising issues
When raising an issue, please add as much details as possible. Screenshots, video recordings, or anything else that can make it easier to reproduce the bug you are reporting.

* A new option is to create a code pen with the code that causes the bug. Fork this [example](https://www.webpackbin.com/bins/-Kxr6IEf5zXSQvGCgKBR) and add your code there, then fork and add the new link to the issue.


## Creating Pull Requests
Pull requests are always welcome. To speed up the review process, please ensure that your pull request have:

- A good title and description message;
- Recommended that each commit follows the commit message format #{issueId}: {commitDescriptionj}
- Tests covering the changes;
- Story (storybook) if it's a new feature;
- Green builds;

In order to send a Pull Request, you will need to setup your environment - check instructions below;

## How to setup the development environment
Fork and clone the repo:
- `git clone git@github.com:leandrowd/react-responsive-carousel.git`

Ensure you have the right node version:
- `nvm use` # or `nvm install` in case the right version is not installed. Find the right version looking at the `.nvmrc` file.

Install dependencies:
- `yarn install`

Start the dev server:
- `yarn start`

Run the tests: 
- `yarn test`

Format the files: 
- `yarn format:write` # this will also run as part of the pre-commit hook. CI will fail the build if unformatted files are pushed.

Develop on storybooks (optional):
- `yarn storybook`
