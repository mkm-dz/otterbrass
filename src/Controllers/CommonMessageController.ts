import { ChannelControllersInterface } from '../Interfaces/ChannelControllersInterface';
import { TeamsChannelController } from './TeamsChannelController';
import { Activity, Entity, Mention, ChannelAccount } from 'botbuilder';
import { Channel } from '../Models/Channel';
import { User } from '../Models/User';
import { Utilities } from '../Common/Utilities';
import { UserDao } from '../Dao/UserDao';
import { BotMessages } from '../Common/BotMessage';
import { EnumShirtSize } from '../Enums/EnumShirtSize';
import { ReviewDao } from '../Dao/ReviewDao';
import { Constants } from '../Common/Constants';

export class CommonMessagesController {
    private static _myLazyController: CommonMessagesController;

    private static readonly myLazyController = () => {
        if (!CommonMessagesController._myLazyController) {
            CommonMessagesController._myLazyController = new CommonMessagesController();
        }

        return CommonMessagesController._myLazyController;
    };

    private channelControllerInstance: ChannelControllersInterface = TeamsChannelController.instance();

    /**
     * Gets a singleton instance of the CommonMessagesController class.
     */
    public static instance(): CommonMessagesController {
        return CommonMessagesController.myLazyController();
    }


    public async addUser(activity: Activity): Promise<void> {
        if (!activity) {
            return;
        }

        // TODO: verify this logic as it changed when migrated.
        const channel = new Channel();
        const channelData = JSON.parse(activity.channelData)
        const entities = activity.entities;

        channel.name = activity.channelId;
        channel.id = channelData.teamsChannelId;

        let users = Utilities.CreateUsersFromModel(entities, true);

        // In case the user specified he wants to add himself.
        const addSelfPattern = '(.*)(\\[)(add)(\\])(.*)(\\[)(self)(\\])(.*)';
        const userSelf = Utilities.GetUserFromRegex(addSelfPattern, activity.text, activity.from.name, activity.from.id);

        if (null != userSelf) {
            const tempList = new Array<User>();
            tempList.push(userSelf);
            if (null == users) {
                users = new Array<User>();
            }

            // TODO: verify this logic as it changed when migrated.
            users = { ...users, ...tempList };
        }

        let replyMsg = '';
        if (users) {
            for (const user of users) {
                // We skip ourselves.
                if (Utilities.filterOtterBrassUser(user)) {
                    continue;
                }

                replyMsg += user.name + ', ';
                user.userChannel = channel;
                const userDao = new UserDao();
                userDao.addUser(user);
            }
        }

        if (!replyMsg) {
            // No user was specified or mentioned.
            await this.channelControllerInstance.createReply(BotMessages.BAD_USER_SPECIFIED, activity);
        }
        else {
            // User was successfully added.
            await this.channelControllerInstance.createReply(BotMessages.USER_ADDED_SUCCEEDED + replyMsg, activity);
        }
    }

    /**
     * Get the next user in line in the channel.
     * @param activity The activity that contains the request information.
     * @param size The size of the item that will be assigned to the user.
     */
    public async getNext(activity: Activity, size: EnumShirtSize): Promise<User | null> {
        if (!activity) {
            Promise.resolve(null);
        }

        // TODO: verify this logic as it changed when migrated.
        const channel = new Channel();
        const channelData = JSON.parse(activity.channelData)
        channel.id = channelData.TeamsChannelId;
        const sentByUser = new User();
        sentByUser.id = activity.from.id;
        sentByUser.name = activity.from.name;
        sentByUser.userChannel = channel;

        const reviewDao = new ReviewDao();
        const user = reviewDao.nextInLine(channel, size, sentByUser);
        if (user && user.id && user.name) {
            const channelAccount: ChannelAccount = {
                id: user.id,
                name: user.name
            }

            // TODO: verify this logic as it changed when migrated.
            const mention: Mention = {
                text: `<at> ${user.name} </at>`,
                mentioned: channelAccount,
                type: Constants.MENTION
            }

            await this.channelControllerInstance.createReplyWithMention(BotMessages.NEXT_IN_LINE.replace('{0}', user.name), activity, mention);
            return user;
        }
        else {
            // For some reason the user was not found in the message, most likely something wrong on our side
            // or all the users are OOF.
            await this.channelControllerInstance.createReply(BotMessages.INCORRECT_USER_SPECIFIED, activity);
            return null;
        }
    }
}