
import {InstructionsParser} from '../Parsers/InstructionsParser';
import {EnumInstructions} from '../Enums/EnumInstructions';
import { TurnContext } from 'botbuilder';
import { OtterBrassMessageController } from './OtterbrassMessageController';
import { TeamsChannelController } from './TeamsChannelController';
import { MessageControllerInterface } from '../Interfaces/MessageControllerInterface';
import { ChannelControllersInterface } from '../Interfaces/ChannelControllersInterface';
import { Utilities } from '../Common/Utilities';
import { BotMessages } from '../Common/BotMessage';
import { EnumOofStatus } from '../Enums/EnumOofStatus';
import { EnumRandomOperations } from '../Enums/EnumRandomOperations';

export class MessageController {

    public async parse(context: TurnContext) {
        // We don't need to reply to things that are not an activity, also for now we just focus on messages
        if (!context || !context.activity || 'message' !== context.activity.type.toLowerCase())
        {
            return;
        }
        const activity = context.activity;
        const _messageController: MessageControllerInterface = OtterBrassMessageController.instance(context);
        const _channelController: ChannelControllersInterface = TeamsChannelController.instance(context);

        switch (InstructionsParser.parse(activity.text))
        {
            case EnumInstructions.AddUser:
                {
                    _messageController.addUser(activity);
                    break;
                }
            case EnumInstructions.NextInLine:
                {
                    const size = Utilities.getItemSize(activity.text);
                    const nextUser = await _messageController.getNext(activity, size);
                    await _messageController.getNextRandomUser(activity, size, nextUser ? [nextUser] : []);
                    await _messageController.getNextinLineUsers(activity);
                    break;
                }
            case EnumInstructions.Assign:
                {
                    const size = Utilities.getItemSize(activity.text);
                    const users = await _messageController.assign(activity, size);
                    await _messageController.getNextinLineUsers(activity);
                    break;
                }
            case EnumInstructions.Help:
                {
                    await _channelController.createReply(BotMessages.HELP, activity);
                    break;
                }
            case EnumInstructions.Changelog:
                {
                    await _channelController.createReply(BotMessages.CHANGELOG, activity);
                    break;
                }
            case EnumInstructions.RemoveWithUser:
                {
                    _messageController.removeUserWithName(activity);
                    break;
                }

            case EnumInstructions.Remove:
                {
                    _messageController.removeUser(activity);
                    break;
                }
            case EnumInstructions.Scoreboard:
                {
                    _messageController.scoreBoard(activity);
                    break;
                }
            case EnumInstructions.OofStatus:
                {
                    const oofStatus = Utilities.getOofStatus(activity.text);

                    if (oofStatus === EnumOofStatus.None)
                    {
                        await _channelController.createReply(BotMessages.INCORRECT_OOF, activity);
                    }
                    else
                    {
                        await _messageController.setOofStatus(activity, oofStatus);
                    }

                    break;
                }
            case EnumInstructions.Random:
                {
                    const randomOperation = Utilities.getRandomCommand(activity.text);

                    if (randomOperation === EnumRandomOperations.None)
                    {
                        await _channelController.createReply(BotMessages.INCORRECT_RANDOM, activity);
                    }
                    else
                    {
                        await _messageController.setRandomStatus(activity, randomOperation);
                    }

                    break;
                }
            case EnumInstructions.ChannelRandomness:
                {
                    const randomOperation = Utilities.getRandomnessOperation(activity.text);

                    if (randomOperation === EnumRandomOperations.None)
                    {
                        await _channelController.createReply(BotMessages.INCORRECT_RANDOMNESS, activity);
                    }
                    else
                    {
                        await _messageController.setRandomness(activity, randomOperation);
                    }

                    break;
                }
            case EnumInstructions.None:
            default:
                {
                    await _channelController.createReply(BotMessages.INCORRECT_MESSAGE, activity);
                    break;
                }
        }
    }
}