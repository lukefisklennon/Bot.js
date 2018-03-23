# Bot.js *beta*

[![Invite bot](https://img.shields.io/badge/bot-invite-7289DA.svg)](https://discordapp.com/oauth2/authorize?client_id=426235733594996748&scope=bot)

Bot.js is a Discord bot that allows you to define custom commands with JavaScript snippets. It exposes the Discord API so you can build a fully-featured bot simply by sending code in the chat.

The project is in beta, so it's missing some features like permissions and web access, but they're coming soon! You can help contributing by submitting a pull request.

## Installing

Add the hosted bot to your server: [invite](https://discordapp.com/oauth2/authorize?client_id=426235733594996748&scope=bot)

### Self-hosted

Running the bot requires Node.js (includes npm). You can install it [here](https://nodejs.org/en/download/).

This guide is for Terminal users, but you can complete the installation using any alternate method. If you're having trouble [file an issue](https://github.com/iONinja/Bot.js/issues/new).

  1. Download the repository
  
  ```bash
  git clone https://github.com/iONinja/Bot.js.git
  ```
  2. Install the packages
  
  ```bash
  cd Bot.js
  npm install
  ```
  
  3. Run the server
  
  ```bash
  node index.js <your api key>
  ```
  
  **Note**: connecting to Discord requires a bot user private API key. You can get a Discord application [here](https://discordapp.com/developers/applications/me/create). 

## Usage

Find the documentation [here](https://github.com/iONinja/Bot.js/blob/master/usage.md) (coming soon).

## License

MIT License

Copyright (c) 2018 iO Ninja

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
