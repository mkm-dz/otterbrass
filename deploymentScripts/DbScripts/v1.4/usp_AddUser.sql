ALTER PROCEDURE usp_AddUser
    @channelId          NVARCHAR(255),   
    @channelName        NVARCHAR(255),
    @userId             NVARCHAR(255),
    @userName           NVARCHAR(255),
    @randomLevel        INT
AS   
    SET NOCOUNT ON;  

    BEGIN TRANSACTION

    DECLARE @defaultRanking INT;
    SET @defaultRanking = 0;

    -- ADDING THE CHANNEL
    DECLARE @channelInternalTable TABLE (internal_id   INT);
    DECLARE @channelInternalIdCount INT;
    DECLARE @channelInternalId INT;

    SELECT @channelInternalIdCount = COUNT(Internal_id)
    FROM  [Channels]
    WHERE [Id] = @channelId

    IF @channelInternalIdCount < 1
    BEGIN
        INSERT INTO Channels([Id], [Name], [RandomLevel])
        OUTPUT INSERTED.Internal_id INTO @channelInternalTable
        VALUES(@channelId, @channelName, @randomLevel)
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
        RAISERROR ('Error in while inserting a new channel.', 16, 1)
        RETURN
    END

    SELECT TOP(1) @channelInternalId =  Internal_id
    FROM  @channelInternalTable


    -- ADDING THE USER
    DECLARE @userInternalIdTable TABLE (internal_id   INT);
    DECLARE @userInternalIdCount INT;
    DECLARE @userInternalId INT;

    SELECT @userInternalIdCount = COUNT(Internal_id)
    FROM [OtterBrassUser]
    WHERE [Id] = @userId

    IF @userInternalIdCount < 1
    BEGIN
        INSERT INTO OtterBrassUser([Id], [Name])
        OUTPUT INSERTED.Internal_id INTO @userInternalIdTable
        VALUES(@userId, @userName)
    END
    ELSE
    BEGIN
        INSERT INTO @userInternalIdTable(Internal_id)
            SELECT TOP(1) Internal_id
            FROM  [OtterBrassUser]
            WHERE [Id] = @userId 
    END

    IF @@ERROR <> 0
    BEGIN
        -- Rollback the transaction
        ROLLBACK

        -- Raise an error and return
        RAISERROR ('Error in while inserting a new user.', 16, 1)
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

    
    -- SETTING THE DEFAULT RANKING, THIS WILL PREVENT A BUG WHERE A NEW USER IS ADDED WITH 0 AND THEM WILL GET 
    -- ALL THE ELEMENTS ASSIGNED UNTIL THEM CATCH UP WITH THE REST OF THE PEOPLE

    DECLARE @channelUsers TABLE(Internal_id INT);
    DECLARE @minRankingCount INT;

    INSERT INTO @channelUsers
    SELECT [Internal_Id]
    FROM [ChannelsOtterBrassUser]
    WHERE [Channel_internal_id] = @channelInternalId;

    SELECT @minRankingCount = COUNT(Internal_Id)
    FROM @channelUsers;
    -- END MIN RANKING

    IF @userChannelsInternalIdCount < 1
    BEGIN
        INSERT INTO ChannelsOtterBrassUser([Channel_internal_id], [User_internal_id])
        OUTPUT INSERTED.Internal_id INTO @userChannelsInternalTable
        VALUES(@channelInternalId, @userInternalId)
    END
    ELSE
    BEGIN
        INSERT INTO @userChannelsInternalTable(Internal_id)
            SELECT TOP(1) Internal_id
            FROM  [ChannelsOtterBrassUser]
            WHERE [User_internal_id] = @userInternalId
            AND   [Channel_internal_id] = @channelInternalId
    END

    IF @@ERROR <> 0
    BEGIN
        -- Rollback the transaction
        ROLLBACK

        -- Raise an error and return
        RAISERROR ('Error in while inserting a new userChannel relation.', 16, 1)
        RETURN
    END

    -- GETTING THE MIN RANKING
    IF @minRankingCount < 1
    BEGIN
        SET @defaultRanking = 0;
    END
    ELSE
    BEGIN
        SELECT TOP(1) @defaultRanking = [Ranking]
        FROM [UserRanking]
        WHERE [ChannelsOtterBrassUser_internalId] IN
            (SELECT [Internal_Id]
             FROM @channelUsers)
        ORDER BY [Ranking] ASC;
    END
    -- END MIN RANKING

    SELECT TOP(1) @userChannelsInternalId =  Internal_id
    FROM  @userChannelsInternalTable

    -- ADDING THE USER RANKING
    DECLARE @rankingTable TABLE (Internal_id  INT);
    DECLARE @rankingCount INT;

    SELECT @rankingCount = COUNT(Internal_id)
    FROM [UserRanking]
    WHERE [ChannelsOtterBrassUser_internalId] = @userChannelsInternalId


    IF @rankingCount < 1
    BEGIN
        INSERT INTO UserRanking(ChannelsOtterBrassUser_internalId, Ranking)
        VALUES(@userChannelsInternalId, @defaultRanking)
    END

    IF @@ERROR <> 0
    BEGIN
        -- Rollback the transaction
        ROLLBACK

        -- Raise an error and return
        RAISERROR ('Error in while inserting a new ranking.', 16, 1)
        RETURN
    END

    COMMIT
GO