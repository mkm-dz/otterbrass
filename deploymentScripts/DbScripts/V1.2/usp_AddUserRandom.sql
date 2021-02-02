ALTER PROCEDURE usp_AddUserRandom
    @channelId          NVARCHAR(255),
    @userId             NVARCHAR (255)

AS   
    SET NOCOUNT ON;  

    BEGIN TRANSACTION

        DECLARE @userFound         INT;
        DECLARE @createUser        INT;
        DECLARE @otcuInternalTable TABLE (Internal_id INT);
        DECLARE @cobuRandomInternalTable TABLE (Internal_id INT);

        SET @userFound = 0;

        -- Verify if the users exist on the db and in the right channel.
        INSERT INTO @otcuInternalTable
            SELECT otcu.Internal_id
            FROM ChannelsOtterBrassUser otcu
            INNER JOIN OtterBrassUser otus
            ON otus.Internal_id = otcu.User_internal_id
            INNER JOIN Channels otch
            ON otch.Internal_id = otcu.Channel_internal_id
            WHERE otus.Id = @userId
            AND otch.Id = @channelId

        SELECT @userFound = COUNT(Internal_id)
        FROM @otcuInternalTable

        -- User should be registered before assigning them items
        IF @userFound < 1
        BEGIN
            ROLLBACK
            RETURN;
        END

        -- Verify if the user exist on the random table
        INSERT INTO @cobuRandomInternalTable
        SELECT otcuInternal.Internal_id
        FROM @otcuInternalTable otcuInternal
        INNER JOIN ChannelsOtterBrassUserRandom cobuRandom
        ON cobuRandom.ChannelsOtterBrassUser_internal_id = otcuInternal.Internal_id

        SELECT @createUser = COUNT(Internal_id)
        FROM @cobuRandomInternalTable

        -- We add the user only if he has not been added before
        IF @createUser < 1
        BEGIN
            SELECT TOP 1 @createUser = Internal_id
            FROM @otcuInternalTable

            INSERT INTO ChannelsOtterBrassUserRandom(ChannelsOtterBrassUser_internal_id)
            VALUES(@createUser)
        END
        ELSE

         IF @@ERROR <> 0
         BEGIN
            -- Rollback the transaction
            ROLLBACK

            -- Raise an error and return
            RAISERROR ('Error while updating Random Table status.', 16, 1)
            RETURN
         END
    COMMIT
GO