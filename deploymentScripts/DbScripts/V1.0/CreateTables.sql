CREATE TABLE Channels (
      Internal_id INT NOT NULL IDENTITY PRIMARY KEY,
      Id NVARCHAR(255),
      Name nvarchar(MAX),
); 

CREATE TABLE OtterBrassUser (
    Internal_id INT NOT NULL IDENTITY PRIMARY KEY,
    Id nvarchar(MAX),
    Name nvarchar(MAX),
); 

CREATE TABLE ChannelsOtterBrassUser (
    Internal_id INT NOT NULL IDENTITY PRIMARY KEY,
    Channel_internal_id INT CONSTRAINT FK_Channel FOREIGN KEY (Channel_internal_id) REFERENCES Channels(Internal_id),  
    User_internal_id INT CONSTRAINT FK_OtterBrassUser FOREIGN KEY (User_internal_id) REFERENCES OtterBrassUser(Internal_id), 
); 

CREATE TABLE UserRanking (
    Internal_id INT NOT NULL IDENTITY,
    ChannelsOtterBrassUser_internalId INT CONSTRAINT FK_UserRanking FOREIGN KEY (Internal_id) REFERENCES ChannelsOtterBrassUser(Internal_id) PRIMARY KEY, 
    Ranking FLOAT
);

CREATE TABLE Version  (
    Internal_Id INT NOT NULL IDENTITY,
    Version FLOAT
)