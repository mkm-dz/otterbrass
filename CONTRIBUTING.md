# Contributing

Contributions are always welcome! We only ask that you open an issue first so we can discuss the problem and solution. We don't want you to waste any time headed in the wrong direction.

# Development setup
## Prerequisites
- A SQL Server and a blank database configured.
- Node 20.X  or higher

## Set up database
- Go to `dbScripts` folder 
- Execute (you can copy and paste) each one of the scripts in the version folders, you need to execute them in the right version order:
  - V1.0 first
  - V1.1 second
  - V1.2 ...
  - Once inside the version folder(e.g V1.0) you can execute the scripts in any order.
- Once all the scripts are executed your database should be all set.

## How to run it (locally)
- Clone this repository
- `npm install`
- `npm run release`
- `npm run start`
- Fill `dotenv-sample` file with your DB configuration and App Id.
- Rename `dotenv-sample` to `.env`
- If everything is working as expected you should get a message with a port number.
- Download [Bot Framework Emulator](https://github.com/microsoft/botframework-emulator)
- In the `Bot Framework Emulator` connect to `http://localhost:[port]/api/messages
- You should get a welcome message from Otterbrass!

## Testing
This in an area open to contribution.

## Issue tags
* "Bug": Something that should work is broken
* "Enhancement": AKA feature request - adds new functionality
* "Task": Something that needs to be done that doesn't really fix anything or add major functionality. Tests, engineering, documentation, etc.
