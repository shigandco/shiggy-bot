package fun.shiggy.bot.Commands;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonParser;
import discord4j.core.object.entity.Message;
import fun.shiggy.bot.Command;
import reactor.core.publisher.Mono;

import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Random;

public class Shiggy implements Command {
    String randomShiggyValue = "";

    @Override
    public Mono<Void> execute(Message message) {
        try {
            String apiUrl = "https://shiggy.fun/api/v3/shiggies/";
            HttpURLConnection connection = (HttpURLConnection) new URL(apiUrl).openConnection();
            connection.setRequestMethod("GET");

            JsonArray shiggiesArray =
                    JsonParser.parseReader(new InputStreamReader(connection.getInputStream())).getAsJsonArray();
            if (!shiggiesArray.isJsonArray()) {
                throw new RuntimeException("Unexpected JSON format");
            }

            int randomIndex = new Random().nextInt(shiggiesArray.size());
            JsonElement randomShiggy = shiggiesArray.get(randomIndex);

            randomShiggyValue = apiUrl + randomShiggy.getAsString();


        } catch (Exception e) {
            randomShiggyValue = "guh";
        }


        return message.getChannel()
                .flatMap(messageChannel -> messageChannel.createMessage(randomShiggyValue)
                        .withMessageReference(message.getId()))
                .then();
    }


}
