import { User } from '../Models/User';
import { Channel } from '../Models/Channel';
import { EnumOofStatus } from '../Enums/EnumOofStatus';
import { EnumDaoResults } from '../Enums/EnumDaoResults';
import { Constants } from '../Common/Constants';
import { AppInsights } from '../Common/AppInsights';

const sql = require('mssql');

/**
 * Data access object used in the communication with the user database.
 */
export class UserDao {
    /**
     * Adds a user to the database.
     * @param user The user that will be added.
     */
    public async addUser(user: User) {
        try {
            if (!user.userChannel || !user.userChannel.id) {
                throw new Error('Could not add user because a channel was not provided.')
            }
            const pool = await sql.connect(Constants.SERVER_CONFIG);
            const data = await pool.request()
                .input('channelId', sql.NVarChar, user.userChannel.id)
                .input('channelName', sql.NVarChar, user.userChannel.name)
                .input('userId', sql.NVarChar, user.id)
                .input('userName', sql.NVarChar, user.name)
                .input('randomLevel', sql.Int, Constants.DEFAULT_RANDOMNESS_LEVEL)
                .execute('usp_AddUser');

            pool.close();
            sql.close();
            AppInsights.instance.logTrace(`[addUser] ${JSON.stringify(user)}`);
        } catch (error) {
            AppInsights.instance.logException(JSON.stringify(error));
            throw error;
        }
    }

    public async removeUser(user: User) {
        try {
            if (!user.userChannel || !user.userChannel.id) {
                throw new Error('Could not remove user because a channel was not provided.')
            }
            const pool = await sql.connect(Constants.SERVER_CONFIG);
            const data = await pool.request()
                .input('channelId', sql.NVarChar, user.userChannel.id)
                .input('channelName', sql.NVarChar, user.userChannel.name)
                .input('userId', sql.NVarChar, user.id)
                .input('userName', sql.NVarChar, user.name)
                .execute('usp_RemoveUser');

            pool.close();
            sql.close();
            AppInsights.instance.logTrace(`[removeUser] ${JSON.stringify(user)}`);
        } catch (error) {
            AppInsights.instance.logException(JSON.stringify(error));
            throw error;
        }
    }

    /**
     * Set the OOF status of a <see cref="List"/> of <see cref="User"/>.
     * @param channel The channel associated to this item.
     * @param oofStatus The OOF status
     * @param users The list of users that will have their OOF status set.
     * @return A <see cref="Dictionary{User, EnumDaoResults}"/> that represents the user and the result
     *   from that operation.
     */
    public async setOofStatus(channel: Channel,
        oofStatus: EnumOofStatus,
        users: User[]): Promise<Map<User, EnumDaoResults>> {
        const result = new Map<User, EnumDaoResults>();

        // #3: when I wrote this .NET Core 1.1 did not support datatables so it was the easiest to do this way.
        // foreach(User user in users) this can be changed when this is transformed into a REST API call
        try {
            for (const user of users) {
                {

                    if (!channel || !channel.id) {
                        throw new Error('Could not remove user because a channel was not provided.')
                    }
                    const pool = await sql.connect(Constants.SERVER_CONFIG);
                    const data = await pool.request()
                        .input('channelId', sql.NVarChar, channel.id)
                        .input('userId', sql.NVarChar, user.id)
                        .input('oofStatus', sql.Int, oofStatus)
                        .output('result', sql.Int)
                        .execute('usp_SetOof');

                    pool.close();
                    sql.close();

                    result.set(user, data.output.result);
                    AppInsights.instance.logTrace(`[setOofStatus] ${JSON.stringify(user)}`);
                }
            }
        } catch (error) {
            AppInsights.instance.logException(JSON.stringify(error));
            throw error;
        }

        return result;
    }

    /**
     * Gets the list of OOF users.
     * @param Channel The channel associated.
     * @param channel the list of users that OOF
     */
    public async getOofUsers(channel: Channel): Promise<User[]> {
        const results: User[] = [];
        try {
            const pool = await sql.connect(Constants.SERVER_CONFIG);
            const data = await pool.request()
                .input('channelId', sql.NVarChar, channel.id)
                .execute('usp_GetOofUsers');

            for (const item of data.recordset) {
                const currentUser = new User();
                currentUser.id = item.Id;
                currentUser.name = item.Name;
                currentUser.userChannel = channel;
                results.push(currentUser);
            }

            pool.close();
            sql.close();
            AppInsights.instance.logTrace(`[getOofUsers] ${JSON.stringify(channel)}`);

        } catch (error) {
            AppInsights.instance.logException(JSON.stringify(error));
            throw error;
        }

        return results;
    }

    /**
     * Adds a user to the Random Table
     * @param user The user that will be added.
     */
    public async addRandom(user: User) {
        try {
            if (!user.userChannel || !user.userChannel.id) {
                throw new Error('Could not add user because a channel was not provided.')
            }
            const pool = await sql.connect(Constants.SERVER_CONFIG);
            const data = await pool.request()
                .input('channelId', sql.NVarChar, user.userChannel.id)
                .input('userId', sql.NVarChar, user.id)
                .execute('usp_AddUserRandom');

            pool.close();
            sql.close();
            AppInsights.instance.logTrace(`[addRandom] ${JSON.stringify(user)}`);
        } catch (error) {
            AppInsights.instance.logException(JSON.stringify(error));
            throw error;
        }
    }

    /**
     * Remove a user to the Random Table
     * @param user The user that will be added.
     */
    public async removeRandom(user: User) {
        try {
            if (!user.userChannel || !user.userChannel.id) {
                throw new Error('Could not add user because a channel was not provided.')
            }
            const pool = await sql.connect(Constants.SERVER_CONFIG);
            const data = await pool.request()
                .input('channelId', sql.NVarChar, user.userChannel.id)
                .input('userId', sql.NVarChar, user.id)
                .execute('usp_RemoveUserRandom');

            pool.close();
            sql.close();
            AppInsights.instance.logTrace(`[removeRandom] ${JSON.stringify(user)}`);
        } catch (error) {
            AppInsights.instance.logException(JSON.stringify(error));
            throw error;
        }
    }
}
