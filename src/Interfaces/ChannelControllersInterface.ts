import { Activity, Mention } from 'botbuilder';

export interface ChannelControllersInterface {
    createReply(replyText: string, myObject: Activity): Promise<string>;
    createReplyWithMention(replyText: string, myObject: Activity, entity: Mention): Promise<string>;
}