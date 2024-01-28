import { Client, Collection } from "discord.js";

export class CommandsClient extends Client {
  /* eslint-disable */
  public commands?: Collection<string, any>;
  /* eslint-enable */
}
