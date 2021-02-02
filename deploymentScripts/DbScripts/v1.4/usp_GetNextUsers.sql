ALTER PROCEDURE usp_GetNextUsers
    @channelId          NVARCHAR(255),
    @howMany            INT

AS
    SET NOCOUNT ON;

        DECLARE @cobuInternalTable TABLE (User_internal_id   INT, Internal_id INT);
        INSERT INTO @cobuInternalTable
                SELECT cobu.User_internal_id, cobu.Internal_id
                FROM[Channels] c
                INNER JOIN [ChannelsOtterBrassUser] cobu
                ON c.Internal_id = cobu.Channel_internal_id
                WHERE c.id = @channelId

        SELECT TOP(@howMany) obu.Name, obu.Id, ur.Ranking
        FROM (
                SELECT cobuInt.User_internal_id, cobuInt.Internal_id
                FROM @cobuInternalTable cobuInt
                LEFT JOIN [ChannelsOtterBrassUserOOF] cobuoof -- We want the ones that are either Active or None or not present (maybe they have not been added as OOF ever)
                ON cobuInt.Internal_id = cobuoof.ChannelsOtterBrassUser_internal_id
                WHERE cobuoof.oofStatus = 0 OR cobuoof.oofStatus IS NULL
                OR cobuoof.oofStatus = 2 OR cobuoof.oofStatus = ''-- TODO: Change this for a table make life easier on CRUD operations.
            ) AS r
        INNER JOIN [UserRanking] ur
        ON ur.ChannelsOtterBrassUser_internalId = r.Internal_id
        INNER JOIN [OtterBrassUser] obu
        ON obu.Internal_id = r.User_internal_id
        ORDER BY Ranking, obu.Name ASC

         IF @@ERROR <> 0
         BEGIN
            -- Rollback the transaction
            ROLLBACK

            -- Raise an error and return
            RAISERROR ('Error in while updating the ranking.', 16, 1)
            RETURN
         END
GO