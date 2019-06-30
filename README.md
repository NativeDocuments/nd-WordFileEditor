# nd-WordFileEditor

Use this project to easily get Word File Editor running in your web browser. 

This nd-WordFileEditor project is a react/typescript project which also allows you to customise Native Documents'
Word File Editor.

## Pre-requisites

You'll need Node.js, which you can install on Linux, Windows, or macOS.

You'll also need to git clone this project.

## Conceptual overview / pathways

Running this project starts a proxy which forwards all requests to the specified Word File Editor server. 

Where you haven't configured this, it defaults to https://canary.nativedocuments.com.

This means you can easily start playing with the editor, without needing to install a server.

When you are ready to install your own server, you can easily do so using either docker or our AWS CloudFormation template.

## Dev id, secret and license URL

You'll need some credentials.  To get these, please register and log in at https://developers.nativedocuments.com/ 

After registering/logging in, in the middle of the page you will see:  *Request a 3 month eval license for the Word File Editor docker containers*.

Click the "request" link, and you will get a matching pair + license URL.  Save these to a safe place.

You need the dev id and secret to get started, and you will need the license URL later if/when you choose to install your own server.  

## Installation

Just run `npm install`

## Start the local proxy

After npm install, you can start the local proxy with:

```
npm start -nd-dev-id="${ND_DEV_ID}" -nd-dev-secret="${ND_DEV_SECRET}" 
```

where **${ND_DEV_ID}** and **${ND_DEV_SECRET}** are the values you got at https://developers.nativedocuments.com/  (see above)

Alternatively, you create a config file in a .ndapi dir in your home directory.  The default file is `~/.ndapi/config` (Linux) or `C:\Users\[USERNAME]\.ndapi` (Windows), for example:

```json
{
  "dev_id": "YOUR DEV ID GOES HERE",
  "dev_secret": "YOUR DEV SECRET GOES HERE"
}
```

With that, you can just type:

```
npm start 
```

You can also define a named profile.  For example, a profile named 'jason' would be defined in a 
profile named config.jason (in the .ndapi dir).

To start the project using that profile:

```
npm start --nd-user=jason
```

## Loading a Word document

Once you have npm started the local proxy, you can visit http://127.0.0.1:8888 in your browser. 

That'll allow you load a document interactively to view it.

But to edit, you need to provide an author token.  To get this, upload a file:

```
curl -X POST -H "X-ND-DEV-SECRET: ${ND_DEV_SECRET}" --data-binary @'sample.docx' ${ND_SERVICE_URL}/v1/DEV${ND_DEV_ID}00000000000000000000000000000000000000000000000000000000/upload 
```
where **${ND_SERVICE_URL}** is http://127.0.0.1:8888.  (If/when you run your own server, you'll use its address instead)

(On Windows, use curl.exe; you might need to install it first)

The response will be something like:

```
{"nid":"5597GAP8E2C5KVA04GH4N9CD36PM7000000000000000000000000000300EQOGG20ICUI4B2JD62EHC60000",
"author":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoiTmF0aXZlIERvY3VtZW50cyIsIm5pY2tuYW1lIjoibmQifQ.w5bgaJk3L3KzF71ESpKkStcGAaBXAYcmCFCmw5VRhWQ",
"rid":"H2"}
```

Notice the nid value (hereinafter **${NID}**) and author value **${AUTHOR_TOKEN}**

To edit your document, you just open the following URL:

```
http://127.0.0.1:8888/edit/${NID}?author=${AUTHOR_TOKEN}
```

## Editing features

The editor includes the following basic functionality:

- change tracking (redlining of deletions and insertions)
- multi-level undo/redo (Ctrl-Z and Ctrl-Y on Windows)
- copy/paste
- find
- zoom in/zoom out
- navigation hotkeys (cursor keys, PgUp/PgDown, Home/End, Ctrl-Left, Ctrl-Right)

together with advanced features around annotations/comments.

## Exporting your document

Your changes are continuously saved as you type.

To get the current document at any time in Word format: 

```
curl -o out.docx -X GET -H "X-ND-DEV-SECRET: ${ND_DEV_SECRET}" "${ND_SERVICE_URL}/v1/DEV${ND_DEV_ID}00000000000000000000000000000000000000000000000000000000/document/${NID}/?format=application/vnd.openxmlformats-officedocument.wordprocessingml.document"
```

Notice the format parameter.  Other values for that:

- save as PDF
- save as plain text
- save as rich text (JSON format)

To get pdf:

```
curl -o out.pdf -X GET -H "X-ND-DEV-SECRET: ${ND_DEV_SECRET}" ${ND_SERVICE_URL}/v1/DEV${ND_DEV_ID}00000000000000000000000000000000000000000000000000000000/document/${NID}/?format=application/pdf 
```

To get plain text (useful for NLP):

```
curl -o out.txt -X GET -H "X-ND-DEV-SECRET: ${ND_DEV_SECRET}" "${ND_SERVICE_URL}/v1/DEV${ND_DEV_ID}00000000000000000000000000000000000000000000000000000000/document/${NID}/?format=application/vnd.nativedocuments.raw.text%2Btext"
```

To get rich text (JSON):

```
curl -o out.json -X GET -H "X-ND-DEV-SECRET: ${ND_DEV_SECRET}" "${ND_SERVICE_URL}/v1/DEV${ND_DEV_ID}00000000000000000000000000000000000000000000000000000000/document/${NID}/?format=application/vnd.nativedocuments.raw.json%2Bjson"
```

## Recommended next steps

- Install and use your own server (Docker containers)
- Integrate our editor into your application