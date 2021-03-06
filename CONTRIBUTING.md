# Contributing

There are several ways in which you can contribute to the project:

1. **Log bugs or file feature suggestions**. To do this, simply file the bugs/suggestions in the Issues tab on GitHub for this project.
2. **Code samples**.  To suggest edits to existing samples, or to suggest your own, please submit a pull request against the Samples repo: **<https://github.com/OfficeDev/script-lab-samples>**.
3. **Bug-fix/feature contributions**.  If you have features or bug fixes that you'd like to see incorporated into the playground, just send us your pull request!


# Running the playground from source

## Prereq:

* Download & Install Visual Studio Code.  <https://code.visualstudio.com/>.  If you don't have a recent version, please update to latest (1.11 at time of writing)
  * I would also recommend installing the `TSLint` extension, which adds lint warnings straight into the editor.
* Download & install Node, version 6.9+.  <https://nodejs.org/en>.
* Download & install Yarn, for use as an alternative for `npm install`.  Download from  <https://yarnpkg.com/en/docs/install>.  The documentation also describes why Yarn is preferable to `npm install`.
* Install `nodemon` for global use, using
~~~
    yarn global add nodemon
~~~



## Build steps:

1. Clone the repo
2. Open the root of the repository with VS Code.  (**File --> Open Folder...**)
![alt text](.github/images/vs-code-open-folder.jpg)

3. Open the terminal from within VS Code (**View --> Integrated Terminal**)
![alt text](.github/images/vs-code-terminal.jpg)

4. In the terminal, type in `yarn install` and wait for all of the packages to be downloaded (this may take a few minutes).  The command prompt will return the control back to you once it's done.

5.	Run `npm start` in the terminal (or `ctrl+shift+b` and select `start` in the dropdown).  The process may pause for a few seconds, and you may see messages like "compilation complete"; but don't believe it!  You'll know that it's finally done when the web browser launches to https://localhost:3000, and when you see the following appear in the terminal:

~~~
[BS] Proxying: https://localhost:3100
[BS] Access URLs:
 --------------------------------------
       Local: https://localhost:3000
    External: https://10.82.217.77:3000
 --------------------------------------
          UI: http://localhost:3001
 UI External: http://10.82.217.77:3001
 --------------------------------------
~~~

6.	Trust the certificates for both <https://localhost:3000> and <https://localhost:3100>.  For purposes of running add-ins on a PC, do this within Internet Explorer. See the gif below for a step-by-step animation:

![](.github/images/trust-ssl-internet-explorer.gif).

7.  Start the runner (server) by pressing `F5` within VS Code.  If you get an error that `nodemon` is not installed, be sure that you've installed it globally `yarn global add nodemon`, and that Node is part of your path.

The website is now running.  To try it out in an Add-in, see the next section.


## Testing inside of an add-in

1. Locate the add-in manifest (which you'll find in the `manifests` folder in the root of the repo).  For purposes of running against localhost, use `script-lab-local.xml`.

2. Sideload the manfiest into your office host application.  See <https://dev.office.com/docs/add-ins/testing/create-a-network-shared-folder-catalog-for-task-pane-and-content-add-ins>, which includes instructions and a step-by-step video for sideloading on the desktop, as well as links for the other platforms.


## General structure

The project consists of two separate components: the client (editor) and the server (runner).  When run -- both on a dev machine, and in production -- they run on two separate URLs.  That way, a running snippet can never get the localStorage data (snippets, auth tokens, etc.) of the actual playground.

At the root level of the repo, the folders of interest (and skipping over the others) are:

* `client`: This is the playground editor UI.
* `config`: Configuration related to webpack & deployment
* `dist`: The generated files for `client` and `server` (it has subfolders for each), which are the compiled and minified html/js/css/etc. (TODO: Add why generate and check in, and which commands generate these files)
* `manifests`: Add-in manifests (both localhost and production) for side-loading the Add-in into Office applications.
* `node_modules`: The folder with all the node module dependencies that get installed as part of `yarn install`.
* `server`: A stateless Node backend that receives a POST request with the snippet's HTML, TypeScript, CSS, and Libraries, and creates a web-browser-servable web page out of them. The server makes extensive use of [Handlebars.js](http://handlebarsjs.com/) for templates, which are located in the `server/templates` directory.
* `typings`: Type definitions for a few of the libraries.

There are also files related to Azure deployment, git ignores, a Travis configuration for continuous-integration, a package.json with the project's metadata, TypeScript configuration files for client and server, a linter configuration, and etc.  And of course, the project's README.


## Enabling auth for local testing
1. Go to <https://github.com/settings/developers>, and click "[Register new application](https://github.com/settings/applications/new)" if you haven't done it before for your own dev copy of ScriptLab.
2. Give it a name like "ScriptLab Local Dev", with a Homepage and Auth callback URL of `https://localhost:3000`.
3. In `config/env.config.js`, find the `const config = { ... ` line, and under `local: { ...`, find `clientId: ''`, and replace with `clientId: '<id-from-github>'`.
4. In `server/server.ts`, find `client_secret: secrets ? secrets[env] : '',`, and replace it with `secrets ? secrets[env] : '<client-secret-from-github>'`.
5. Once you are done with your testing, **be sure to undo both changes!**.


# Manual-testing scenarios

* Create a snippet -- both "new" and from a sample
* Import someone else's snippet
  * From YAML
  * From Gist (incl. old-style)
  * From Non-GitHub URL **[Currently doesn't work, [Issue #146](https://github.com/OfficeDev/script-lab/issues/146)]**.
* Run snippet, in both in-editor runner (Office 2016 RTM and earlier, or online, or via tweaking the manifest to remove `command=true`) and via the "Run" button (`run.html`), testing that:
  * Snippet renders correctly
  * "Run" from editor or run gallery, in-place refresh, and full refresh all work correctly (render the snippet, don't double-refresh, etc.). The run (either type) doesn't show a "snippet needs reloading" message if the snippet is already fresh.
  * Console log renders correctly (and scrolls correctly, if many lines)
  * Erroneous code (e.g, syntax error) shows error correctly.
  * Running deleted snippet has reasonable behavior.
  * [Side-by-side runner]:
    * Edit to code causes runner want to refresh.
    * Whether starting from error or going to error state and back out, should act correctly.
* Sharing:
  * Copying to clipboard works
  * Can share as gist


# Tips & tricks

* There are two `package.json` files, one at the global level (for the client), and one inside of `src\server`. This can lead to differences in behavior between `localhost` and the deployed site, so be careful (e.g., if add one dependency in one place that should be shared, add it in both!). Their version numbers should also be bumped in synchrony.
* On IE, `console.log` in the runner won't display anything in FirebugLite **if F12 tools are open**.  It works fine if they're closed.
