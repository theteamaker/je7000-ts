import { token } from "./utils/init";
import { Client, Events, GatewayIntentBits } from "discord.js";

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, (readyClient) => {
  console.info(`[INFO] Ready! Logged in as ${readyClient.user.tag}`);
});

client.login(token);
