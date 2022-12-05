-- DUE TO THE DESTRUCTIVE NATURE OF THIS SCRIPT FIRST THING WE NEED TO DO IS TO DISSASOCIATE ALL THE USERS, as ALL THE INFORMATION LINKED TO CHANNEL
-- WILL BE DELETED.

CREATE PROCEDURE usp_purgeChannel
    @channelId             NVARCHAR(255)
AS   
    SET NOCOUNT ON;  

    BEGIN TRANSACTION

    -- GET THE CHANNEL INTERNAL ID
    DECLARE @channelInternalIdTable TABLE (Internal_id   INT);
    DECLARE @channelInternalIdCount INT;

    SELECT @channelInternalIdCount = COUNT(c.id)
    FROM[Channels] c
    WHERE c.id = @channelId

    IF @channelInternalIdCount < 1
    BEGIN
        RAISERROR ('Error, Channel is not present in the channel table so I cannot force delete them', 16, 1)
    END
    ELSE
    BEGIN
        INSERT INTO @channelInternalIdTable(Internal_id)
            SELECT c.Internal_id
            FROM[Channels] c
            WHERE c.id = @channelId
    END

     IF @@ERROR <> 0
    BEGIN
        -- Rollback the transaction
        ROLLBACK

        -- Raise an error and return
        RAISERROR ('Error, channel was not deleted', 16, 1)
        RETURN
    END

        -- GET ALL THE USERS
    DECLARE @usersIdNameTable  TABLE (Id  NVARCHAR(455), Name NVARCHAR(455));
    DECLARE @usersIdNameTableCount INT;

    SELECT @usersIdNameTableCount = COUNT(Internal_id)
    FROM [ChannelsOtterBrassUser]
    WHERE [Channel_internal_id] IN (
        SELECT [Internal_id]
        FROM @channelInternalIdTable);

    IF @usersIdNameTableCount < 1
    BEGIN
        RAISERROR ('Error, Channel is not present in the user-channel relation table so I cannot force delete them', 16, 1)
    END
    ELSE
    BEGIN

    INSERT INTO @usersIdNameTable(Id, Name)
          SELECT obu.Id, obu.Name
          FROM [OtterBrassUser] obu
          INNER JOIN [ChannelsOtterBrassUser] cobu
          ON cobu.[User_internal_id] = obu.[Internal_id]
          WHERE cobu.[Channel_internal_id] IN (
        SELECT [Internal_Id]
        FROM @channelInternalIdTable);
    END

    -- LOOP THROUGH THE CHANNELS FOUND
      DECLARE @OuterRowCount INT = (SELECT COUNT(*) FROM @channelInternalIdTable);
      DECLARE @OuterChannelIdLooper NVARCHAR(455);
      DECLARE @OuterChannelNameLooper NVARCHAR(455);
      WHILE @OuterRowCount > 0 BEGIN
          SELECT @OuterChannelIdLooper=[Id], @OuterChannelNameLooper=[Name]
          FROM [Channels] c
          WHERE c.[Internal_id] IN (
            SELECT [Internal_id]
            FROM @channelInternalIdTable)
          ORDER BY [Internal_id] DESC OFFSET @OuterRowCount - 1 ROWS FETCH NEXT 1 ROWS ONLY;

                -- Then loop through the users associated to the channel

                  DECLARE @RowCount INT = (SELECT COUNT(*) FROM @usersIdNameTable);
                  DECLARE @UserIdLooper NVARCHAR(455);
                  DECLARE @userNameLooper NVARCHAR (455);

                  WHILE @RowCount > 0 BEGIN
                      SELECT @UserIdLooper=[Id], @userNameLooper=[Name]
                      FROM @usersIdNameTable 
                      ORDER BY [Id] DESC OFFSET @RowCount - 1 ROWS FETCH NEXT 1 ROWS ONLY;

                        EXEC usp_RemoveUser @OuterChannelIdLooper,@OuterChannelNameLooper,@UserIdLooper,@userNameLooper

                      SET @RowCount -= 1;
                  END
          SET @OuterRowCount -= 1;
      END

    IF @@ERROR <> 0
    BEGIN
        -- Rollback the transaction
        ROLLBACK

        -- Raise an error and return
        RAISERROR ('Error, channel was not deleted', 16, 1)
        RETURN
    END


    -- REMOVING THE USER-CHANNEL RELATION
    DECLARE @userChannelsInternalTable TABLE (Internal_id  INT);
    DECLARE @userChannelsInternalIdCount INT;
    DECLARE @userChannelsInternalId INT;
    DECLARE @totalNumberOfChannelsAdded INT;

    SELECT @userChannelsInternalIdCount = COUNT(Internal_id)
    FROM [ChannelsOtterBrassUser]
    WHERE [Channel_internal_id] IN (
        SELECT [Internal_Id]
        FROM @channelInternalIdTable);

    IF @userChannelsInternalIdCount < 1
    BEGIN
        RAISERROR ('Error, Channel is not present in the user table so I cannot force delete them', 16, 1)
    END
    ELSE
    BEGIN

      ALTER TABLE [ChannelsOtterBrassUser] 
      DROP CONSTRAINT FK_OtterBrassUser;
      
      ALTER TABLE [ChannelsOtterBrassUser] 
      DROP CONSTRAINT FK_Channel;
      
      DELETE FROM [ChannelsOtterBrassUser]
      WHERE [Channel_internal_id] IN (
        SELECT [Internal_Id]
        FROM @channelInternalIdTable);

      ALTER TABLE [ChannelsOtterBrassUser] ADD CONSTRAINT FK_OtterBrassUser FOREIGN KEY (User_internal_id) REFERENCES OtterBrassUser(Internal_id);
      ALTER TABLE [ChannelsOtterBrassUser] ADD CONSTRAINT FK_Channel FOREIGN KEY (Channel_internal_id) REFERENCES Channels(Internal_id);

    END

    IF @@ERROR <> 0
    BEGIN
        -- Rollback the transaction
        ROLLBACK

        -- Raise an error and return
        RAISERROR ('Error in while deleting the user-channel relation.', 16, 1)
        RETURN
    END

    -- DELETE THE CHANNEL
    DELETE FROM [Channels]
    WHERE id = @channelId

        IF @@ERROR <> 0
    BEGIN
        -- Rollback the transaction
        ROLLBACK

        -- Raise an error and return
        RAISERROR ('Error in while deleting the channel.', 16, 1)
        RETURN
    END

    COMMIT TRANSACTION
GO