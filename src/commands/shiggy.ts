import { SlashCommandBuilder } from "discord.js";
import { PrefixCommand, SlashCommand } from "../commands";
import changePfp from "../pfp";

const slashcommand: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName("shiggy")
    .setDescription("shiggy :D")
    .addIntegerOption((option) =>
      option.setName("id").setDescription("shiggy id").setRequired(false)
    ),
  callback: async (interaction) => {
    let ShiggyId;
    if (interaction.options.getInteger("id") == null) {
      ShiggyId = (await fetch("http://api:4321/api/v3/random")).headers.get(
        "Shiggy-Id"
      );
    } else {
      ShiggyId = interaction.options.getInteger("id");
    }
    await interaction.reply(`https://api.shig.gy/api/v3/shiggies/${ShiggyId}`);
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
        ShiggyId = Number(
          (await fetch("http://api:4321/api/v3/random")).headers.get(
            "Shiggy-Id"
          )
        );
      } else {
        ShiggyId = Number(args[0]);
      }

      if (Number.isNaN(ShiggyId)) return msg.reply("nuh uh");
      msg.reply(`https://shiggy.fun/api/v3/shiggies/${ShiggyId}`);
    },
  }),

  slashcommand,
];
