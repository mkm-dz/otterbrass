DECLARE @versionTable TABLE (Internal_id  INT);

INSERT INTO @versionTable
SELECT Internal_Id
FROM [Version]

UPDATE [Version]
SET [Version] = 1.5
WHERE [Internal_Id] IN
    (SELECT [Internal_Id]
    FROM @versionTable);
