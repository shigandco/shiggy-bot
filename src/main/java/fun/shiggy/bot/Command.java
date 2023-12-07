package fun.shiggy.bot;

import discord4j.core.object.entity.Message;
import reactor.core.publisher.Mono;

public interface Command {
    Mono<Void> execute(Message message);
}