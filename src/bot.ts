// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { ActivityHandler, MessageFactory } from 'botbuilder';
import { MessageController} from './Controllers/MessageController'

export class EchoBot extends ActivityHandler {
    private _messageController: MessageController;

    constructor() {
        super();
        this._messageController = new MessageController();
        // See https://aka.ms/about-bot-activity-message to learn more about the message and other activity types.
        this.onMessage(async (context, next) => {

            await this._messageController.parse(context)
            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });

        this.onMembersAdded(async (context, next) => {
            if(!context.activity.membersAdded){
                return ;
            }

            const membersAdded = context.activity.membersAdded;
            const welcomeText = 'Hi there, I\'m otterbrass reloaded';
            for (const member of membersAdded) {
                if (member.id !== context.activity.recipient.id) {
                    await context.sendActivity(MessageFactory.text(welcomeText, welcomeText));
                }
            }
            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });
    }
}
