export const dynamic = "force-dynamic";

import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v10";
import { env } from "process";

const rest = new REST({ version: "10" }).setToken(env.DISCORD_BOT_TOKEN ?? "");

type User = {
  id: string;
  username: string;
  global_name: string;
  accent_color: string;
  premium_type: string;
};

export type UserWithRoles = {
  roles: string[];
} & User;

export interface DiscordMessage {
  id: string;
  content: string;
  timestamp: string;
  author: User;
  probability: number;
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

export const getMembers = async (guild: string): Promise<UserWithRoles[]> => {
  let members: UserWithRoles[] = [];
  let lastMember: UserWithRoles | undefined = undefined;
  for (;;) {
    const currMembers = (await rest.get(
      `${Routes.guildMembers(guild)}?limit=1000${lastMember ? "&after=" + lastMember.id : ""}`,
    )) as {
      roles: string[];
      user: User;
    }[];
    members = [
      ...members,
      ...currMembers.map((m) => ({ ...m.user, roles: m.roles })),
    ];

    if (currMembers.length < 1000) return members;

    lastMember = members[members.length - 1];
  }
};

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

  const limitedMessages = messages.filter(
    (message) => new Date(message.timestamp) > dateLimit,
  );

  const concatenatedMessages = limitedMessages.reduce(
    (acc, message) => {
      if (acc[message.author.username]) {
        acc[message.author.username] = {
          ...acc[message.author.username],
          timestamp: message.timestamp,
          content:
            acc[message.author.username].content + "\n" + message.content,
        };
      } else {
        acc[message.author.username] = message;
      }
      return acc;
    },
    {} as Record<string, DiscordMessage>,
  );

  const result = Object.values(concatenatedMessages);

  result.sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
  );
  return result;
};
