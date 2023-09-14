import { SlashCommandBuilder } from "discord.js";
import { PrefixCommand, SlashCommand } from "../commands";
import changePfp from "../pfp";

const slashcommand: SlashCommand = {
  data: new SlashCommandBuilder().setName("shiggy").setDescription("shiggy :D"),
  callback: async (interaction) => {
    await interaction.reply(
      `https://shiggy.fun/api/v2/random?cachebust=${Date.now()}`
    );
  },
};

export default [
  new PrefixCommand({
    name: "shiggy",
    description: "shiggy :D",
    usage: "shiggy",
    callback: async (msg) => {
      msg.reply(`https://shiggy.fun/api/v2/random?cachebust=${Date.now()}`);
    },
  }),

  slashcommand,
];
