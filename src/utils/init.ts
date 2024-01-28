import fs from "fs";

interface GuildDetails {
  guild_id: number;
  qoc_channel_id: number;
  op_channel_id?: number;
}

const guildsJSONFileString: string = fs.readFileSync("guilds.json").toString();
const guildsJSON = JSON.parse(guildsJSONFileString);

const guilds: Map<string, GuildDetails> = new Map();

if (guildsJSON.guilds.length === 0) {
  throw new Error("Guilds have not been properly set in guilds.json. Exiting.");
}
/* eslint-disable */
for (var i = 0, guild; i < guildsJSON.guilds.length; i++) {
  const guild = guildsJSON.guilds[i];

  guilds.set(guild.name, {
    guild_id: guild.guild_id,
    qoc_channel_id: guild.qoc_channel_id,
    op_channel_id: guild.op_channel_id,
  });
}
/* eslint-enable */

export const tokenEnv: string | undefined = process.env["TOKEN"];
export const clientIdEnv: string | undefined = process.env["CLIENT_ID"];

if (tokenEnv == undefined || tokenEnv === "") {
  throw new Error("[ERROR] TOKEN has not been properly set in .env. Exiting.");
}

if (clientIdEnv == undefined || clientIdEnv === "") {
  throw new Error(
    "[ERROR] CLIENT_ID has not been properly set in .env. Exiting."
  );
}

export const token: string = tokenEnv;
export const clientId: string = clientIdEnv;
