import { SlashCommandBuilder, CommandInteraction } from "discord.js";

module.exports = {
  data: new SlashCommandBuilder().setName("op").setDescription("op"),
  async execute(interaction: CommandInteraction) {
    await interaction.reply("op");
  },
};
