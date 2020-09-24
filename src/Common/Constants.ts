/**
 * Contains the constants used along the project.
 */
export class Constants {

    public static SERVER_CONFIG = {
        server: process.env.SqlServerAddress,
        user: process.env.SqlServerUser,
        password: process.env.SqlServerPassword,
        database: process.env.SqlServerDatabase,
        port: parseInt((process.env.SqlServerPort || '1433'), 10),
        options: {
            enableArithAbort: false
        }
    };
    public static MENTION = 'mention';
    public static MAX_USERS_TO_LIST = 500;
    public static DEFAULT_RANDOMNESS_LEVEL = 30;
}
