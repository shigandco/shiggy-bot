package fun.shiggy.bot.Commands;

import discord4j.core.object.entity.Message;
import fun.shiggy.bot.Command;
import reactor.core.publisher.Mono;

public class Ping implements Command {
    @Override
    public Mono<Void> execute(Message message) {
        return message.getChannel()
                .flatMap(messageChannel -> messageChannel.createMessage("gay")
                        .withMessageReference(message.getId()))
                .then();
    }
}
