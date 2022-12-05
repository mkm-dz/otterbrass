-- Forces delete (purges) data associated to a specific user 
-- CAUTION DELETES DATA FROM ALL CHANNELS

CREATE PROCEDURE usp_purgeUser
    @userId             NVARCHAR(255)
AS   
    SET NOCOUNT ON;  

    BEGIN TRANSACTION

    -- GET THE USER INTERNAL ID
    DECLARE @userInternalIdTable TABLE (internal_id   INT);
    DECLARE @userInternalIdCount INT;

    SELECT @userInternalIdCount = COUNT(cobu.User_internal_id)
    FROM[Channels] c
    INNER JOIN [ChannelsOtterBrassUser] cobu
    ON c.Internal_id = cobu.Channel_internal_id
    INNER JOIN [OtterBrassUser] obu
    ON cobu.User_Internal_id = obu.Internal_Id
    AND obu.id = @userId

    IF @userInternalIdCount < 1
    BEGIN
        RAISERROR ('Error, User is not present in the user table so I cannot force delete them', 16, 1)
    END
    ELSE
    BEGIN
        INSERT INTO @userInternalIdTable(Internal_id)
            SELECT obu.Internal_id
            FROM[Channels] c
            INNER JOIN [ChannelsOtterBrassUser] cobu
            ON c.Internal_id = cobu.Channel_internal_id
            INNER JOIN [OtterBrassUser] obu
            ON cobu.User_Internal_id = obu.Internal_Id
            WHERE obu.id = @userId
    END

     IF @@ERROR <> 0
    BEGIN
        -- Rollback the transaction
        ROLLBACK

        -- Raise an error and return
        RAISERROR ('Error, user was not deleted', 16, 1)
        RETURN
    END


    -- REMOVING THE USER-CHANNEL RELATION
    DECLARE @userChannelsInternalTable TABLE (Internal_id  INT);
    DECLARE @userChannelsInternalIdCount INT;
    DECLARE @userChannelsInternalId INT;
    DECLARE @totalNumberOfChannelsAdded INT;

    SELECT @userChannelsInternalIdCount = COUNT(Internal_id)
    FROM [ChannelsOtterBrassUser]
    WHERE [User_internal_id] IN (
        SELECT [Internal_Id]
        FROM @userInternalIdTable);

    IF @userChannelsInternalIdCount < 1
    BEGIN
        RAISERROR ('Error, User is not present in the user table so I cannot force delete them', 16, 1)
    END
    ELSE
    BEGIN

    INSERT INTO @userChannelsInternalTable(Internal_id)
          SELECT Internal_id
          FROM [ChannelsOtterBrassUser]
          WHERE [User_internal_id] IN (
        SELECT [Internal_Id]
        FROM @userInternalIdTable);

    
    -- Loop through channels
      DECLARE @RowCount INT = (SELECT COUNT(*) FROM @userChannelsInternalTable);
      DECLARE @ChannelInternalIdLooper INT;

      WHILE @RowCount > 0 BEGIN
          SELECT @ChannelInternalIdLooper=[Internal_id]
          FROM @userChannelsInternalTable 
          ORDER BY [Internal_id] DESC OFFSET @RowCount - 1 ROWS FETCH NEXT 1 ROWS ONLY;

          EXEC usp_RemoveUserRandom @ChannelInternalIdLooper,@userId
          EXEC usp_RemoveUserOof @ChannelInternalIdLooper,@userId

          SET @RowCount -= 1;
      END

      DELETE FROM [UserRanking]
      WHERE [ChannelsOtterBrassUser_internalId] IN 
      (SELECT [Internal_id]
       FROM @userChannelsInternalTable);
      
      ALTER TABLE [ChannelsOtterBrassUser] 
      DROP CONSTRAINT FK_OtterBrassUser;
      
      ALTER TABLE [ChannelsOtterBrassUser] 
      DROP CONSTRAINT FK_Channel;
      
      DELETE FROM [ChannelsOtterBrassUser]
      WHERE [User_internal_id] IN (
        SELECT [Internal_Id]
        FROM @userInternalIdTable);

      -- If it is the only/last channel were user exist also drop it from the user table
      SELECT @totalNumberOfChannelsAdded = COUNT(Internal_id)
      FROM [ChannelsOtterBrassUser]
      WHERE [User_internal_id] IN (
        SELECT [Internal_Id]
        FROM @userInternalIdTable);

      IF @totalNumberOfChannelsAdded < 1
      BEGIN
        DELETE FROM [OtterBrassUser]
        WHERE [Id] = @userId
      END

      ALTER TABLE [ChannelsOtterBrassUser] ADD CONSTRAINT FK_OtterBrassUser FOREIGN KEY (User_internal_id) REFERENCES OtterBrassUser(Internal_id);
      ALTER TABLE [ChannelsOtterBrassUser] ADD CONSTRAINT FK_Channel FOREIGN KEY (Channel_internal_id) REFERENCES Channels(Internal_id);

    END

    IF @@ERROR <> 0
    BEGIN
        -- Rollback the transaction
        ROLLBACK

        -- Raise an error and return
        RAISERROR ('Error in while deleting the user.', 16, 1)
        RETURN
    END

    COMMIT
GO