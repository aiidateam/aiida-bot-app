/**
 * This is the main entrypoint to your Probot app
 * @param {import('probot').Application} app
 */
require('dotenv').config()
const { Octokit } = require("@octokit/rest");

const KNOWN_COMMANDS = ['run-ci', 'update-requirements'];

module.exports = app => {
  app.on('issue_comment.created', async context => {
      app.log('issue comment created')

      const isPullRequest = 'pull_request' in context.payload['issue'];

      const regex = /^\/([a-z-]+)(\b .*)?/
      const match = context.payload['comment']['body'].match(regex)

      if (isPullRequest && match && KNOWN_COMMANDS.includes(match[1])) {
        let pr = await context.github.pulls.get(context.issue());
        const head_ref = pr['data']['head']['ref']

        const octokit = new Octokit({auth: process.env.PERSONAL_ACCESS_TOKEN})

        dispatch = context.repo()
        dispatch['event_type'] = match[1] + '-command';
        dispatch['client_payload'] = { head_ref: head_ref };

        dispatch_request = octokit.repos.createDispatchEvent(dispatch);

        const issueComment = context.issue({ body :
          "Starting '" + match[1] + "' workflow for this branch."});

        return dispatch_request, context.github.issues.createComment(issueComment);
      }
    })
  //
  // app.on('issues.opened', async context => {
  //   const issueComment = context.issue({ body: 'Thanks for opening this issue!' })
  //   return context.github.issues.createComment(issueComment)
  // })

  // For more information on building apps:
  // https://probot.github.io/docs/

  // To get your app running against GitHub, see:
  // https://probot.github.io/docs/development/
}
