
import {InstructionsParser} from '../Parsers/InstructionsParser';
import {EnumInstructions} from '../Enums/EnumInstructions';
import { Activity } from 'botbuilder';
import { OtterBrassMessageController } from './OtterbrassMessageController';
import { TeamsChannelController } from './TeamsChannelController';
import { MessageControllerInterface } from '../Interfaces/MessageControllerInterface';
import { ChannelControllersInterface } from '../Interfaces/ChannelControllersInterface';
import { Utilities } from '../Common/Utilities';
import { BotMessages } from '../Common/BotMessage';
import { EnumOofStatus } from '../Enums/EnumOofStatus';
import { EnumRandomOperations } from '../Enums/EnumRandomOperations';

export class MessageController {

    private _messageController: MessageControllerInterface = OtterBrassMessageController.instance();
    private _channelController: ChannelControllersInterface = TeamsChannelController.instance();

    public async parse(activity: Activity) {
        // We don't need to reply to things that are not an activity, also for now we just focus on messages
        if (!activity || 'message' !== activity.type.toLowerCase())
        {
            return;
        }

        switch (InstructionsParser.parse(activity.text))
        {
            case EnumInstructions.AddUser:
                {
                    this._messageController.addUser(activity);
                    break;
                }
            case EnumInstructions.NextInLine:
                {
                    const size = Utilities.getItemSize(activity.text);
                    const nextUser = await this._messageController.getNext(activity, size);
                    await this._messageController.getNextRandomUser(activity, size, nextUser ? [nextUser] : []);
                    await this._messageController.getNextinLineUsers(activity);
                    break;
                }
            case EnumInstructions.Assign:
                {
                    const size = Utilities.getItemSize(activity.text);
                    const users = await this._messageController.assign(activity, size);
                    await this._messageController.getNextinLineUsers(activity);
                    break;
                }
            case EnumInstructions.Help:
                {
                    await this._channelController.createReply(BotMessages.HELP, activity);
                    break;
                }
            case EnumInstructions.Changelog:
                {
                    await this._channelController.createReply(BotMessages.CHANGELOG, activity);
                    break;
                }
            case EnumInstructions.RemoveWithUser:
                {
                    this._messageController.removeUserWithName(activity);
                    break;
                }

            case EnumInstructions.Remove:
                {
                    this._messageController.removeUser(activity);
                    break;
                }
            case EnumInstructions.Scoreboard:
                {
                    this._messageController.scoreBoard(activity);
                    break;
                }
            case EnumInstructions.OofStatus:
                {
                    const oofStatus = Utilities.getOofStatus(activity.text);

                    if (oofStatus === EnumOofStatus.None)
                    {
                        await this._channelController.createReply(BotMessages.INCORRECT_OOF, activity);
                    }
                    else
                    {
                        await this._messageController.setOofStatus(activity, oofStatus);
                    }

                    break;
                }
            case EnumInstructions.Random:
                {
                    const randomOperation = Utilities.getRandomCommand(activity.text);

                    if (randomOperation === EnumRandomOperations.None)
                    {
                        await this._channelController.createReply(BotMessages.INCORRECT_RANDOM, activity);
                    }
                    else
                    {
                        await this._messageController.setRandomStatus(activity, randomOperation);
                    }

                    break;
                }
            case EnumInstructions.ChannelRandomness:
                {
                    const randomOperation = Utilities.getRandomnessOperation(activity.text);

                    if (randomOperation === EnumRandomOperations.None)
                    {
                        await this._channelController.createReply(BotMessages.INCORRECT_RANDOMNESS, activity);
                    }
                    else
                    {
                        await this._messageController.setRandomness(activity, randomOperation);
                    }

                    break;
                }
            case EnumInstructions.None:
            default:
                {
                    await this._channelController.createReply(BotMessages.INCORRECT_MESSAGE, activity);
                    break;
                }
        }
    }
}