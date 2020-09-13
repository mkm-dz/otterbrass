import { User } from '../Models/User';
import { Channel } from '../Models/Channel';
import { EnumOofStatus } from '../Enums/EnumOofStatus';
import { EnumDaoResults } from '../Enums/EnumDaoResults';
import { Constants } from '../Common/Constants';

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
            if(!user.userChannel || !user.userChannel.id) {
                // TODO: Log exception gracefully.
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
        } catch (error) {
            // TODO: handle error gracefully.
            throw error;
        }
    }

    public async removeUser(user: User) {
        try {
            if(!user.userChannel || !user.userChannel.id) {
                // TODO: Log exception gracefully.
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
        } catch (error) {
            // TODO: handle error gracefully.
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
    public setOofStatus(channel: Channel,
        oofStatus: EnumOofStatus,
        users: User[]): Map<User, EnumDaoResults> {
        const result = new Map<User, EnumDaoResults>();

        // .NET Core 1.1 does not support datatables so it is the easiest to do this way.
        // foreach (User user in users)
        // {
        //     using (SqlConnection myConnection = new SqlConnection(Constants.SERVER_STRING))
        //     {
        //         try
        //         {
        //             SqlCommand sqlCmd = new SqlCommand();
        //             sqlCmd.CommandType = CommandType.StoredProcedure;
        //             sqlCmd.CommandText = "usp_SetOof";
        //             sqlCmd.Connection = myConnection;
        //             sqlCmd.Parameters.Add("@channelId", System.Data.SqlDbType.NVarChar, 255);
        //             sqlCmd.Parameters.Add("@userId", System.Data.SqlDbType.NVarChar, 255);
        //             sqlCmd.Parameters.Add("@oofStatus", System.Data.SqlDbType.Int, 255);
        //             sqlCmd.Parameters.Add("@result", System.Data.SqlDbType.Int);

        //             sqlCmd.Parameters["@channelId"].Value = channel.Id;
        //             sqlCmd.Parameters["@userId"].Value = user.Id;
        //             sqlCmd.Parameters["@oofStatus"].Value = (int)oofStatus;

        //             sqlCmd.Parameters["@result"].Direction = ParameterDirection.Output;

        //             myConnection.Open();
        //             sqlCmd.ExecuteNonQuery();

        //             EnumDaoResults recordResult = (EnumDaoResults)Convert.ToInt32(sqlCmd.Parameters["@result"].Value.ToString());
        //             result.Add(user, recordResult);
        //         }
        //         catch (Exception)
        //         {
        //             throw;
        //         }
        //         finally
        //         {
        //             myConnection.Close();
        //         }
        //     }
        // }

        return result;
    }

    /**
     * Gets the list of OOF users.
     * @param Channel The channel associated.
     * @param channel the list of users that OOF
     */
    public getOofUsers(channel: Channel): User[] {
        const results: User[] = [];
        // using (SqlConnection myConnection = new SqlConnection(Constants.SERVER_STRING))
        // {
        //     try
        //     {
        //         SqlCommand sqlCmd = new SqlCommand();
        //         sqlCmd.CommandType = CommandType.StoredProcedure;
        //         sqlCmd.CommandText = "usp_GetOofUsers";
        //         sqlCmd.Connection = myConnection;
        //         sqlCmd.Parameters.Add("@channelId", System.Data.SqlDbType.NVarChar, 255);

        //         sqlCmd.Parameters["@channelId"].Value = channel.Id;

        //         myConnection.Open();
        //         SqlDataReader reader = sqlCmd.ExecuteReader();
        //         while (reader.Read())
        //         {
        //             User currentUser = new User();
        //             currentUser.Id = reader["Id"].ToString();
        //             currentUser.Name = reader["Name"].ToString();
        //             currentUser.UserChannel = channel;
        //             results.Add(currentUser);
        //         }

        //         myConnection.Close();
        //     }
        //     catch (Exception)
        //     {
        //         throw;
        //     }
        // }

        return results;
    }

    /**
     * Adds a user to the Random Table
     * @param user The user that will be added.
     */
    public addRandom(user: User) {
        // using (SqlConnection myConnection = new SqlConnection(Constants.SERVER_STRING))
        // {
        //     try
        //     {
        //         SqlCommand sqlCmd = new SqlCommand();
        //         sqlCmd.CommandType = CommandType.StoredProcedure;
        //         sqlCmd.CommandText = "usp_AddUserRandom";
        //         sqlCmd.Connection = myConnection;

        //         sqlCmd.Parameters.Add("@channelId", System.Data.SqlDbType.NVarChar, 255);
        //         sqlCmd.Parameters.Add("@userId", System.Data.SqlDbType.NVarChar, 255);

        //         sqlCmd.Parameters["@channelId"].Value = user.UserChannel.Id;
        //         sqlCmd.Parameters["@userId"].Value = user.Id;

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
     * Remove a user to the Random Table
     * @param user The user that will be added.
     */
    public removeRandom(user: User) {
        // using (SqlConnection myConnection = new SqlConnection(Constants.SERVER_STRING))
        // {
        //     try
        //     {
        //         SqlCommand sqlCmd = new SqlCommand();
        //         sqlCmd.CommandType = CommandType.StoredProcedure;
        //         sqlCmd.CommandText = "usp_RemoveUserRandom";
        //         sqlCmd.Connection = myConnection;

        //         sqlCmd.Parameters.Add("@channelId", System.Data.SqlDbType.NVarChar, 255);
        //         sqlCmd.Parameters.Add("@userId", System.Data.SqlDbType.NVarChar, 255);

        //         sqlCmd.Parameters["@channelId"].Value = user.UserChannel.Id;
        //         sqlCmd.Parameters["@userId"].Value = user.Id;

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
}