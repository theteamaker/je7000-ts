import { token } from "./utils/init";
import { Collection, Events, GatewayIntentBits } from "discord.js";
import { CommandsClient } from "./utils/augmented_client";
import path from "path";
import fs from "fs";

const client = new CommandsClient({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessages,
  ],
});

client.commands = new Collection();
const foldersPath = path.join(__dirname, "commands");
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
    // Set a new item in the Collection with the key as the command name and the value as the exported module
    if ("data" in command && "execute" in command) {
      client.commands.set(command.data.name, command);
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
      );
    }
    /* eslint-enable */
  }
}

client.once(Events.ClientReady, (readyClient) => {
  console.info(`[INFO] Ready! Logged in as ${readyClient.user.tag}`);
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const commandsClient = interaction.client as CommandsClient;
  if (commandsClient.commands == undefined) {
    return;
  }

  const command = commandsClient.commands.get(interaction.commandName);

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    }
  }
});

client.on(Events.MessageCreate, async (interaction) => {
  if (
    interaction.author.id == "310154766699200512" &&
    interaction.channel.id == "455192909084360705"
  ) {
    if (interaction.attachments.size > 0) {
      await interaction.delete();
      await interaction.channel.send("treydog1357 preventative measures");
    }
  }
});

client.login(token);
