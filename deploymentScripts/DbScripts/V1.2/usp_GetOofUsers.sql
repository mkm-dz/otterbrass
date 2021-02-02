CREATE PROCEDURE usp_GetOofUsers
    @channelId          NVARCHAR(255)

AS
    SET NOCOUNT ON;  

    BEGIN TRANSACTION

         SELECT obu.Name as [Name], obu.Internal_id as Id
         FROM[Channels] c
         INNER JOIN [ChannelsOtterBrassUser] cobu
         ON c.Internal_id = cobu.Channel_internal_id
         INNER JOIN [OtterBrassUser] obu
         ON cobu.User_internal_id = obu.Internal_id
         INNER JOIN [ChannelsOtterBrassUserOOF] cobuoof
         ON cobu.Internal_Id = cobuoof.ChannelsOtterBrassUser_internal_id
         WHERE c.id = @channelId
         AND cobuoof.oofStatus = 1 -- Change this code to get the value from a table.

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