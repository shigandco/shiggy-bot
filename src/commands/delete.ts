import { readFile, readdir, rm, writeFile } from "fs/promises";
import { PrefixCommand, PrefixCommandMessage } from "../commands";
import { existsSync } from "fs";
import Blacklist from "../actions/blacklist";

export default new PrefixCommand({
  name: "blacklist",
  aliases: ["bl", "delete", "del"],
  description: "Blacklist a shiggy",
  usage: "blacklist <shiggy>",
  ownerOnly: true,
  callback: async (message: PrefixCommandMessage, args: string[]) => {
    if (args.length === 0) {
      return message.channel.send("You need to specify a shiggy!");
    }
    const success = await Blacklist(args[0]);
    if (success) {
      message.channel.send("Shiggy blacklisted!");
    } else {
      message.channel.send("Failed to blacklist shiggy!");
    }
  },
});
