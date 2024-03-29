// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import * as path from 'path';

import { config } from 'dotenv';
const ENV_FILE = path.join(__dirname, '..', '.env');
config({ path: ENV_FILE });

import * as restify from 'restify';

// Import required bot services.
// See https://aka.ms/bot-services to learn more about the different parts of a bot.
import { BotFrameworkAdapter } from 'botbuilder';

// This bot's main dialog.
import { EchoBot } from './bot';
import { AppInsights } from './Common/AppInsights';


// Create HTTP server.
const server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, () => {
    console.log(`\n${server.name} listening to ${server.url}`);
    console.log('\nGet Bot Framework Emulator: https://aka.ms/botframework-emulator');
    console.log('\nTo talk to your bot, open the emulator select "Open Bot"');
});

// Create adapter.
// See https://aka.ms/about-bot-adapter to learn more about adapters.
const adapter = new BotFrameworkAdapter({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword
});

// Catch-all for errors.
const onTurnErrorHandler = async (context: any, error: any) => {
    AppInsights.instance.logException(`\n [onTurnError] unhandled error: ${JSON.stringify(error)}`);

    // Send a trace activity, which will be displayed in Bot Framework Emulator
    await context.sendTraceActivity(
        'OnTurnError Trace',
        `${error}`,
        'https://www.botframework.com/schemas/error',
        'TurnError'
    );

    // Send a message to the user
    await context.sendActivity('The bot encountered an error or bug.');
    await context.sendActivity('To continue to run this bot, please fix the bot source code.');
};

// Set the onTurnError for the singleton BotFrameworkAdapter.
adapter.onTurnError = onTurnErrorHandler;

// Create the main dialog.
const myBot = new EchoBot();

// Listen for incoming requests.
server.post('/api/messages', (req, res, next) => {
    adapter.processActivity(req, res, async context => {
        // Route to main dialog.
        await myBot.run(context);
    });
});

// [OPTIONAL]
// When deploying azure usually pings the web app server to know the status. The request can be ignored or answered, depending
// on the implementation. In my case it was logging the errors so I prefer to just reply to the request.
server.get('/', (req, res, next) => {
    res.send(200);
    next();
});

// Listen for Upgrade requests for Streaming.
server.on('upgrade', (req, socket, head) => {
    // Create an adapter scoped to this WebSocket connection to allow storing session data.
    const streamingAdapter = new BotFrameworkAdapter({
        appId: process.env.MicrosoftAppId,
        appPassword: process.env.MicrosoftAppPassword
    });
    // Set onTurnError for the BotFrameworkAdapter created for each connection.
    streamingAdapter.onTurnError = onTurnErrorHandler;

    // https://github.com/microsoft/BotBuilder-Samples/pull/3407 recommends sticking with
    // "@types/node": "^10.17.27" but I require a new version for appInsights so 
    // adding this 'unsafe cast' (TODO: update this with latest recommendations.)
    streamingAdapter.useWebSocket(req, socket as any, head, async context => {
        // After connecting via WebSocket, run this logic for every request sent over
        // the WebSocket connection.
        await myBot.run(context);
    });
});
