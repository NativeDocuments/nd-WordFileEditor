# nd-WordFileEditor

nd-WordFileEditor is a react/typescript project which allows you to customise Native Documents'
Word File Editor.

Word File Editor is configured/customised by an app.js file which the browser loads on startup.

So this project provides an app.js file.

It also provides a host.js file which can be used to serve WFE in an iframe.  host.html is an example of doing so. 

# npm start

The project needs a config file containing something like:

```json
{
  "service_url": "https://YOUR.HOST.com",
  "dev_id": "7BDVM9ZZZAIMAUI487AB49QUQS",
  "dev_secret": "14D70ZZNG00ER5PS8661VDF9BH",
  "api_ver": "DEV"
}
```

dev_id and dev_secret you get from https://developers.nativedocuments.com/ 

service_url points at your Word File Editor server (ie if on-prem, your WFE docker containers). This needs to be a URL accessible via https, or 127.0.0.1 (if you are running the docker containers on your local dev machine)

The code looks for a config file in a .ndapi dir in your home directory.

The default file is `~/.ndapi/config` (Linux) or `C:\Users\[USERNAME]\.ndapi` (Windows)

# npm start --nd-user=jason

You can define a named profile.  For example, a profile named 'jason' would be defined in a 
profile named config.jason (in the .ndapi dir).

To start the project using that profile:

```
npm start --nd-user=jason
```

Having started it, you should see something like:

```
> sample-plugin@0.1.0 start /bvols/@git/repos/nd-public-WordFileEditor
> webpack-dev-server --config webpack.development.js --no-inline --watch

[ND] Loading config from "/home/jason/.ndapi/config.jason". Use --nd-user to override the user.
ℹ ｢wds｣: Project is running at http://127.0.0.1:8080/webpack-dev-server/
ℹ ｢wds｣: webpack output is served from /
ℹ ｢atl｣: Using typescript@3.2.2 from typescript
ℹ ｢atl｣: Using tsconfig.json from /bvols/@git/repos/nd-public-WordFileEditor/tsconfig.json
ℹ ｢atl｣: Checking started in a separate process...
ℹ ｢atl｣: Time: 2830ms
ℹ ｢wdm｣: Hash: 002e74dd6e9f8db4359e
Version: webpack 4.20.2
Time: 4765ms
Built at: 2019-03-29 21:22:03
      Asset      Size  Chunks             Chunk Names
     app.js  54.1 KiB     app  [emitted]  app
    host.js   6.6 KiB    host  [emitted]  host
 app.js.map  75.3 KiB     app  [emitted]  app
host.js.map  9.61 KiB    host  [emitted]  host
Entrypoint app = app.js app.js.map
Entrypoint host = host.js host.js.map
[./host/host.ts] 2.82 KiB {host} [built]
[./node_modules/timers-browserify/main.js] 1.85 KiB {app} [built]
[./node_modules/webpack/buildin/global.js] (webpack)/buildin/global.js 895 bytes {app} [built]
[./src/app.js] 6.37 KiB {app} [built]
[./src/ui/CustomPostIt.tsx] 2.59 KiB {app} [built]
[./src/ui/RootDialog.tsx] 1.74 KiB {app} [built]
[./src/ui/SearchDialog.tsx] 7.37 KiB {app} [built]
[./src/ui/WordCommentPostIt.tsx] 3.24 KiB {app} [built]
[./src/ui/ZoomDialog.tsx] 3.16 KiB {app} [built]
[./src/ui/zoomIn.svg] 1.14 KiB {app} [built]
[./src/ui/zoomOut.svg] 981 bytes {app} [built]
[./src/ui/zoomWidth.svg] 2.44 KiB {app} [built]
[@babel/polyfill] external "window.ndapi.exports.babel.polyfill" 42 bytes {app} [built]
[NDAPI] external "window.ndapi" 42 bytes {app} [built]
[react] external "window.ndapi.exports.React" 42 bytes {app} [built]
    + 2 hidden modules
ℹ ｢wdm｣: Compiled successfully.
```

npm start runs a web server serving app.js at http://127.0.0.1:8080/app.js and host/host.html

The easiest thing to do first is to visit http://127.0.0.1:8080/host/host.html

There you can drag/drop a docx and see it in the editor in view mode in an iframe.  If you look
at the iframe's @source, you will see something like:

```
src="https://YOUR.HOST.com/editService/aHR0cDovLzEyNy4wLjAuMTo4MDgwL2FwcC5qcw?nid=DEV7BDVM9ZZZAIMAUI487AB49QUQS000000000000000000000000000362KC0GG2BQ8EI4BKAADDJRSU0000"
```

You can open that editService URL in your web browser.  (notice it adds DEVB to the path)

You can add &author=TODO to the URL to make it editable.
            
Notes: 

1.  generally you need to have POSTed the Word document (represented by the nid) to the server (we avoided that here by drag/dropping the document instead), and
1.  aHR0cDovLzEyNy4wLjAuMTo4MDgwL2FwcC5qcw is the base64 encoded URL pointing at where your app.js is running (in this case http://127.0.0.1:8080/app.js).   

# Packaging/release

To create an app.js which you can deploy to a server somewhere, execute:

```
npm install
npm run build --nd-user=[PROFILE NAME]
```

This will create a dir dist containing:

```
app.js  app.js.map  host.js  host.js.map
```

If you want to use host.js,  you'll find host.html in the host dir (its a static file).

If you deploy app.js, remember you need to use you need its base64 encoded location in your editService URL.

# Verifying your release

You can quickly verify a release build using `serve`
1. Make sure you have `serve` (https://www.npmjs.com/package/serve) installed: 
   ```
   npm install serve  
   ```
   or globally:
   ```
   npm install -g serve  
   ```
2. goto the `dist` directory and run serve on port 8080:
   ```
   dist> serve -p 8080
   ```
3. try the build using:
   https://YOUR.HOST.com/DEVB/editService/aHR0cDovLzEyNy4wLjAuMTo4MDgwL2FwcC5qcw?nid={NID}&author={AUTHOR}

Alternatively, the client will attempt to load a default app.js from the WFE server at /DEV/custom/app.js, so you can put it there and use a URL which is just /DEVB/?nid=...  for example:

```
https://YOUR.HOST.com/DEVB/?nid=DEV7BDVM9BGGAIMAUI487AB49QUQS000000000000000000000000000362KC0GG2AA8EI48AABEFSH2N0000&author=TODO
```

# Debugging

For serious development work we recommend you launch the editor in Chrome from vs Code.

You need a recent version of vs Code for this to work (for example, 1.31.1 or 1.32.1)

Start vs Code. 

Install the Chrome debugger if you don't have it already (Debug>Install Additional Debuggers..) then in the 
extensions marketplace, select "Debugger for Chrome" (v4.11.3 at the time of writing).

If necessary, specify the path to your Chrome executable using runtimeExecutable in .vscode/launch.json

launch.json is also where you specify the URL you want to see in Chrome.  For example:

```
            "url": "https://YOUR.HOST.com/editService/aHR0cDovLzEyNy4wLjAuMTo4MDgwL2FwcC5qcw?nid=DEV7BDVM9ZZZAIMAUI487AB49QUQS000000000000000000000000000362KC0GG2AA8EI48AABEFSH2N0000&author=TODO",
```

or
```
            "url": "http://127.0.0.1:8080/host/host.html",
```

(In the above ${config:nd.dev.key} reads its value from settings.json)            

Then press F5 or Debug > Start Debugging.  Be sure that the local webserver is running (npm start), otherwise Chrome will say "Error: Failed to load http://127.0.0.1:8080/app.js"

To stop debugging (be sure to do this before starting another debug session), simply close the Chrome Window.

# Editing requires that the Cache API is available

Editing makes use of the browser's Cache API

The cache API is only available in a secure context https://w3c.github.io/webappsec-secure-contexts ie HTTPS or 127.0.0.1

Without this, editing can not be enabled, and we fallback back to the viewer. 

For development purposes, you can start Chrome with `--disable-web-security` 

If you are using vs Code for debugging, you can configure that in launch.json.
