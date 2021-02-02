CREATE PROCEDURE usp_GetNextUsers
    @channelId          NVARCHAR(255),
    @howMany            INT

AS
    SET NOCOUNT ON;

        SELECT TOP(@howMany) obu.Name, obu.Id, ur.Ranking
        FROM (
                SELECT cobu.User_internal_id, cobu.Internal_id
                FROM[Channels] c
                INNER JOIN [ChannelsOtterBrassUser] cobu
                ON c.Internal_id = cobu.Channel_internal_id
                WHERE id = @channelId
            ) AS r
        INNER JOIN[UserRanking] ur
        ON ur.Internal_id = r.Internal_id
        INNER JOIN [OtterBrassUser] obu
        ON obu.Internal_id = r.User_internal_id
        ORDER BY Ranking ASC

         IF @@ERROR <> 0
         BEGIN
            -- Rollback the transaction
            ROLLBACK

            -- Raise an error and return
            RAISERROR ('Error in while updating the ranking.', 16, 1)
            RETURN
         END
GO