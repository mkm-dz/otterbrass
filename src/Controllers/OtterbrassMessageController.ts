import { MessageControllerInterface } from '../Interfaces/MessageControllerInterface';
import { ChannelControllersInterface } from '../Interfaces/ChannelControllersInterface';
import { TeamsChannelController } from './TeamsChannelController';
import { CommonMessagesController } from './CommonMessageController';
import { Activity, TurnContext, Mention} from 'botbuilder';
import { EnumShirtSize } from '../Enums/EnumShirtSize';
import { User } from '../Models/User';
import { Channel } from '../Models/Channel';
import { Utilities } from '../Common/Utilities';
import { BotMessages } from '../Common/BotMessage';
import { ReviewDao } from '../Dao/ReviewDao';
import { EnumDaoResults } from '../Enums/EnumDaoResults';
import { EnumOofStatus } from '../Enums/EnumOofStatus';
import { UserDao } from '../Dao/UserDao';
import { EnumRandomOperations } from '../Enums/EnumRandomOperations';
import { Constants } from '../Common/Constants';

export class OtterBrassMessageController implements MessageControllerInterface {

    private static _myLazyController: OtterBrassMessageController;
    private context: TurnContext;
    private channelControllerInstance: ChannelControllersInterface;
    private _commonMessageController: CommonMessagesController;

    private static readonly myLazyController = (context: TurnContext) => {
        if (!OtterBrassMessageController._myLazyController) {
            OtterBrassMessageController._myLazyController = new OtterBrassMessageController(context);
        }

        OtterBrassMessageController._myLazyController.context = context;
        return OtterBrassMessageController._myLazyController;
    }

    /**
     * Initializes a new instance of the <see cref="OtterBrassMessageController"/> class.
     */
    private constructor(context: TurnContext) {
        this.context = context;
        this.channelControllerInstance = TeamsChannelController.instance(this.context);
        this._commonMessageController = CommonMessagesController.instance(this.context);
    }

    /**
     * Gets a singleton instance of the HttpController class.
     */
    public static instance(context: TurnContext): MessageControllerInterface {
        return OtterBrassMessageController.myLazyController(context);
    }

    /**
     * Add a user to the tracking backend.
     * @param activity The activity that contains all the parameters for adding the user.
     */
    public async addUser(activity: Activity) {
        await this._commonMessageController.addUser(activity);
    }

    /**
     * Get the next user in line in the channel.
     * @param activity The activity that contains the request information.
     * @param size The size of the item that will be assigned to the user.
     */
    public getNext(activity: Activity, size: EnumShirtSize): Promise<User | null> {
        return this._commonMessageController.getNext(activity, size);
    }

    /**
     * Assigns the item to the selected users.
     * @param activity The activity that contains the request information.
     * @param size The size of the item that will be assigned to the user.
     */
    public async assign(activity: Activity, size: EnumShirtSize): Promise<User[] | null> {
        if (!activity) {
            return null;
        }

        let usersAdded = '';
        let usersMissing = '';

        const channel = new Channel();
        if (activity.channelData && activity.channelData.teamsChannelId) {
            channel.id = activity.channelData.teamsChannelId
        } else {
            await this.channelControllerInstance.createReply(BotMessages.INCORRECT_INSTRUCTION_PRIVATE, activity);
            return null;
        }

        // Getting the mentions
        const entities = activity.entities;
        channel.name = activity.channelId;
        const users = Utilities.CreateUsersFromModel(entities, true);
        if (!users || users.length === 0) {
            await this.channelControllerInstance.createReply(BotMessages.MENTION_NOT_FOUND, activity);
            return null;
        }

        const reviewDao = new ReviewDao();
        const results: Map<User, EnumDaoResults> = await reviewDao.assign(channel, size, users);

        for (const [key, value] of results) {
            switch (value) {
                case EnumDaoResults.SUCCESS:
                    {
                        usersAdded += `${key.name}`;
                        break;
                    }
                default:
                case EnumDaoResults.NOT_FOUND:
                case EnumDaoResults.NO_OP:
                    {
                        usersMissing += `${key.name}`;
                        break;
                    }
            }
        }

        let replyMsg = '';
        if (usersAdded) {
            replyMsg += BotMessages.ASSIGN_CORRECT.replace('{0}', usersAdded);
        }

        if (usersMissing) {
            replyMsg += BotMessages.ASSIGN_INCORRECT.replace('{0}', usersMissing);
        }

        await this.channelControllerInstance.createReply(replyMsg, activity);
        return Promise.resolve(users);
    }

    /**
     * Sets the OOF Status
     * @param activity The activity that contains the request information.
     * @param The OOF state
     */
    public async setOofStatus(activity: Activity, oofStatus: EnumOofStatus) {
        if (!activity || oofStatus === EnumOofStatus.None) {
            return;
        }

        let usersOof = '';
        let usersMissing = '';

        const channel = new Channel();
        if (activity.channelData && activity.channelData.teamsChannelId) {
            channel.id = activity.channelData.teamsChannelId
        } else {
            await this.channelControllerInstance.createReply(BotMessages.INCORRECT_INSTRUCTION_PRIVATE, activity);
            return;
        }

        // Getting the mentions
        const entities = activity.entities;

        channel.name = activity.channelId;
        let users = Utilities.CreateUsersFromModel(entities, true);

        // In case the user specified he wants to add himself.
        const oofSelfPattern = '(.*)(\\[)(!)?(OOF)(\\])(.*)(\\[)(self)(\\])(.*)';
        const userSelf =
            Utilities.GetUserFromRegex(oofSelfPattern, activity.text, activity.from.name, activity.from.id);

        if (null !== userSelf) {
            const tempList: User[] = [];
            tempList.push(userSelf);
            if (!users) {
                users = [];
            }

            users = [...users, ...tempList]
        }


        if (!users || users.length === 0) {
            await this.showOofStatus(activity);
            return;
        }

        const userDao = new UserDao();
        const results: Map<User, EnumDaoResults> = await userDao.setOofStatus(channel, oofStatus, users);

        for (const [key, value] of results) {
            switch (value) {
                case EnumDaoResults.SUCCESS:
                    {
                        usersOof += `${key.name}`;
                        break;
                    }
                default:
                case EnumDaoResults.NOT_FOUND:
                case EnumDaoResults.NO_OP:
                    {
                        usersMissing += `${key.name}`;
                        break;
                    }
            }
        }

        let replyMsg = '';
        if (usersOof) {
            // Reply depends on the OOF Status that is being set
            switch (oofStatus) {
                case EnumOofStatus.Active:
                    {
                        replyMsg += BotMessages.ACTIVE_CORRECT.replace('{0}', usersOof);
                        break;
                    }
                case EnumOofStatus.Oof:
                    {
                        replyMsg += BotMessages.OOF_CORRECT.replace('{0}', usersOof);
                        break;
                    }
                default:
                    {
                        const ex =
                            'Error occurred: None was not expected as a valid status while updating the OOF status.';
                        throw new Error(ex);
                    }
            }
        }

        if (usersMissing) {
            replyMsg += BotMessages.OOF_INCORRECT.replace('{0}', usersMissing);
        }

        await this.channelControllerInstance.createReply(replyMsg, activity);
        return;
    }

    /**
     * Sets the randomenss status for a user.
     * @param activity The activity that contains the request information.
     * @param randomStatus The status of being added or removed in random reviews.
     */
    public async setRandomStatus(activity: Activity, randomStatus: EnumRandomOperations) {
        if (!activity || randomStatus === EnumRandomOperations.None) {
            return;
        }

        const currentUser = new User();
        currentUser.name = activity.from.name;
        currentUser.id = activity.from.id;

        const channel = new Channel();
        if (activity.channelData && activity.channelData.teamsChannelId) {
            channel.id = activity.channelData.teamsChannelId
            channel.name = activity.channelId;
        } else {
            await this.channelControllerInstance.createReply(BotMessages.INCORRECT_INSTRUCTION_PRIVATE, activity);
            return;
        }

        currentUser.userChannel = channel;

        const userDao: UserDao = new UserDao();

        let replyMsg = '';
        switch (randomStatus) {
            case EnumRandomOperations.Add:
                {
                    await userDao.addRandom(currentUser);
                    replyMsg += BotMessages.RANDOM_CORRECT.replace('{0}', currentUser.name);
                    break;
                }
            case EnumRandomOperations.Remove:
                {
                    await userDao.removeRandom(currentUser);
                    replyMsg += BotMessages.RANDOM_REMOVE.replace('{0}', currentUser.name);
                    break;
                }
            default:
                {
                    const ex =
                        'Error occurred: could not include you in random reviews.';
                    throw new Error(ex);
                }
        }

        await this.channelControllerInstance.createReply(replyMsg, activity);
        return;
    }

    /**
     * Sets the randomenss status for a user.
     * @param activity The activity that contains the request information.
     * @param randomOperation The status of being added or removed in random reviews.
     */
    public async setRandomness(activity: Activity, randomOperation: EnumRandomOperations) {
        if (!activity || randomOperation === EnumRandomOperations.None) {
            return;
        }

        const channel = new Channel();
        if (activity.channelData && activity.channelData.teamsChannelId) {
            channel.id = activity.channelData.teamsChannelId
            channel.name = activity.channelId;
        } else {
            await this.channelControllerInstance.createReply(BotMessages.INCORRECT_INSTRUCTION_PRIVATE, activity);
            return;
        }

        const reviewDao = new ReviewDao();

        let replyMsg = '';
        switch (randomOperation) {
            case EnumRandomOperations.GetChannelRandomness:
                {
                    const result = await reviewDao.getChannelRandomness(channel);
                    const users = await this.getRandomUsers(activity);
                    if (result && result.randomness && users) {
                        let userNames = '';
                        let count = 1;
                        for (const user of users) {
                            userNames += `${count}.-${user.name}<br />`;
                            count++;
                        }
                        replyMsg += BotMessages.CORRECT_GET_RANDOMNESS.replace('{0}', `${result.randomness}`);
                        replyMsg += '<br />' + BotMessages.GET_RANDOM_USERS.replace('{0}', userNames);
                    } else {
                        replyMsg += `An issue ocurred while retrieving the users that want to participate in random
                        reviews, please report this bug.`
                    }
                    break;
                }
            case EnumRandomOperations.SetChannelRandomness:
                {
                    const level = Utilities.getRandomnessLevel(activity.text);
                    if (level && level >= 0 && level <= 100) {
                        reviewDao.setChannelRandomness(channel, level);
                        replyMsg += BotMessages.CORRECT_SET_RANDOMNESS.replace('{0}', `${level}`);
                    }
                    else {
                        replyMsg += BotMessages.INCORRECT_RANDOMNESS;
                    }
                    break;
                }
            default:
                {
                    const ex =
                        'Error occurred: could execute randomness operation on the channel.'
                    throw new Error(ex);
                }
        }

        await this.channelControllerInstance.createReply(replyMsg, activity);
        return;
    }

    /**
     * Gets a list of users that are currently marked as OOF
     * @param activity The activity associated with this message.
     */
    private async showOofStatus(activity: Activity) {
        if (!activity) {
            return;
        }

        const channel = new Channel();
        if (activity.channelData && activity.channelData.teamsChannelId) {
            channel.id = activity.channelData.teamsChannelId
            channel.name = activity.channelId;
        } else {
            await this.channelControllerInstance.createReply(BotMessages.INCORRECT_INSTRUCTION_PRIVATE, activity);
            return;
        }

        const userDao = new UserDao();
        const results = await userDao.getOofUsers(channel);

        let userNames = '';
        let count = 1;
        if (null !== results && results.length > 0) {
            for (const user of results) {
                userNames += `${count}.-${user.name}<br />`;
                count++;
            }

            await this.channelControllerInstance.createReply(
                BotMessages.GET_OOF_USERS.replace('{0}', userNames),
                activity);
        }
        else {
            await this.channelControllerInstance.createReply(BotMessages.NO_OOF_USERS, activity);
        }

        return;
    }

    /**
     * Gets the user list so the user knows what user does them want to remove.
     * @param activity The activity associated with the request.
     */
    public async removeUser(activity: Activity) {
        if (!activity) {
            return;
        }

        const channel = new Channel();
        if (activity.channelData && activity.channelData.teamsChannelId) {
            channel.id = activity.channelData.teamsChannelId
            channel.name = activity.channelId;
        } else {
            await this.channelControllerInstance.createReply(BotMessages.INCORRECT_INSTRUCTION_PRIVATE, activity);
            return;
        }

        let replyMsg = '';
        const reviewDao = new ReviewDao();
        const users = await reviewDao.nextUsers(channel, Constants.MAX_USERS_TO_LIST);

        if (users) {
            for (const user of users) {
                // We skip ourselves.
                if (Utilities.filterOtterBrassUser(user)) {
                    continue;
                }

                replyMsg += '<li>' + user.name + '</li> ';
            }
        }

        if (!replyMsg) {
            // No user was specified or mentioned.
            await this.channelControllerInstance.createReply(BotMessages.INCORRECT_MESSAGE, activity);
        }
        else {
            // User was successfully added.
            await this.channelControllerInstance.createReply(
                BotMessages.REMOVE_INSTRUCTIONS.replace('{0}', replyMsg),
                activity);
        }
    }

    /**
     * Removes the provided user from the user list.
     * @param activity The activity associated with the request.
     */
    public async removeUserWithName(activity: Activity) {
        if (null === activity) {
            return;
        }

        const removePatternWithUser = '(.*)(\\[)(remove)(\\])(.*)(\\[)(.*)(\\])(.*)';
        let name = Utilities.getGroupFromRegex(removePatternWithUser, activity.text, 7);
        if (!name) {
            return;
        }

        // In case user wants to remove himself.
        if ('self' === name) {
            name = activity.from.name;
        }

        const channel = new Channel();
        if (activity.channelData && activity.channelData.teamsChannelId) {
            channel.id = activity.channelData.teamsChannelId
            channel.name = activity.channelId;
        } else {
            await this.channelControllerInstance.createReply(BotMessages.INCORRECT_INSTRUCTION_PRIVATE, activity);
            return;
        }

        let replyMsg = '';
        const reviewDao = new ReviewDao();
        const users = await reviewDao.nextUsers(channel, Constants.MAX_USERS_TO_LIST);

        if (users) {
            const filteredUsers = users.filter(currentUser => {
                if (currentUser.name === name) {
                    return currentUser;
                }
            })

            if (filteredUsers.length > 0 && filteredUsers[0]) {
                const user = filteredUsers[0];
                replyMsg +=
                    BotMessages.USER_REMOVE_SUCCEEDED.replace('{0}', (user.name || 'ERROR GETTING THE USER NAME'));
                user.userChannel = channel;
                const userDao = new UserDao();
                await userDao.removeUser(user);
            }
        }

        if (!replyMsg) {
            // No user was specified or mentioned.
            await this.channelControllerInstance.createReply(BotMessages.INCORRECT_MESSAGE, activity);
        }
        else {
            // User was successfully added.
            await this.channelControllerInstance.createReply(replyMsg, activity);
        }
    }

    /**
     * Get the next reviewers in the line but without affecting it's ranking.
     * @param activity The list of users that will be next in the list.
     */
    public async getNextinLineUsers(activity: Activity) {
        if (!activity) {
            return;
        }

        const channel = new Channel();
        if (activity.channelData && activity.channelData.teamsChannelId) {
            channel.id = activity.channelData.teamsChannelId
        } else {
            await this.channelControllerInstance.createReply(BotMessages.INCORRECT_INSTRUCTION_PRIVATE, activity);
            return;
        }

        const reviewDao = new ReviewDao();
        const users = await reviewDao.nextUsers(channel, 3);
        let userNames = '';
        let count = 1;
        if (null !== users && users.length > 0) {
            for (const user of users) {
                userNames += `${count}.-${user.name}<br />`;
                count++;
            }

            await this.channelControllerInstance.createReply(
                BotMessages.GET_NEXT_REVIEWERS.replace('{0}', userNames), activity);
            return;
        }
    }

    public async getRandomUsers(activity: Activity) {
        if (!activity) {
            return null;
        }

        const reviewDao = new ReviewDao();

        const channel = new Channel();
        if (activity.channelData && activity.channelData.teamsChannelId) {
            channel.id = activity.channelData.teamsChannelId
        } else {
            await this.channelControllerInstance.createReply(BotMessages.INCORRECT_INSTRUCTION_PRIVATE, activity);
            return;
        }

        const users = await reviewDao.getNextRandomUsers(channel);
        return users;
    }

    /**
     * Get the next random reviewers in the line.
     * @param activity The list of users that will be next in the list.
     * @param shirtSize The size of the shirt.
     * @param excludedUsers A list of users that should be excluded
     */
    public async getNextRandomUser(activity: Activity, shirtSize: EnumShirtSize, excludedUsers: User[] = []) {
        let channel = new Channel();
        if (activity.channelData && activity.channelData.teamsChannelId) {
            channel.id = activity.channelData.teamsChannelId
        } else {
            await this.channelControllerInstance.createReply(BotMessages.INCORRECT_INSTRUCTION_PRIVATE, activity);
            return;
        }

        const sentByUser = new User();
        sentByUser.id = activity.from.id;
        sentByUser.name = activity.from.name;
        sentByUser.userChannel = channel;

        // We need to decide whether we will include a random user, to do this we use a simple rule:
        // We use a number between 0 and 100 (inclusive) and if that number is less than the
        // randomness level for the channel, we continue, otherwise we return and finish this call.
        const reviewDao = new ReviewDao();
        channel = await reviewDao.getChannelRandomness(channel)
        if (!channel || !channel.randomness) {
            return;
        }

        if ((Math.random() * 100) > channel.randomness) {
            return;
        }

        const users = await this.getRandomUsers(activity);
        if (users) {
            // We need to take out ourselves from the randomList
            let filteredList = users.filter(user => {
                if (user.id !== sentByUser.id && user.name !== sentByUser.name) {
                    return user
                }
            });

            // We also need to take out any excluded users
            if (excludedUsers) {
                filteredList = filteredList.filter(user => {
                    for (const excludedUser of excludedUsers){
                        if (user.id !== excludedUser.id && user.name !== excludedUser.name) {
                            return user;
                        }
                    }
                });
            }

            // We need to choose the user.
            // Get a random number between 0 and the max length of the array.
            let resultUser = null;
            const index = Math.random() * filteredList.length;
            if (filteredList.length > 0) {
                resultUser = filteredList[index];
            }

            if (resultUser) {
                const mentioned = {
                    id: resultUser.id,
                    name: resultUser.name
                };

                const mention = {
                    text: `<at> ${resultUser.name} </at>`,
                    mentioned,
                    type: Constants.MENTION
                }

                await reviewDao.assign(channel, shirtSize, [resultUser]);
                await this.channelControllerInstance.createReplyWithMention(BotMessages.GET_NEXT_RANDOM.replace('{0}', (resultUser.name || 'ERROR GETTING NAME OF RANDOM USER')), activity, mention as Mention);
            }
        }
    }

    /**
     * Retrieves the scoreboard for the users.
     * @param activity The associated activity
     */
    public async scoreBoard(activity: Activity) {
        if (!activity) {
            return;
        }

        try {
            const channel = new Channel();
            if (activity.channelData && activity.channelData.teamsChannelId) {
                channel.id = activity.channelData.teamsChannelId
            } else {
                await this.channelControllerInstance.createReply(BotMessages.INCORRECT_INSTRUCTION_PRIVATE, activity);
                return null;
            }

            const reviewDao = new ReviewDao();
            let users = await reviewDao.nextUsers(channel, Constants.MAX_USERS_TO_LIST);
            let userNames = '';
            let count = 1;
            // TODO: verify this logic as it changed when migrated.
            if (users && users.length > 0) {
                users = users.sort((n1, n2) => {
                    if (n1 && n1.rank && n2 && n2.rank) {
                        // We want the list ordered from first to bottom.
                        return n2.rank - n1.rank
                    }
                        return -1

                });

                for (const user of users) {
                    if (user.name === activity.from.name) {
                        // We make it easy for the user to find themself.
                        user.name = '<b>' + user.name + '</b>';
                    }

                    userNames += `${count}.-${user.name}: ${user.rank}<br />`;
                    count++;
                }

                await this.channelControllerInstance.createReply(
                    BotMessages.GET_SOREBOARD.replace('{0}', userNames), activity);
                return;
            }
        }
        catch (error) {
            // #2 handle error gracefully
            console.error(error);
            await this.channelControllerInstance.createReply(BotMessages.INCORRECT_INSTRUCTION_PRIVATE, activity);
        }
    }
}
