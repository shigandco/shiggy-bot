import {
  Message,
  PartialMessage,
  Collection,
  SlashCommandBuilder,
  ApplicationCommandDataResolvable,
  REST,
  Routes,
  Events,
  Interaction,
  ChatInputCommandInteraction,
  SlashCommandSubcommandsOnlyBuilder,
} from "discord.js";

import bot from ".";
import { readdirSync } from "fs";
import { join } from "path";

export const prefixCommands: PrefixCommand[] = [];
export const slashCommands = new Collection<
  string,
  ApplicationCommandDataResolvable
>();
export const slashCommandsMap = new Collection<string, SlashCommand>();

export interface PrefixCommandMessage extends Message {
  prefix: string;
  usedName: string;
  command: PrefixCommand;
}

interface PrefixCommandOptions {
  name: string;
  description: string;
  usage: string;
  aliases?: string[];
  ownerOnly?: boolean;
  callback: (message: PrefixCommandMessage, args: string[]) => void;
}

export interface SlashCommand {
  data:
    | Omit<SlashCommandBuilder, "addSubcommandGroup" | "addSubcommand">
    | SlashCommandSubcommandsOnlyBuilder;
  callback(...args: any): any;
}

export class PrefixCommand {
  description: string;
  usage: string;
  name: string;
  aliases: string[];
  ownerOnly: boolean;
  data: boolean;

  callback: (message: PrefixCommandMessage, args: string[]) => void;

  constructor(options: PrefixCommandOptions) {
    this.description = options.description;
    this.usage = options.usage;
    this.name = options.name;
    this.aliases = options.aliases || ([] as string[]);
    this.aliases.push(this.name);
    this.ownerOnly = options.ownerOnly || false;
    this.data = false; // This is so the command is interpreted as a prefix command

    this.callback = options.callback;
  }
}

async function possiblyTriggerPrefixCommand(
  message: Message | PartialMessage,
  newMessage?: Message | PartialMessage
) {
  if (newMessage) message = newMessage;
  if (message.partial) message = await message.fetch();

  if (!message.content.startsWith(process.env.PREFIX)) return;
  const args = message.content
    .slice(process.env.PREFIX.length)
    .trim()
    .split(/ +/g);

  let chosenAlias: string | undefined;
  const command = prefixCommands.find((cmd) => {
    // Command aliases can have spaces
    const aliases = cmd.aliases.map((alias) => alias.split(/ +/g));
    const alias = aliases.find((alias) => {
      const match = args.slice(0, alias.length).join(" ") === alias.join(" ");
      if (match) chosenAlias = alias.join(" ");
      return match;
    });
    return !!alias;
  });
  if (!command || !chosenAlias) return;
  if (
    command.ownerOnly &&
    !message.member?.roles.cache.has(process.env.DEV_ROLE)
  )
    return;

  for (let i = 0; i < chosenAlias.split(/ +/g).length; i++) args.shift();

  const cmdMessage = message as PrefixCommandMessage;
  cmdMessage.prefix = process.env.PREFIX;
  cmdMessage.usedName = chosenAlias;
  cmdMessage.command = command;

  try {
    command.callback(cmdMessage, args);
  } catch (e) {
    message.channel.send("There was an error running the command");
  }
}

function registerEvents() {
  bot.on("messageCreate", possiblyTriggerPrefixCommand);
  bot.on("messageUpdate", possiblyTriggerPrefixCommand);

  bot.on(
    Events.InteractionCreate,
    async (interaction: Interaction): Promise<any> => {
      if (!interaction.isChatInputCommand()) return;

      const command = slashCommandsMap.get(interaction.commandName);

      if (!command) return;

      try {
        command.callback(interaction as ChatInputCommandInteraction);
      } catch (error: any) {
        console.error(error);
        interaction
          .reply({
            content: "There was an error running the command",
            ephemeral: true,
          })
          .catch(console.error);
      }
    }
  );
}

export async function registerCommands() {
  const rest = new REST({ version: "9" }).setToken(process.env.TOKEN);

  const commandFiles = readdirSync(join(__dirname, "commands")).filter(
    (file) => !file.endsWith(".map")
  );

  for (const file of commandFiles) {
    const command = await import(join(__dirname, "commands", `${file}`));

    function registerCommand(command: SlashCommand | PrefixCommand) {
      if (!command.data) prefixCommands.push(command as PrefixCommand);
      else {
        command = command as SlashCommand;
        slashCommandsMap.set(command.data.name, command);
        slashCommands.set(command.data.name, command.data);
      }
    }

    if (!Array.isArray(command.default))
      registerCommand(command.default as SlashCommand | PrefixCommand);
    else command.default.forEach(registerCommand);
  }

  await rest.put(Routes.applicationCommands(bot.user!.id), {
    body: slashCommands,
  });

  await registerEvents();
}
