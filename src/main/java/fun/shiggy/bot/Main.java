package fun.shiggy.bot;

import discord4j.core.DiscordClient;
import discord4j.core.GatewayDiscordClient;

import java.io.FileInputStream;
import java.io.IOException;
import java.util.Properties;

public class Main {
    public static void main(String[] args) {
        Properties properties = new Properties();
        try {
            properties.load(new FileInputStream("src/main/resources/config.properties"));
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        String token = properties.getProperty("discord.token");
        GatewayDiscordClient client = DiscordClient.create(token).login().block();

        if (client != null) {
            CommandHandler.registerCommands(client);

            client.onDisconnect().block();
        }
    }
}
