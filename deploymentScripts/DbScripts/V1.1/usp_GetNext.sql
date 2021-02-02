ALTER PROCEDURE usp_GetNext
    @channelId          NVARCHAR(255),
    @rankIncrement      FLOAT,
    @sentByUserId       NVARCHAR(255),

    @userName   NVARCHAR(255) OUTPUT,
    @userId     NVARCHAR(255) OUTPUT,
    @ranking   NVARCHAR(255) OUTPUT

AS   
    SET NOCOUNT ON;  

    BEGIN TRANSACTION

        DECLARE @currentRank FLOAT;
        DECLARE @rankingInternalId INT;

        SELECT TOP(1) @userName=obu.Name, @userId=obu.Id, @currentRank=ur.Ranking, @rankingInternalId=ur.Internal_id
        FROM (
                SELECT cobu.User_internal_id, cobu.Internal_id
                FROM[Channels] c
                INNER JOIN [ChannelsOtterBrassUser] cobu
                ON c.Internal_id = cobu.Channel_internal_id
                WHERE c.id = @channelId
            ) AS r
        INNER JOIN[UserRanking] ur
        ON ur.Internal_id = r.Internal_id
        INNER JOIN [OtterBrassUser] obu
        ON obu.Internal_id = r.User_internal_id
        WHERE obu.Id != @sentByUserId
        ORDER BY Ranking ASC

        SET @currentRank = @currentRank + @rankIncrement;
        SET @ranking=@currentRank;

        UPDATE [UserRanking]
        SET Ranking= @currentRank
        WHERE Internal_id=@rankingInternalId;

         IF @@ERROR <> 0
         BEGIN
            -- Rollback the transaction
            ROLLBACK

            -- Raise an error and return
            RAISERROR ('Error in while updating the ranking.', 16, 1)
            RETURN
         END

    COMMIT
GO