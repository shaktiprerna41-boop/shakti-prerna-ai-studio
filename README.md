# Shakti Prerna AI Studio

A small web app with a private server-side OpenAI API integration.

## Requirements
- Node.js 20+
- An OpenAI API key with API billing enabled

## Run locally
1. Extract the ZIP.
2. Open a terminal in this folder.
3. Run `npm install`.
4. Copy `.env.example` to `.env`.
5. Put your API key in `.env` as `OPENAI_API_KEY=...`.
6. Run `npm start`.
7. Open `http://localhost:3000`.

## Security
- The API key is read only by `server.js`; it is never sent to the browser.
- Do not upload `.env` to GitHub or share it.
- For public hosting, set `OPENAI_API_KEY` and `OPENAI_MODEL` as hosting-provider environment variables.
- Add rate limiting, authentication, and usage limits before making this public.

## Model
The default model is configured in `.env` as `gpt-5.5`. If your API account does not have access to that model, replace it with a model available to your API account.

## What it does
- Includes a web-search-powered public topic research endpoint (not private YouTube Studio analytics).\n- Creates a title, hook, script, scene prompts, thumbnail prompt, SEO description, tags, pinned comment, and fact-check notes.
- Does not fetch live YouTube trends or directly modify your YouTube channel.


## Install on iPhone as an app
After deploying the Node app to an HTTPS host:
1. Open the deployed HTTPS URL in Safari on iPhone.
2. Tap Share.
3. Choose "Add to Home Screen".
4. Turn on "Open as Web App" if shown, then tap Add.

The PWA shell can cache the app interface. AI generation and web research still need an internet connection and a running server.
