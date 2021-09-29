import { Channel } from '../Models/Channel';
import { EnumShirtSize } from '../Enums/EnumShirtSize';
import { User } from '../Models/User';
import { EnumDaoResults } from '../Enums/EnumDaoResults';
import { Constants } from '../Common/Constants';
import { AppInsights } from '../Common/AppInsights';

const sql = require('mssql');

/**
 * The data access object used in the communication with the review database.
 */
export class ReviewDao {
    /**
     * Gets the next user in line.
     * @param channel The channel associated.
     * @param size The size that will be used for the next user rank.
     * @param sentByUser The user that sent the request and that should not be included in the results.
     */
    public async nextInLine(channel: Channel, size: EnumShirtSize, sentByUser: User): Promise<User | null> {
        if (!sentByUser || !sentByUser.id) {
            return null;
        }

        let user: User | null = null;

        try {
            const pool = await sql.connect(Constants.SERVER_CONFIG);
            const data = await pool.request()
                .input('channelId', sql.NVarChar, channel.id)
                .input('rankIncrement', sql.Int, size)
                .input('sentByUserId', sql.NVarChar, sentByUser.id)
                .output('userName', sql.NVarChar)
                .output('userId', sql.NVarChar)
                .output('ranking', sql.NVarChar)
                .execute('usp_GetNext');

            if (data.output.userId) {
                user = new User();
                user.id = data.output.userId;
                user.name = data.output.userName;
                user.rank = data.output.ranking;
            }

            pool.close();
            sql.close();
            return user;
        } catch (error) {
            AppInsights.instance.logException(JSON.stringify(error));
            throw error;
        }
    }

    /**
     * Gets the next user in the line (without incrementing its ranking)
     * @param channel The channel associated.
     * @param howMany When number of users that will be retrieved.
     */
    public async nextUsers(channel: Channel, howMany: number): Promise<User[]> {
        const result: User[] = [];
        try {
            const pool = await sql.connect(Constants.SERVER_CONFIG);
            const data = await pool.request()
                .input('channelId', sql.NVarChar, channel.id)
                .input('howMany', sql.Int, howMany)
                .execute('usp_GetNextUsers');

            for (const item of data.recordset) {
                const currentUser = new User();
                currentUser.id = item.Id;
                currentUser.name = item.Name;
                currentUser.rank = item.Ranking;
                result.push(currentUser);
            }

            pool.close();
            sql.close();
            return result;
        } catch (error) {
            AppInsights.instance.logException(JSON.stringify(error));
            throw error;
        }
    }

    /**
     * Gets the next random user in line (without incrementing it's rank)
     * @param channel The channel associated.
     */
    public async getNextRandomUsers(channel: Channel): Promise<User[]> {
        const results: User[] = [];
        try {
            const pool = await sql.connect(Constants.SERVER_CONFIG);
            const data = await pool.request()
                .input('channelId', sql.NVarChar, channel.id)
                .execute('usp_GetRandomUsers');

            for (const item of data.recordset) {
                const currentUser = new User();
                currentUser.id = item.Id;
                currentUser.name = item.Name;
                currentUser.rank = item.Ranking;
                currentUser.userChannel = channel;
                results.push(currentUser);
            }

            pool.close();
            sql.close();
            return results;
        } catch (error) {
            AppInsights.instance.logException(JSON.stringify(error));
            throw error;
        }
    }

    /**
     * Assigns the item to a specific list of users.
     * @param channel The channel associated to this item.
     * @param size The sizeof the review.
     * @param users The list of users that will have the item assigned.
     */
    public async assign(channel: Channel, size: EnumShirtSize, users: User[]): Promise<Map<User, EnumDaoResults>> {
        const results = new Map<User, EnumDaoResults>();
        try {
            // #3: when I wrote this .NET Core 1.1 did not support datatables so it was the easiest to do this way.
            // foreach(User user in users) this can be changed when this is transformed into a REST API call
            for (const user of users) {
                const pool = await sql.connect(Constants.SERVER_CONFIG);
                const data = await pool.request()
                    .input('channelId', sql.NVarChar, channel.id)
                    .input('rankIncrement', sql.Float, 3)
                    .input('userId', sql.NVarChar, user.id)
                    .output('result', sql.Int)
                    .execute('usp_Assign');
                results.set(user, data.output.result);
                pool.close();
                sql.close();
            }
        } catch (error) {
            AppInsights.instance.logException(JSON.stringify(error));
            throw error;
        }

        return results;
    }

    /**
     * Sets the channel randomness
     * @param channel The channel that will have the randomness set.
     * @param randomness The level of randomness assigned to the channel.
     */
    public async setChannelRandomness(channel: Channel, randomness: number) {
        try {
            const pool = await sql.connect(Constants.SERVER_CONFIG);
            const data = await pool.request()
                .input('channelId', sql.NVarChar, channel.id)
                .input('randomLevel', sql.Int, randomness)
                .execute('usp_SetChannelRandomness');

            pool.close();
            sql.close();
        } catch (error) {
            AppInsights.instance.logException(JSON.stringify(error));
            throw error;
        }
    }

    /**
     * Gets tha randomness level of a channel
     * @param channel A channel from which we want to retrieve the randomness level.</param>
     * <returns>A channel that contains the randomness level
     */
    public async getChannelRandomness(channel: Channel): Promise<Channel> {
        if (!channel)
        {
            // TODO: Fix this really bad way of bypassing the compiler.
            return channel;
        }

        try {
            let channelRandomness = -1;
            const pool = await sql.connect(Constants.SERVER_CONFIG);
            const data = await pool.request()
                .input('channelId', sql.NVarChar, channel.id)
                .execute('usp_GetChannelRandomness');

            for (const item of data.recordset) {
                if (-1 === channelRandomness)
                {
                    channelRandomness = item.RandomLevel;
                }
                else if (channelRandomness !== item.RandomLevel)
                {
                    throw new Error('Channel randomness does not match all the values');
                }
            }

            pool.close();
            sql.close();

            channel.randomness = channelRandomness;
            return channel;
        } catch (error) {
            AppInsights.instance.logException(JSON.stringify(error));
            throw error;
        }
    }
}
