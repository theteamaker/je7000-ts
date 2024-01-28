import { REST, Routes, SlashCommandBuilder } from "discord.js";
import { token, clientId } from "../utils/init";

import path from "path";
import fs from "fs";

const commands: SlashCommandBuilder[] = [];

const foldersPath = path.join(__dirname, "../commands");
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    /* eslint-disable */
    const command = require(filePath);
    if ("data" in command && "execute" in command) {
      commands.push(command.data.toJSON());
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
      );
    }
    /* eslint-enable */
  }
}

const rest = new REST().setToken(token);

(async () => {
  try {
    console.log(
      `Started refreshing ${commands.length} application (/) commands.`
    );

    const data: unknown = await rest.put(Routes.applicationCommands(clientId), {
      body: commands,
    });

    if (Array.isArray(data)) {
      console.log(
        `Successfully reloaded ${data.length} application (/) commands.`
      );
    } else {
      throw new Error(`Data is not an array.`);
    }
  } catch (error) {
    console.error(error);
  }
})();
