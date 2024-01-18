import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v10";
import { env } from "process";

const rest = new REST({ version: "10" }).setToken(env.DISCORD_BOT_TOKEN ?? "");

export interface DiscordMessage {
  id: string;
  content: string;
  timestamp: string;
  author: {
    username: string;
    global_name: string;
    accent_color: string;
    premium_type: string;
  };
  seen: boolean;
  attachments: {
    id: string;
    filename: string;
    size: number;
    url: string;
    proxy_url: string;
    content_type?: string;
  }[];
}

export const getMessages = async ({
  channel,
  dateLimit = new Date(),
}: {
  channel: string;
  dateLimit: Date;
}) => {
  const messages = (await rest.get(
    `${Routes.channelMessages(channel)}?limit=100`,
  )) as DiscordMessage[];

  return messages.filter((message) => new Date(message.timestamp) > dateLimit);
};
