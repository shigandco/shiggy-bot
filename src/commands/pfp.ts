import { PrefixCommand } from "../commands";
import changePfp from "../pfp";

export default new PrefixCommand({
  name: "pfp",
  description: "Change the bot's pfp",
  usage: "pfp",
  ownerOnly: true,
  callback: async (msg) => {
    const success = await changePfp();
    if (success) msg.channel.send("Pfp changed!");
    else msg.channel.send("Pfp not changed, check logs :(");
  },
});
