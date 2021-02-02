CREATE TABLE ChannelsOtterBrassUserOOF (
    Internal_id INT NOT NULL IDENTITY PRIMARY KEY,
    ChannelsOtterBrassUser_internal_id INT CONSTRAINT FK_ChannelsOtterBrassUser FOREIGN KEY (ChannelsOtterBrassUser_internal_id) REFERENCES ChannelsOtterBrassUser(Internal_id),
    oofStatus INT NOT NULL, 
); 

ALTER TABLE Channels 
ADD RandomLevel
INT NOT NULL DEFAULT(30)


CREATE TABLE ChannelsOtterBrassUserRandom (
    Internal_id INT NOT NULL IDENTITY PRIMARY KEY,
    ChannelsOtterBrassUser_internal_id INT CONSTRAINT FK_ChannelsOtterBrassUserRandom FOREIGN KEY (ChannelsOtterBrassUser_internal_id) REFERENCES ChannelsOtterBrassUser(Internal_id),
); 