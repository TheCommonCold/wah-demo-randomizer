import { DiscordMessage, getMessages } from "./client";
import { NextRequest } from "next/server";
import { env } from "process";

export type PremiumAndFreeMessages = {
  freeDemos: DiscordMessage[];
  premiumDemos: DiscordMessage[];
};

const dayLimit = env.DAY_LIMIT ? Number(env.DAY_LIMIT) : 1;

export async function GET(_: NextRequest) {
  const freeDemos = await getMessages({
    channel: env.FREE_QUEUE_CHANNEL_ID ?? "",
    dateLimit: new Date(Date.now() - 1000 * 60 * 60 * 24 * dayLimit),
  });
  const premiumDemos = await getMessages({
    channel: env.PREMIUM_QUEUE_CHANNEL_ID ?? "",
    dateLimit: new Date(Date.now() - 1000 * 60 * 60 * 24 * dayLimit),
  });
  const response: PremiumAndFreeMessages = { freeDemos, premiumDemos };

  return new Response(JSON.stringify(response), {
    status: 200,
  });
}
