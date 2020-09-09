/**
 * Contains the different messages that the bot will reply.
 */
export class BotMessages {
    public static BAD_USER_SPECIFIED = 'I\'m sorry but you need to @mention which user you want to add. e.g: [add] @user1 @user2... you can also use [self] to add yourself';

    public static USER_ADDED_SUCCEEDED = 'Success, I\'ll keep an eye on ';
    public static USER_REMOVE_SUCCEEDED = 'I was able to remove {0}, I\'ll miss them';
    public static INCORRECT_MESSAGE = 'So... I\'m not sure what you tried to say, please use [help] to get a list of the supported commands.';

    public static NEXT_IN_LINE = 'Next in line is <at> {0} </at>';
    public static INCORRECT_USER_SPECIFIED = 'Beep Boop Beep, I could not find any user! Have you checked the OOF list?.';
    public static ASSIGN_CORRECT = 'Everything went smooth, {0} will receive credit for their contribution.';
    public static OOF_CORRECT = 'I\'ll cover for: {0} while they are OOF.';
    public static ACTIVE_CORRECT = 'Productivity boost. {0} are ready to work!.';
    public static OOF_INCORRECT = 'I\'m not tracking {0} in this channel, please add them first before setting them OOF';
    public static ASSIGN_INCORRECT = 'I\'m not tracking {0} in this channel, please add them first before assigning them';
    public static RANDOM_CORRECT = 'All set, {0} will be included in random reviews.';
    public static RANDOM_REMOVE = 'Ok, I\'ll give {0} a break from random comments.';
    public static GET_NEXT_REVIEWERS = 'Here you go, these users are next in my list:<br />{0}';
    public static GET_NEXT_RANDOM = '<at> {0} </at> you are so lucky, you were included in this item randomly.';
    public static GET_OOF_USERS = 'I\'m covering for these users, they will not be assigned any new items until they come back:<br />{0}';

    public static GET_RANDOM_USERS = 'These users asked to be included in random items:<br />{0}';
    public static NO_OOF_USERS = 'Our productivity is at 100%, no users are reported as OOF';
    public static GET_SOREBOARD = 'This is it... We\'ve got a winner:<br />{0}';
    public static MENTION_NOT_FOUND = 'beep...boop...beep...the user you specified does not exists...beep...boop...beep.';
    public static INCORRECT_OOF = 'Use [OOF] @user1, @user2 ... to set the users as OOF OR [!OOF] @user1, @user2 ... to remove them from being OOF';
    public static INCORRECT_RANDOM = 'Use [Random] to be included in random reviews or [!Random] to be removed from random includes.';
    public static CORRECT_SET_RANDOMNESS = 'Done, this channel now has {0} as the randomness level';
    public static CORRECT_GET_RANDOMNESS = 'Here is the current randomness level on the channel [0-100]: {0}';
    public static INCORRECT_RANDOMNESS = 'Use [channelRandomness] to get the channel randomness level, use [channelRandomness] [0-100] to set the channel randomness.';
    public static INCORRECT_INSTRUCTION_PRIVATE = 'I\'m sorry, but this command only works when you use it in a channel. I\'ll improve my self to get this done in the future.';
    public static REMOVE_INSTRUCTIONS = 'Please select a user from the list, <b>copy</b> the name and reply this message with the following format:' +
        '<ul><li>[Remove] [Paste here the username] </li><li>Remember to <b>include square brackets</b> and to mention me (Otterbrass):</li></ul><ul>{0}<li>You can also use [self] to remove your self.</li></ul>';
    public static HELP = 'Here is what I can do for you:' +
        '<ul><li><b>[add] @user1...userN</b>: Add a single/multiple user(s) to the tracking list.</li>' +
        '<li><b>[next]</b>: Assigns the item to the next user in line</li>' +
        '<li><b>[assign] @user1...userN</b>: Assigns the item to the specified user(s).</li>' +
        '<li><b>[changelog]</b>: Shows the changelog.</li>' +
        '<li><b>[scoreboard]</b>: Shows the scoreboard.</li>' +
        '<li><b>[remove]</b>: Shows the process to remove a user.</li>' +
        '<li><b>[OOF] @user1...userN</b>: Sets the given users to OOF. They will not be assigned any items</li>' +
        '<li><b>[!OOF] @user1...userN</b>: Remove the given users from OOF.</li>' +
        '<li><b>[OOF]</b>: Gets the list of users that are OOF.</li>' +
        '<li><b>[random]: Adds your name to the list of users that will participate randomly in the channel items.</li>' +
        '<li><b>[!random]: Removes your name  from the list of users that will participate randomly in the channel items.</li>' +
        '<li><b>[channelRandomness]: Shows the probability of being added randomly to a review (you must add yourself to the list first using [random]).</li>' +
        '<li><b>[channelRandomness] [0-100]:  Sets the probability of being added randomly to a review.</li></ul>' +
        '<br />For <b>[next]</b> and <b>[assign]</b> you can specify the size: <b>[s|xs|m|l|xl]</b> , default is small' +
        '<br />For <b>[add]</b>, <b>[remove]</b> and <b>[OOF]</b> you can specify: <b>[self]</b> as parameter.';
    public static CHANGELOG = 'I spent sometime with the wisest otters, they taught me to:' +
        '<ul><li>You can now opt-in to be randomly added to items:</li>' +
        '<li><b>[random]: Adds your name to the list of users that will participate randomly in the channel items.</li>' +
        '<li><b>[!random]: Removes your name  from the list of users that will participate randomly in the channel items.</li>' +
        '<li><b>[channelRandomness]: Shows the probability of being added randomly to a review (you must add yourself to the list first using [random]).</li>' +
        '<li><b>[channelRandomness] [0-100]:  Sets the probability of being added randomly to a review.</li></ul>';
}