import { Channel } from '../Models/Channel';
import { EnumShirtSize } from '../Enums/EnumShirtSize';
import { User } from '../Models/User';
import { EnumDaoResults } from '../Enums/EnumDaoResults';
import { Constants } from '../Common/Constants';

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
    public nextInLine(channel: Channel, size: EnumShirtSize, sentByUser: User): User | null {
        if (!sentByUser || !sentByUser.id) {
            return null;
        }

        const user: User | null = null;

        // using (SqlConnection myConnection = new SqlConnection(Constants.SERVER_STRING))
        // {
        //     try
        //     {
        //         SqlCommand sqlCmd = new SqlCommand();
        //         sqlCmd.CommandType = CommandType.StoredProcedure;
        //         sqlCmd.CommandText = "usp_GetNext";
        //         sqlCmd.Connection = myConnection;
        //         sqlCmd.Parameters.Add("@channelId", System.Data.SqlDbType.NVarChar, 255);
        //         sqlCmd.Parameters.Add("@rankIncrement", System.Data.SqlDbType.Float);
        //         sqlCmd.Parameters.Add("@sentByUserId", System.Data.SqlDbType.NVarChar, 255);
        //         sqlCmd.Parameters.Add("@userName", System.Data.SqlDbType.NVarChar, 255);
        //         sqlCmd.Parameters.Add("@userId", System.Data.SqlDbType.NVarChar, 255);
        //         sqlCmd.Parameters.Add("@ranking", System.Data.SqlDbType.NVarChar, 255);

        //         sqlCmd.Parameters["@channelId"].Value = channel.Id;
        //         sqlCmd.Parameters["@rankIncrement"].Value = (int)size;
        //         sqlCmd.Parameters["@sentByUserId"].Value = sentByUser.Id;

        //         sqlCmd.Parameters["@userName"].Direction = ParameterDirection.Output;
        //         sqlCmd.Parameters["@userId"].Direction = ParameterDirection.Output;
        //         sqlCmd.Parameters["@ranking"].Direction = ParameterDirection.Output;

        //         myConnection.Open();
        //         sqlCmd.ExecuteNonQuery();

        //         if (!String.IsNullOrEmpty(sqlCmd.Parameters["@userId"].Value.ToString()))
        //         {
        //             user = new User();
        //             user.UserChannel = channel;
        //             user.Name = sqlCmd.Parameters["@userName"].Value.ToString();
        //             user.Id = sqlCmd.Parameters["@userId"].Value.ToString();
        //         }

        //         myConnection.Close();
        //     }
        //     catch (Exception)
        //     {
        //         throw;
        //     }
        // }

        return user;
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
            // TODO: handle error gracefully.
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
            // TODO: handle error gracefully.
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
            // TODO: when I wrote this .NET Core 1.1 did not support datatables so it was the easiest to do this way.
            // foreach(User user in users) this can be changed when this is transformed into a REST API call
            for(const user of users) {
                const pool = await sql.connect(Constants.SERVER_CONFIG);
                const data = await pool.request()
                    .input('channelId', sql.NVarChar, '19:feca88094f7e44cdbdd0e98de4a7bd51@thread.skype')
                    .input('rankIncrement', sql.Float, 3)
                    .input('userId', sql.NVarChar, '29:1G1P0LhPNI4AOEPfqqdMfQD9mbAuDAa2Ded04zvtg8jDWwrjYogGEqTSliDGsU_Oswi2Wpj_TT-jl_aEuSKTkrQ')
                    .output('result', sql.Int)
                    .execute('usp_Assign');

                results.set(user, data.parameters.result);

                pool.close();
                sql.close();
            }
            return results;
        } catch (error) {
            // TODO: handle error gracefully.
            throw error;
        }
    }

    /**
     * Sets the channel randomness
     * @param channel The channel that will have the randomness set.
     * @param randomness The level of randomness assigned to the channel.
     */
    public setChannelRandomness(channel: Channel, randomness: number) {
        // using (SqlConnection myConnection = new SqlConnection(Constants.SERVER_STRING))
        // {
        //     try
        //     {
        //         SqlCommand sqlCmd = new SqlCommand();
        //         sqlCmd.CommandType = CommandType.StoredProcedure;
        //         sqlCmd.CommandText = "usp_SetChannelRandomness";
        //         sqlCmd.Connection = myConnection;

        //         sqlCmd.Parameters.Add("@channelId", System.Data.SqlDbType.NVarChar, 255);
        //         sqlCmd.Parameters.Add("@randomLevel", System.Data.SqlDbType.Int);

        //         sqlCmd.Parameters["@channelId"].Value = channel.Id;
        //         sqlCmd.Parameters["@randomLevel"].Value = randomness;

        //         myConnection.Open();
        //         sqlCmd.ExecuteNonQuery();
        //         myConnection.Close();
        //     }
        //     catch (Exception)
        //     {
        //         throw;
        //     }
        // }
    }

    /**
     * Gets tha randomness level of a channel
     * @param channel A channel from which we want to retrieve the randomness level.</param>
     * <returns>A channel that contains the randomness level
     */
    public getChannelRandomness(channel: Channel): Channel | null {
        return null;
        // if (!channel)
        // {
        //     return null;
        // }

        // const results :User[] = [];

        // using (SqlConnection myConnection = new SqlConnection(Constants.SERVER_STRING))
        // {
        //     try
        //     {
        //         int channelRandomness = -1;
        //         SqlCommand sqlCmd = new SqlCommand();
        //         sqlCmd.CommandType = CommandType.StoredProcedure;
        //         sqlCmd.CommandText = "usp_GetChannelRandomness";
        //         sqlCmd.Connection = myConnection;
        //         sqlCmd.Parameters.Add("@channelId", System.Data.SqlDbType.NVarChar, 255);

        //         sqlCmd.Parameters["@channelId"].Value = channel.Id;

        //         myConnection.Open();
        //         SqlDataReader reader = sqlCmd.ExecuteReader();
        //         while (reader.Read())
        //         {
        //             if(-1 == channelRandomness)
        //             {
        //                 channelRandomness = Convert.ToInt32(reader["RandomLevel"].ToString());
        //             }
        //             else if(channelRandomness != Convert.ToInt32(reader["RandomLevel"].ToString()))
        //             {
        //                 throw new Exception("Channel randomness does not match all the values");
        //             }
        //         }

        //         channel.Randomness = channelRandomness;
        //         return channel;
        //     }
        //     catch (Exception)
        //     {
        //         throw;
        //     }
        //     finally
        //     {
        //         myConnection.Close();
        //     }
    }
}