// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { ActivityHandler, MessageFactory } from 'botbuilder';
import { AppInsights } from './Common/AppInsights';
import { MessageController} from './Controllers/MessageController'

export class EchoBot extends ActivityHandler {
    private _messageController: MessageController;

    constructor() {
        super();
        this._messageController = new MessageController();
        // See https://aka.ms/about-bot-activity-message to learn more about the message and other activity types.
        this.onMessage(async (context, next) => {
            
            try {
                await this._messageController.parse(context)
                // By calling next() you ensure that the next BotHandler is run.
                await next();
            } catch(error) {
                AppInsights.instance.logException(JSON.stringify(error));
            }
        });
    }
}
