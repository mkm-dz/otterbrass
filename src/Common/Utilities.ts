import { Activity, Entity } from 'botbuilder';
import { User } from '../Models/User';
import { Constants } from './Constants';
import { EnumShirtSize } from '../Enums/EnumShirtSize';
import { EnumOofStatus } from '../Enums/EnumOofStatus';
import { EnumRandomOperations } from '../Enums/EnumRandomOperations';

/**
 * Contains a series of utility functions used across the code.
 */
export class Utilities {
    /**
     * Verifies a text against a pattern using regular expressions.
     * @param pattern The pattern that should match in the text.
     * @param stringToBeVerified The string that will be verified.
     * @returns An instance of <see cref="Match"/> that contains the results from the regex.
     */
    static verifyRegex(pattern: string, stringToBeVerified: string) {
        try {
            const regex = new RegExp(pattern, 'i');
            const result = stringToBeVerified.match(regex);
            return result;
        }
        catch (error) {
            // #2: Implement a good exception handling system.
            throw error;
        }
    }

    /**
     * Creates a template activity used commonly on replies. Uses the received activity as a template to know
     * who should be the recepient.
     * @param receivedActivity The activity that will be used as base for creating the new one.
     * @param replyText The text that will be included in the reply activity.
     * @param return The activity that can be used in a reply.
     */
    static getTemplateActivity(receivedActivity: Activity, replyText: string): Activity {
        // TODO: verify this logic as it changed when migrated.

        // {0} serviceUrl, {1} conversationId, {2} activityIds
        const activity: Activity = receivedActivity;
        activity.type = 'message';
        activity.text = replyText;
        return activity;
    }

    /**
     * Create a list of users from a received list of entities.
     * @param entities The list of entities that will be transformed in a list of users.
     * @param removeOtterBrass If otterbrass is in the userlist and if it needs to be removed.
     * @return that contains the list of users from the entities.
     */
    static CreateUsersFromModel(entities: Entity[] | undefined, removeOtterBrass: boolean): User[] | null {
        if (!entities) {
            return null;
        }

        // TODO: Migrate this LINQ logic
        // IEnumerable<User> Users =
        // from item in entities
        // where Constants.MENTION.Equals(item.Type, StringComparison.OrdinalIgnoreCase)
        // select new User
        // {
        //     Id = item.Properties["mentioned"]["id"].Value<string>(),
        //     Name = item.Properties["mentioned"]["name"].Value<string>()
        // };

        // if (removeOtterBrass && null != Users)
        // {
        //     return Users.Where<User>(x => !Utilities.FilterOtterBrassUser(x));
        // }

        // return Users;

        return null;
    }

    /**
     * Verifies a text against a pattern using regular expressions and return the user.
     * @param pattern The pattern that should match in the text.
     * @param stringToBeVerified The string that will be verified.
     * @param name The name for the new user.
     * @param id The id for the new user.
     * @returns The User
     */
    static GetUserFromRegex(pattern: string, stringToBeVerified: string, name: string, id: string): User | null {
        const regex = new RegExp(pattern, 'i');
        const result = stringToBeVerified.match(regex);
        if (result) {
            const user = new User();
            user.id = id;
            user.name = name;

            return user;
        }

        return null;
    }

    /**
     * Verifies that the user is otterbrass.
     * @param user The user that will be verified.
     * @returns true if the user is otterbrass, false otherwise
     */
    static filterOtterBrassUser(user: User): boolean {
        return 'otterbrass' === user.name?.toLowerCase() || 'otterbrassbeta' === user.name?.toLowerCase();
    }

    /**
     * Gets the randmness level on a specific message
     * @param message the mesage to parse
     */
    static getRandomnessLevel(message: string) {
        // Messasge needs to match the enums, so we transform it to upper case.
        const randomnessMatch = '(.*)(\\[)(channelRandomness)(\\])( *)(\\[)([0-9]+)(\\])(.*)';
        const match = Utilities.verifyRegex(randomnessMatch, message);

        if (match && match.groups) {
            // TODO: verify this logic as it changed when migrated.
            return parseInt(match.groups[7], 10);
        }
        else {
            // Default shirt size.
            return Constants.DEFAULT_RANDOMNESS_LEVEL;
        }

        return null;
    }

    /**
     * Verifies a text against a pattern using regular expressions and return the specified group.
     * @param pattern The pattern that should match in the text.
     * @param stringToBeVerified The string that will be verified.
     * @param groupId The id of the group that will be retrieved
     */
    static getGroupFromRegex(pattern: string, stringToBeVerified: string, groupId: number) {
        const results = Utilities.verifyRegex(pattern, stringToBeVerified);
        try {
            // TODO: verify this logic as it changed when migrated.
            if (results?.groups && results.groups[groupId]) {
                return results.groups[groupId];
            }
            else {
                return null;
            }
        }
        catch (error) {
            // #2: Implement a good exception handling system.
            throw error;
        }
    }

    /**
     * Gets the shirt size from the message.
     * @param message The message that will be parsed.
     */
    public static getItemSize(message: string) {
        // Messasge needs to match the enums, so we transform it to upper case.
        message = message.toUpperCase();
        const sizeMatch = '(.*)(\\[)(xs|s|m|l|xl)(\\])(.*)';
        const match = Utilities.verifyRegex(sizeMatch, message);
        let size = 0;
        if (match && match.groups) {
            // TODO: verify this logic as it changed when migrated.
            const current = match.groups[3];
            size = EnumShirtSize[current as keyof typeof EnumShirtSize];
            return size;
        }
        else {
            // Default shirt size.
            return EnumShirtSize.S;
        }
    }

    /**
     * Gets the OOF Status from the message.
     * @param message The message that will be parsed.
     */
    public static getOofStatus(message: string) {
        const oofMatch = '(.*)(\\[)(OOF)(\\])(.*)'
        let match = Utilities.verifyRegex(oofMatch, message);

        if (match) {
            return EnumOofStatus.Oof;
        }

        const active = '(.*)(\\[)(!OOF)(\\])(.*)';

        match = Utilities.verifyRegex(active, message);
        if (match) {
            return EnumOofStatus.Active;
        }
        else {
            return EnumOofStatus.None;
        }
    }

    /**
     * Analizes which "random" operation the user is asking for on the random domain.
     * @param message The message that will be parsed.
     */
    public static getRandomCommand(message: string) {
        const oofMatch = '(.*)(\\[)(Random)(\\])(.*)';
        let match = Utilities.verifyRegex(oofMatch, message);

        if (match) {
            return EnumRandomOperations.Add;
        }

        const active = '(.*)(\\[)(!Random)(\\])(.*)';

        match = Utilities.verifyRegex(active, message);
        if (match) {
            return EnumRandomOperations.Remove;
        }
        else {
            return EnumRandomOperations.None;
        }
    }

        /**
         * Gets the randomness instruction from a message
         * @param message The message that will be parsed.
         */
        public static getRandomnessOperation(message: string)
        {
            const randomnessMatch = '(.*)(\\[)(channelRandomness)(\\])( *)(\\[)([0-9]+)(\\])(.*)';
            let  match = Utilities.verifyRegex(randomnessMatch, message);
            if (match)
            {
                return EnumRandomOperations.SetChannelRandomness;
            }

            const active = '(.*)(\\[)(channelRandomness)(\\])(.*)';

            match = Utilities.verifyRegex(active, message);
            if (match)
            {
                return EnumRandomOperations.GetChannelRandomness;
            }
            else
            {
                return EnumRandomOperations.None;
            }
        }
}