CREATE PROCEDURE usp_SetChannelRandomness
    @channelId          NVARCHAR(255),
    @randomLevel        INT
AS
    SET NOCOUNT ON;  

    BEGIN TRANSACTION

        DECLARE @channelFound      INT;

        SET @channelFound = 0;

        -- Verifying that the channel exists.
        SELECT @channelFound = COUNT(Internal_id)
        FROM [dbo].[Channels] c
        WHERE c.Id = @channelId;

        -- User should be registered before assigning them items
        IF @channelFound < 1
        BEGIN
            ROLLBACK
            RETURN;
        END

        UPDATE [dbo].[Channels]
        SET RandomLevel = @randomLevel
        WHERE Id = @channelId

         IF @@ERROR <> 0
         BEGIN
            -- Rollback the transaction
            ROLLBACK

            -- Raise an error and return
            RAISERROR ('Error while updating channel Randomness.', 16, 1)
            RETURN
         END
    COMMIT
GO