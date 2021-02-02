ALTER PROCEDURE usp_RemoveUser
    @channelId          NVARCHAR(255),   
    @channelName        NVARCHAR(255),
    @userId             NVARCHAR(255),
    @userName           NVARCHAR(255)   
AS   
    SET NOCOUNT ON;  

    BEGIN TRANSACTION

    DECLARE @channelInternalTable TABLE (internal_id   INT);
    DECLARE @channelInternalIdCount INT;
    DECLARE @channelInternalId INT;

    -- GET THE CHANNEL INTERNAL ID

    SELECT @channelInternalIdCount = COUNT(Internal_id)
    FROM  [Channels]
    WHERE [Id] = @channelId

    IF @channelInternalIdCount < 1
    BEGIN
       RAISERROR ('Error, channel has not been added', 
               16, -- Severity
               1 -- State
               );  
    END
    ELSE
    BEGIN
        INSERT INTO @channelInternalTable(Internal_id)
            SELECT TOP(1)Internal_id
            FROM  [Channels]
            WHERE [Id] = @channelId 
    END

    IF @@ERROR <> 0
    BEGIN
        -- Rollback the transaction
        ROLLBACK

        -- Raise an error and return
        RAISERROR ('Error, channel has not been added', 16, 1)
        RETURN
    END

    SELECT TOP(1) @channelInternalId =  Internal_id
    FROM  @channelInternalTable


    -- GET THE USER INTERNAL ID
    DECLARE @userInternalIdTable TABLE (internal_id   INT);
    DECLARE @userInternalIdCount INT;
    DECLARE @userInternalId INT;

    SELECT @userInternalIdCount = COUNT(cobu.User_internal_id)
    FROM[Channels] c
    INNER JOIN [ChannelsOtterBrassUser] cobu
    ON c.Internal_id = cobu.Channel_internal_id
    INNER JOIN [OtterBrassUser] obu
    ON cobu.User_Internal_id = obu.Internal_Id
    WHERE c.id = @channelId
    AND obu.id = @userId

    IF @userInternalIdCount < 1
    BEGIN
        RAISERROR ('Error, user has not been added', 16, 1)
    END
    ELSE
    BEGIN
        INSERT INTO @userInternalIdTable(Internal_id)
            SELECT TOP(1) obu.Internal_id
            FROM[Channels] c
            INNER JOIN [ChannelsOtterBrassUser] cobu
            ON c.Internal_id = cobu.Channel_internal_id
            INNER JOIN [OtterBrassUser] obu
            ON cobu.User_Internal_id = obu.Internal_Id
            WHERE c.id = @channelId
            AND obu.id = @userId
    END

    IF @@ERROR <> 0
    BEGIN
        -- Rollback the transaction
        ROLLBACK

        -- Raise an error and return
        RAISERROR ('Error, user has not been added', 16, 1)
        RETURN
    END

    SELECT TOP(1) @userInternalId =  Internal_id
    FROM  @userInternalIdTable

    -- ADDING THE USER-CHANNEL RELATION
    DECLARE @userChannelsInternalTable TABLE (Internal_id  INT);
    DECLARE @userChannelsInternalIdCount INT;
    DECLARE @userChannelsInternalId INT;

    SELECT @userChannelsInternalIdCount = COUNT(Internal_id)
    FROM [ChannelsOtterBrassUser]
    WHERE [User_internal_id] = @userInternalId
    AND   [Channel_internal_id] = @channelInternalId

    IF @userChannelsInternalIdCount < 1
    BEGIN
        RAISERROR ('Error, specified user has not been added on that channel', 16, 1)
    END
    ELSE
    BEGIN

    INSERT INTO @userChannelsInternalTable(Internal_id)
          SELECT TOP(1) Internal_id
          FROM [ChannelsOtterBrassUser]
          WHERE [User_internal_id] = @userInternalId
          AND   [Channel_internal_id] = @channelInternalId

      EXEC usp_RemoveUserRandom @channelId,@userId
      EXEC usp_RemoveUserOof @channelId,@userId

      DELETE FROM [UserRanking]
      WHERE [ChannelsOtterBrassUser_internalId] IN 
      (SELECT [Internal_id]
       FROM @userChannelsInternalTable);
      
      ALTER TABLE [ChannelsOtterBrassUser] 
      DROP CONSTRAINT FK_OtterBrassUser;
      
      ALTER TABLE [ChannelsOtterBrassUser] 
      DROP CONSTRAINT FK_Channel;
      
      DELETE FROM [ChannelsOtterBrassUser]
      WHERE [User_internal_id] = @userInternalId
        AND   [Channel_internal_id] = @channelInternalId

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