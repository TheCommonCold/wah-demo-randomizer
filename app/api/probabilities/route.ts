export const dynamic = "force-dynamic";

import { getMembers } from "../client";
import { NextRequest } from "next/server";
import { env } from "process";

export type ProbabilitiesMap = Record<string, number>;

export async function GET(req: NextRequest) {
  const weight = req.nextUrl.searchParams.get("weight");
  const members = await getMembers(env.SERVER_ID ?? "");

  const membersMap = members.reduce((acc, member) => {
    acc[member.id] = member.roles.length * (Number(weight) / 100);

    return acc;
  }, {} as ProbabilitiesMap);

  return new Response(JSON.stringify(membersMap), {
    status: 200,
  });
}
