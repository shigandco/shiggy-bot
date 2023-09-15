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
    usage: "shiggy [id]",
    callback: async (msg, args) => {
      let ShiggyId;
      if (args.length == 0) {
        ShiggyId = (await fetch("http://api/api/v3/random")).headers.get(
          "Shiggy-Id"
        );
      } else {
        ShiggyId = args[0];
      }

      msg.reply(`https://shiggy.fun/api/v3/shiggies/${ShiggyId}`);
    },
  }),

  slashcommand,
];
