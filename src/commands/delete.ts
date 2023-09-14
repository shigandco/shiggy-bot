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
    Blacklist(message, args[0]);
  },
});
