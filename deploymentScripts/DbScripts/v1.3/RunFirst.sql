sp_rename 'dbo.UserRanking', 'Old_UserRanking'

CREATE TABLE UserRanking (
    Internal_id INT NOT NULL IDENTITY PRIMARY KEY,
    ChannelsOtterBrassUser_internalId INT NOT NULL,
    Ranking FLOAT
);

INSERT INTO UserRanking(ChannelsOtterBrassUser_internalId, Ranking)
SELECT ChannelsOtterBrassUser_internalId,
    Ranking
 FROM dbo.Old_UserRanking dd 

DROP TABLE Old_UserRanking

ALTER TABLE [ChannelsOtterBrassUserOOF] 
DROP CONSTRAINT FK_ChannelsOtterBrassUser;

ALTER TABLE [ChannelsOtterBrassUserRandom] 
DROP CONSTRAINT FK_ChannelsOtterBrassUserRandom;
