import { Channel } from '../Models/Channel';
import { EnumShirtSize } from '../Enums/EnumShirtSize';
import { User } from '../Models/User';
import { EnumDaoResults } from '../Enums/EnumDaoResults';

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
    public nextUsers(channel: Channel, howMany: number): User[] {
        const results: User[] = []
        // using (SqlConnection myConnection = new SqlConnection(Constants.SERVER_STRING))
        // {
        //     try
        //     {
        //         SqlCommand sqlCmd = new SqlCommand();
        //         sqlCmd.CommandType = CommandType.StoredProcedure;
        //         sqlCmd.CommandText = "usp_GetNextUsers";
        //         sqlCmd.Connection = myConnection;
        //         sqlCmd.Parameters.Add("@channelId", System.Data.SqlDbType.NVarChar, 255);
        //         sqlCmd.Parameters.Add("@howMany", System.Data.SqlDbType.Int);

        //         sqlCmd.Parameters["@channelId"].Value = channel.Id;
        //         sqlCmd.Parameters["@howMany"].Value = howMany;

        //         myConnection.Open();
        //         SqlDataReader reader = sqlCmd.ExecuteReader();
        //         while (reader.Read())
        //         {
        //             User currentUser = new User();
        //             currentUser.Id = reader["Id"].ToString();
        //             currentUser.Name = reader["Name"].ToString();
        //             currentUser.Rank = Convert.ToDouble(reader["Ranking"]);
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
     * Gets the next random user in line (without incrementing it's rank)
     * @param channel The channel associated.
     */
    public getNextRandomUsers(channel: Channel): User[] {
        const results: User[] = [];

        // using (SqlConnection myConnection = new SqlConnection(Constants.SERVER_STRING))
        // {
        //     try
        //     {
        //         SqlCommand sqlCmd = new SqlCommand();
        //         sqlCmd.CommandType = CommandType.StoredProcedure;
        //         sqlCmd.CommandText = "usp_GetRandomUsers";
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
        //     }
        //     catch (Exception)
        //     {
        //         throw;
        //     }
        //     finally
        //     {
        //         myConnection.Close();
        //     }
        // }

        return results;
    }

    /**
     * Assigns the item to a specific list of users.
     * @param channel The channel associated to this item.
     * @param size The sizeof the review.
     * @param users The list of users that will have the item assigned.
     */
    public assign(channel: Channel, size: EnumShirtSize, users: User[]): Map<User, EnumDaoResults> {
        const result = new Map<User, EnumDaoResults>();

        // // .NET Core 1.1 does not support datatables so it is the easiest to do this way.
        // foreach(User user in users)
        // {
        //     using (SqlConnection myConnection = new SqlConnection(Constants.SERVER_STRING))
        //     {
        //         try
        //         {
        //             SqlCommand sqlCmd = new SqlCommand();
        //             sqlCmd.CommandType = CommandType.StoredProcedure;
        //             sqlCmd.CommandText = "usp_Assign";
        //             sqlCmd.Connection = myConnection;
        //             sqlCmd.Parameters.Add("@channelId", System.Data.SqlDbType.NVarChar, 255);
        //             sqlCmd.Parameters.Add("@rankIncrement", System.Data.SqlDbType.Float);
        //             sqlCmd.Parameters.Add("@userId", System.Data.SqlDbType.NVarChar, 255);
        //             sqlCmd.Parameters.Add("@result", System.Data.SqlDbType.Int);

        //             sqlCmd.Parameters["@channelId"].Value = channel.Id;
        //             sqlCmd.Parameters["@userId"].Value = user.Id;
        //             sqlCmd.Parameters["@rankIncrement"].Value = (int)size;

        //             sqlCmd.Parameters["@result"].Direction = ParameterDirection.Output;

        //             myConnection.Open();
        //             sqlCmd.ExecuteNonQuery();

        //             EnumDaoResults recordResult = (EnumDaoResults)Convert.ToInt32(sqlCmd.Parameters["@result"].Value.ToString());
        //             result.Add(user, recordResult);

        //             myConnection.Close();
        //         }
        //         catch (Exception)
        //         {
        //             throw;
        //         }
        //     }
        // }

        return result;
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