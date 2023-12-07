package fun.shiggy.bot;

import discord4j.core.GatewayDiscordClient;
import discord4j.core.event.domain.message.MessageCreateEvent;
import discord4j.core.object.entity.Message;
import fun.shiggy.bot.Commands.Ping;
import fun.shiggy.bot.Commands.Shiggy;
import fun.shiggy.bot.Commands.Unknown;
import reactor.core.publisher.Mono;

import java.util.HashMap;
import java.util.Map;

public class CommandHandler {

    private static final Map<String, Command> commandMap = new HashMap<>();

    static {
        commandMap.put("ping", new Ping());
        commandMap.put("unknown", new Unknown());
        commandMap.put("shiggy", new Shiggy());
    }
    public static void registerCommands(GatewayDiscordClient client) {
        client.on(MessageCreateEvent.class)
                .flatMap(event -> {
                    Message message = event.getMessage();
                    String content = message.getContent();
                    if (content.startsWith("!")) {
                        String commandName = content.substring(1).toLowerCase();
                        Command command = commandMap.getOrDefault(commandName, commandMap.get("unknown"));
                        return command.execute(message);
                    }
                    return Mono.empty();
                })
                .subscribe();
    }
}
