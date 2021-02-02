ALTER PROCEDURE usp_Assign
    @channelId          NVARCHAR(255),
    @rankIncrement      FLOAT,
    @userId             NVARCHAR (255),
    @result             INT OUTPUT

AS   
    SET NOCOUNT ON;  

    BEGIN TRANSACTION

        DECLARE @currentRank       FLOAT;
        DECLARE @rankingInternalId INT;
        DECLARE @userFound         INT;

        SET @userFound = 0;

        -- Verify if the users exist on the db and in the right channel.
        SELECT @userFound = COUNT(otcu.Internal_id)
        FROM ChannelsOtterBrassUser otcu
        INNER JOIN OtterBrassUser otus
        ON otus.Internal_id = otcu.User_internal_id
        INNER JOIN Channels otch
        ON otch.Internal_id = otcu.Channel_internal_id
        WHERE otus.Id = @userId
        AND otch.Id = @channelId

        -- User should be registered before assigning them items
        IF @userFound < 1
        BEGIN
            SET @result = -1;
            ROLLBACK
            RETURN;
        END

        UPDATE UserRanking
        SET [Ranking] = [Ranking] + @rankIncrement
        WHERE [UserRanking].[Internal_Id] IN
         (
            SELECT otcu.Internal_id
            FROM ChannelsOtterBrassUser otcu
            INNER JOIN OtterBrassUser otus
            ON otus.Internal_id = otcu.User_internal_id
            INNER JOIN Channels otch
            ON otch.Internal_id = otcu.Channel_internal_id
            WHERE otus.Id = @userId
            AND otch.Id = @channelId
        )

         IF @@ERROR <> 0
         BEGIN
            -- Rollback the transaction
            ROLLBACK

            -- Raise an error and return
            RAISERROR ('Error in while updating the ranking.', 16, 1)
            RETURN
         END

        SET @result = 1;
    COMMIT
GO