import { Message } from "discord.js";
import { existsSync } from "fs";
import { readFile, readdir, rm, writeFile } from "fs/promises";

export default async function Blacklist(message: Message, shiggy?: string) {
  if (!shiggy) {
    await message.channel.send("You need to specify a shiggy!");
    return;
  }
  if (!(await readdir("./shiggy")).includes(shiggy)) {
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
}
