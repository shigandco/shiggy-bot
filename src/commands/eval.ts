import { Client, Message, EmbedBuilder } from "discord.js";
import ts from "typescript";

import bot from "../";
import { PrefixCommand, PrefixCommandMessage } from "../commands";

var _ = {} as any;
const _bot = bot;

async function callback(message: PrefixCommandMessage, args: string[]) {
  const codeRegex = /(`{1,3})((?:js)|(?:ts))?\n?\r?((?:.|\n.(?!`))+)\n?\r?\1/g;
  let data = codeRegex.exec(args.join(" "));
  let output = [] as string[];
  let cnsle = console;
  console = new Proxy(cnsle, {
    get(target, prop: string, receiver) {
      if (["log", "error", "info"].includes(prop)) {
        return function () {
          Array.from(arguments).forEach((arg) => output.push(arg.toString()));
        };
      }
      return Reflect.get(target, prop, receiver);
    },
  });
  let code = data?.[3];
  if (!code) {
    code = args.join(" ");
    if (!code) return message.channel.send("No code provided");
  }

  const utils = {
    async referencedMessage() {
      return await message.channel.messages.fetch(
        message.reference?.messageId as string
      );
    },
    async ref() {
      return await message.channel.messages.fetch(
        message.reference?.messageId as string
      );
    },
    list() {
      return Object.keys(utils);
    },
  };

  try {
    if (data?.[2] == "ts") code = ts.transpile(code);

    let _output: any;
    if (message.command.name === "aeval")
      _output = await eval(`(async () => {${code}})()`);
    else _output = await eval(code);
    output.push(`> ${_output}`);
  } catch (e) {
    output.push(`Error: ${e}`);
  }
  console = cnsle;

  if (message.command.name !== "seval")
    await message.channel.send(`\`\`\`js\n${output.join("\n")}\n\`\`\``);
}

const evalCommand = new PrefixCommand({
  name: "eval",
  description: "Evaluate javascript",
  usage: "eval <code>",
  aliases: ["e"],
  ownerOnly: true,
  callback: callback,
});

const asyncEvalCommand = new PrefixCommand({
  name: "aeval",
  description: "Evaluate javascript asynchronously",
  usage: "aeval <code>",
  aliases: ["ae"],
  ownerOnly: true,
  callback: callback,
});

const silentEvalCommand = new PrefixCommand({
  name: "seval",
  description: "Evaluate javascript silently",
  usage: "seval <code>",
  aliases: ["se"],
  ownerOnly: true,
  callback: callback,
});

export default [evalCommand, asyncEvalCommand, silentEvalCommand];
