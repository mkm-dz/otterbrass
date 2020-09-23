
import {ChannelControllersInterface} from '../Interfaces/ChannelControllersInterface';
import { Activity, Entity, TurnContext, MessageFactory } from 'botbuilder';
import { Utilities } from '../Common/Utilities';

export class TeamsChannelController implements ChannelControllersInterface
{
    private static _myLazyController: TeamsChannelController;
    private context: TurnContext;

    private static readonly myLazyController = (context: TurnContext) => {
        if (!TeamsChannelController._myLazyController) {
            TeamsChannelController._myLazyController = new TeamsChannelController(context);
        }

        TeamsChannelController._myLazyController.context = context;
        return TeamsChannelController._myLazyController;
    }

    /**
     * Initializes a new instance of the <see cref="TeamsChannelController"/> class.
     */
    private constructor(context: TurnContext)
    {
        this.context = context
    }

    /**
     * Gets a singleton instance of the HttpController class.
     */
    public static instance(context: TurnContext): ChannelControllersInterface
    {
        return TeamsChannelController.myLazyController(context);
    }

    /**
     * Creates a reply that will be sent to the user.
     * @param replyText The text that will be sent.
     * @param myObject The object that will be used as template for the respones
     * @returns The reply from the controller.
     */
    public async createReply(replyText: string, myObject: Activity): Promise<void>
    {
        // {0} serviceUrl, {1} conversationId, {2} activityIds
        const activity = Utilities.getTemplateActivity(myObject, replyText);
        await this.context.sendActivity(activity);
    }

    /**
     * Creates a reply that will be sent to the user, most likely you want to use this when you included
     * mention in the entities.
     * @param replyText The text that will be sent.
     * @param myObject The object that will be used as template for the respones.
     * @param entity The entity that will be included into the reply.
     * @returns The reply from the controller.
     */
    public async createReplyWithMention(replyText: string, myObject: Activity, entity: Entity): Promise<void>
    {
        const activity = Utilities.getTemplateActivity(myObject, replyText);
        activity.entities = [];
        activity.entities.push(entity);
        await this.context.sendActivity(activity);
    }
}
