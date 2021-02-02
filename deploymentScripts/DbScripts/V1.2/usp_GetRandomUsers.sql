CREATE PROCEDURE usp_GetRandomUsers
    @channelId          NVARCHAR(255)

AS
    SET NOCOUNT ON;

        DECLARE @cobuInternalTable TABLE (User_internal_id   INT, Internal_id INT);

        -- Selecting users ([ChannelsOtterBrassUser]) that match channel
        INSERT INTO @cobuInternalTable
                SELECT cobu.User_internal_id, cobu.Internal_id
                FROM[Channels] c
                INNER JOIN [ChannelsOtterBrassUser] cobu
                ON c.Internal_id = cobu.Channel_internal_id
                WHERE c.id = @channelId

        SELECT obu.Name, obu.Id
        FROM (
                SELECT cobuInt.User_internal_id, cobuInt.Internal_id
                FROM @cobuInternalTable cobuInt
                INNER JOIN [ChannelsOtterBrassUserRandom] cobur -- we want to join with the users marked for randomness
                ON cobur.ChannelsOtterBrassUser_internal_id = cobuInt.Internal_id
                LEFT JOIN [ChannelsOtterBrassUserOOF] cobuoof -- We want the ones that are either Active or None (maybe they have not been added as OOF ever)
                ON cobuInt.Internal_id = cobuoof.ChannelsOtterBrassUser_internal_id
                WHERE cobuoof.oofStatus = 0 OR cobuoof.oofStatus IS NULL -- TODO: Change this for a table make life easier on CRUD operations.
            ) AS r
        INNER JOIN [OtterBrassUser] obu
        ON obu.Internal_id = r.User_internal_id
GO