
import {ChannelControllersInterface} from '../Interfaces/ChannelControllersInterface';
import { Activity, Entity } from 'botbuilder';
import { Utilities } from '../Common/Utilities';

export class TeamsChannelController implements ChannelControllersInterface
{
    private static _myLazyController: TeamsChannelController;

    private static readonly myLazyController = () => {
        if(!TeamsChannelController._myLazyController) {
            TeamsChannelController._myLazyController = new TeamsChannelController();
        }

        return TeamsChannelController._myLazyController;
    }

    /**
     * Initializes a new instance of the <see cref="TeamsChannelController"/> class.
     */
    private TeamsChannelController()
    {
        return;
    }

    /**
     * Gets a singleton instance of the HttpController class.
     */
    public static instance(): ChannelControllersInterface
    {
        return TeamsChannelController.myLazyController();
    }

    /**
     * Creates a reply that will be sent to the user.
     * @param replyText The text that will be sent.
     * @param myObject The object that will be used as template for the respones
     * @returns The reply from the controller.
     */
    public async createReply(replyText: string, myObject: Activity): Promise<string>
    {
        // {0} serviceUrl, {1} conversationId, {2} activityIds
        const activity = Utilities.getTemplateActivity(myObject, replyText);
        const replyAddress = `${myObject.serviceUrl}/v3/conversations/${myObject.conversation.id}/activities/${activity.replyToId}`;
        // TODO: verify this logic as it changed when migrated.
        // return await HttpController.Instance.PostAuthenticatedAsyncRequest(replyAddress, activity);
        return Promise.resolve('NOT REAL');
    }

    /**
     * Creates a reply that will be sent to the user, most likely you want to use this when you included
     * mention in the entities.
     * @param replyText The text that will be sent.
     * @param myObject The object that will be used as template for the respones.
     * @param entity The entity that will be included into the reply.
     * @returns The reply from the controller.
     */
    public async createReplyWithMention(replyText: string, myObject: Activity, entity: Entity): Promise<string>
    {
        const activity = Utilities.getTemplateActivity(myObject, replyText);
        const replyAddress: string = `${myObject.serviceUrl}/v3/conversations/${myObject.conversation.id}/activities/${activity.replyToId}`;
        activity.entities = [];
        activity.entities.push(entity);
        // TODO: verify this logic as it changed when migrated.
        // return await HttpController.Instance.PostAuthenticatedAsyncRequest(replyAddress, activity);
        return Promise.resolve('NOT REAL');
    }
}
