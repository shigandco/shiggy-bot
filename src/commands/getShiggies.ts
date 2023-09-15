import { SlashCommandBuilder } from "discord.js";
import { PrefixCommand, SlashCommand } from "../commands";
import changePfp from "../pfp";
import authenticatedRequest from "../utils/authenticatedRequest";

export default new PrefixCommand({
  name: "getShiggies",
  description: "refetches shiggies",
  usage: "getShiggies",
  callback: async (msg) => {
    try {
      await authenticatedRequest("/api/v0/getShiggies");
      msg.reply("Fetching shiggies...");
    } catch (e) {
      msg.reply("Failed to request!");
    }
  },
});
