CREATE PROCEDURE usp_GetChannelRandomness
    @channelId          NVARCHAR(255)
AS
    SET NOCOUNT ON;  

        SELECT RandomLevel
        FROM [dbo].[Channels]
        WHERE Id = @channelId
GO