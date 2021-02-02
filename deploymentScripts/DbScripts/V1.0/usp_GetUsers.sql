CREATE PROCEDURE usp_GetUsers
    @channelId          NVARCHAR(255) 

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


    -- GET THE USERS INTERNAL ID
    DECLARE @userInternalIdTable TABLE (internal_id   INT);
    DECLARE @userInternalIdCount INT;
    DECLARE @userInternalId INT;

    BEGIN
        INSERT INTO @userInternalIdTable(Internal_id)
            SELECT [Internal_id]
            FROM  [ChannelsOtterBrassUser]
            WHERE [Channel_internal_id] = @channelInternalId 
    END

    IF @@ERROR <> 0
    BEGIN
        -- Rollback the transaction
        ROLLBACK

        -- Raise an error and return
        RAISERROR ('Error, user has not been added', 16, 1)
        RETURN
    END

    -- GET THE USERS
    
    SELECT Id, [Name]
    FROM [OtterBrassUser]
    WHERE [Internal_Id] IN
      (SELECT [Internal_Id]
        FROM @userInternalIdTable);

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