import { EnumInstructions } from '../Enums/EnumInstructions'
import { Utilities } from '../Common/Utilities'

export class InstructionsParser {

    static parse(message: string) {
        if (!message) {
            return EnumInstructions.None;
        }

        const addPattern = '(.*)(\\[)(add)(\\])(.*)';
        let match = Utilities.verifyRegex(addPattern, message);
        try {
            if (match) {
                return EnumInstructions.AddUser;
            }

            const nextPattern = '(.*)(\\[)(next)(\\])(.*)';
            match = Utilities.verifyRegex(nextPattern, message);
            if (match) {
                return EnumInstructions.NextInLine;
            }

            const assignPattern = '(.*)(\\[)(assign)(\\])(.*)';
            match = Utilities.verifyRegex(assignPattern, message);
            if (match) {
                return EnumInstructions.Assign;
            }

            const helpPattern = '(.*)(\\[)(help)(\\])(.*)';
            match = Utilities.verifyRegex(helpPattern, message);
            if (match) {
                return EnumInstructions.Help;
            }

            const changelogPattern = '(.*)(\\[)(changelog)(\\])(.*)';
            match = Utilities.verifyRegex(changelogPattern, message);
            if (match) {
                return EnumInstructions.Changelog;
            }

            const removePatternWithUser = '(.*)(\\[)(remove)(\\])(.*)(\\[)(.*)(\\])(.*)';
            match = Utilities.verifyRegex(removePatternWithUser, message);
            if (match) {
                return EnumInstructions.RemoveWithUser;
            }

            const removePattern = '(.*)(\\[)(remove)(\\])(.*)';
            match = Utilities.verifyRegex(removePattern, message);
            if (match) {
                return EnumInstructions.Remove;
            }

            const scoreBoardPattern = '(.*)(\\[)(scoreboard)(\\])(.*)';
            match = Utilities.verifyRegex(scoreBoardPattern, message);
            if (match) {
                return EnumInstructions.Scoreboard;
            }

            const oofStatusPattern = '(.*)(\\[)(!)?(OOF)(\\])(.*)';
            match = Utilities.verifyRegex(oofStatusPattern, message);
            if (match) {
                return EnumInstructions.OofStatus;
            }

            const randomPattern = '(.*)(\\[)(!)?(random)(\\])(.*)';
            match = Utilities.verifyRegex(randomPattern, message);
            if (match) {
                return EnumInstructions.Random;
            }
            const channelRandomnessPattern = '(.*)(\\[)(channelRandomness)(\\])(.*)';
            match = Utilities.verifyRegex(channelRandomnessPattern, message);
            if (match) {
                return EnumInstructions.ChannelRandomness;
            }
            else {
                return EnumInstructions.None;
            }
        }
        catch (error) {
            // #2: handle this exception properly
            throw error;
        }
    }
}