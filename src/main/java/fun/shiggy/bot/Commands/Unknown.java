package fun.shiggy.bot.Commands;

import discord4j.core.object.entity.Message;
import fun.shiggy.bot.Command;
import reactor.core.publisher.Mono;

public class Unknown implements Command {
    @Override
    public Mono<Void> execute(Message message) {
        return Mono.empty();
    }
}
