-- Fixing an issue with data duplication on primary tables due to
-- a missing contrainst on two tables, This scripts adds the constrains
-- but it first clean data that do not complain with it.


BEGIN TRANSACTION

    -- Removing duplicated users

    DECLARE @duplicatedIdTable TABLE (Id   NVARCHAR(240));
    DECLARE @duplicatedIdLooper NVARCHAR(240);

    INSERT INTO @duplicatedIdTable(Id)
        SELECT Id FROM (
                SELECT COUNT(Id) as total, Id
                FROM [dbo].[OtterBrassUser]
                GROUP BY Id
        ) result
        WHERE result.total > 1

    -- Loop through ids
    DECLARE @RowCount INT = (SELECT COUNT(*) FROM @duplicatedIdTable);
    WHILE @RowCount > 0
    BEGIN
          SELECT @duplicatedIdLooper=[Id]
          FROM @duplicatedIdTable 
          ORDER BY [Id] DESC OFFSET @RowCount - 1 ROWS FETCH NEXT 1 ROWS ONLY;

          EXEC usp_purgeUser @duplicatedIdLooper

          SET @RowCount -= 1;
    END

    IF @@ERROR <> 0
    BEGIN
        -- Rollback the transaction
        ROLLBACK

        -- Raise an error and return
        RAISERROR ('Error while purging duplicated users, cannot continue update', 16, 1)
        RETURN
    END

   -- Removing duplicated channelIds

   DECLARE @duplicatedChannelIdTable TABLE (Id   NVARCHAR(240));
    DECLARE @duplicatedChannelIdLooper NVARCHAR(240);

    INSERT INTO @duplicatedChannelIdTable(Id)
        SELECT Id FROM (
                SELECT COUNT(Id) as total, Id
                FROM [dbo].[Channels]
                GROUP BY Id
        ) result
        WHERE result.total > 1

    -- Loop through ids
    DECLARE @ChannelRowCount INT = (SELECT COUNT(*) FROM @duplicatedChannelIdTable);
    WHILE @ChannelRowCount > 0
    BEGIN
          SELECT @duplicatedChannelIdLooper=[Id]
          FROM @duplicatedChannelIdTable 
          ORDER BY [Id] DESC OFFSET @ChannelRowCount - 1 ROWS FETCH NEXT 1 ROWS ONLY;

          EXEC usp_purgeChannel @duplicatedChannelIdLooper

          SET @ChannelRowCount -= 1;
    END

    IF @@ERROR <> 0
    BEGIN
        -- Rollback the transaction
        ROLLBACK

        -- Raise an error and return
        RAISERROR ('Error while purging duplicated channels, cannot continue update', 16, 1)
        RETURN
    END

    ALTER TABLE [OtterBrassUser]
    ALTER COLUMN Id NVARCHAR(440)

    ALTER TABLE [OtterBrassUser]
    ALTER COLUMN Name NVARCHAR(440)

    ALTER TABLE [Channels]
    ALTER COLUMN Id NVARCHAR(440)

    ALTER TABLE [OtterBrassUser] 
    ADD CONSTRAINT UK_UniqueIdConstraint UNIQUE(Id)

    ALTER TABLE [Channels] 
    ADD CONSTRAINT UK_ChannelsUniqueIdConstraint UNIQUE(Id)
COMMIT TRANSACTION