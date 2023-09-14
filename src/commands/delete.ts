import { readFile, readdir, rm, writeFile } from "fs/promises";
import { PrefixCommand, PrefixCommandMessage } from "../commands";
import { existsSync } from "fs";

export default new PrefixCommand({
  name: "blacklist",
  aliases: ["bl", "delete", "del"],
  description: "Blacklist a shiggy",
  usage: "blacklist <shiggy>",
  ownerOnly: true,
  callback: async (message: PrefixCommandMessage, args: string[]) => {
    if (args.length === 0) {
      await message.channel.send("You need to specify a shiggy!");
      return;
    }
    const shiggy = args[0].toLowerCase();
    if (!(await readdir("./shiggy")).includes(args[0])) {
      return message.channel.send("That shiggy doesn't exist!");
    }
    await rm(`./shiggy/${shiggy}`, { recursive: true, force: true });
    const shiggiesFile = JSON.parse(
      await readFile("./shiggy/shiggies.json", "utf-8")
    ) as string[];

    shiggiesFile.splice(shiggiesFile.indexOf(shiggy), 1);

    await writeFile("./shiggy/shiggies.json", JSON.stringify(shiggiesFile));

    const blacklist = (
      existsSync("./shiggy/blacklist.json")
        ? JSON.parse(await readFile("./shiggy/blacklist.json", "utf-8"))
        : []
    ) as string[];

    blacklist.push(shiggy);

    await writeFile("./shiggy/blacklist.json", JSON.stringify(blacklist));

    await message.channel.send(`Blacklisted shiggy ${shiggy}!`);
  },
});
