# Otterbrass
Otterbrass is a MS Teams bot that distribute workitems load among subscribed members over a channel.

# Prerequisites
- A SQL Server and a blank database configured.
- Node 10.X  or higher

# Set up database
- Go to `dbScripts` folder 
- Execute (you can copy and paste) each one of the scripts in the version folders, you need to execute them in the right version order:
  - V1.0 first
  - V1.1 second
  - V1.2 ...
  - Once inside the version folder(e.g V1.0) you can execute the scripts in any order.
- Once all the scripts are executed your database should be all set.

# How to run it (locally)
- Check CONTRIBUTING.md

# How to deploy it.
- Follow the steps to create a bot service from: [Deploy your bot to Azure](https://docs.microsoft.com/en-us/azure/bot-service/bot-service-quickstart-registration?view=azure-bot-service-4.0#create-a-registration-application)
- Set the properties from the dotenv-sample file into host environment properties. e.g in Azure you can do this on the `WebApp Service Blade -> Configuration`
- Personalize the `web.config` file to your server needs, a minimum requirements example is provided in this repository.
- Run `npm run release`
- Deploy the following files to your service `wwwroot` folder:
  - web.config
  - dist\index.js
  - package.json
  - package-lock.json
- Copy the `node_modules` folder to your wwwroot folder, or run `npm install` into your server console (in the wwwroot) folder. More on why in [here](https://github.com/liady/webpack-node-externals)

- Restart your server.
- Deploy your bot to teams channel using the following instructions:
  - [Create an app package for your Microsoft Teams app](https://docs.microsoft.com/en-us/microsoftteams/platform/concepts/build-and-test/apps-package#creating-a-manifest)
  - [Run and debug your Microsoft Teams app](https://docs.microsoft.com/en-us/microsoftteams/platform/concepts/build-and-test/debug)

# Contributing
Please refer to CONTRIBUTING.md for instructions on how to build and debug.
