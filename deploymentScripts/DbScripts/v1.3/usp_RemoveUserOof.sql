CREATE PROCEDURE usp_RemoveUserOof
    @channelId          NVARCHAR(255),
    @userId             NVARCHAR (255)

AS   
    SET NOCOUNT ON;  

    BEGIN TRANSACTION

        DECLARE @userFound         INT;
        DECLARE @removeUser        INT;
        DECLARE @otcuInternalTable TABLE (Internal_id INT);
        DECLARE @cobuoofInternalTable TABLE (Internal_id INT);

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

        -- Verify if the users exist on the oof table
        INSERT INTO @cobuoofInternalTable
        SELECT otcuInternal.Internal_id
        FROM @otcuInternalTable otcuInternal
        INNER JOIN ChannelsOtterBrassUserOOF cobuoof
        ON cobuoof.ChannelsOtterBrassUser_internal_id = otcuInternal.Internal_id

        SELECT @removeUser = COUNT(Internal_id)
        FROM @cobuoofInternalTable

        -- If user is not found in the OOF Table it means he has never used the feature so we add him.
       BEGIN
            SELECT TOP 1 @removeUser = Internal_id
            FROM @cobuoofInternalTable

            DELETE FROM [ChannelsOtterBrassUserOOF]
            WHERE Internal_Id = @removeUser

        END

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