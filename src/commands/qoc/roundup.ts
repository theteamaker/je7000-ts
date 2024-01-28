import { SlashCommandBuilder, CommandInteraction } from "discord.js";
import { guilds } from "../../utils/init";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("roundup")
    .setDescription("Grabs a list of all rips currently in QoC."),
  async execute(interaction: CommandInteraction) {
    const pinnedMessages = await interaction.channel?.messages.fetchPinned();

    //console.log(pinned_messages);
    if (pinnedMessages == undefined || pinnedMessages.size === 0) {
      await interaction.reply("No pinned messages were found.");
      return;
    }

    const filteredPins = pinnedMessages.filter((x) => {
      if (interaction.guildId == undefined) {
        return false;
      }
      for (const guild of guilds) {
        if (interaction.guildId != guild[1].guild_id) {
          continue;
        }

        if (guild[1].ignore_pinned_message_ids.includes(x.id)) {
          return false;
        } else {
          return true;
        }
      }
    });

    for (const pinnedMessage of filteredPins) {
      const linesList: string[] = pinnedMessage[1].content.split("\n");

      let ripTitle = "";

      if (!linesList[0].includes("by ") || linesList.length === 0) {
        ripTitle = "`[Unusual Pin Format]`";
      } else {
        for (const line of linesList) {
          if (line.includes("```")) {
            const stripped_title = line.replace("```", "").replace("**", "");
            if (stripped_title === "") {
              const indexToUse = linesList.indexOf(line);
              ripTitle = linesList[indexToUse + 1];
            } else if (stripped_title != "") {
              ripTitle = stripped_title;
            }
          }

          let author = linesList[0];

          if (author.toLowerCase().includes("by me")) {
            const cleaned_author = pinnedMessage[1].author.displayName;
            author = ` (**${cleaned_author}**)`;
          }
        }
      }
    }
  },
};
