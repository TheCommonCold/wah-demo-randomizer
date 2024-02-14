export const dynamic = "force-dynamic";

import { getMembers } from "../client";
import { NextRequest } from "next/server";
import { env } from "process";

export type ProbabilitiesMap = Record<string, number>;
// king of the week       walkie talkie          2gd 4 fdbck               ogs                 nice humans
const selectedRoles = [
  "727895715426074704",
  "804112017182687272",
  "826905752941101097",
  "1052712167268429834",
  "677523776434339851",
];

export async function GET(req: NextRequest) {
  const weight = req.nextUrl.searchParams.get("weight");
  const members = await getMembers(env.SERVER_ID ?? "");

  const membersMap = members.reduce((acc, member) => {
    acc[member.id] =
      member.roles.filter((role) => selectedRoles.includes(role)).length *
      (Number(weight) / 100);

    return acc;
  }, {} as ProbabilitiesMap);

  return new Response(JSON.stringify(membersMap), {
    status: 200,
  });
}
