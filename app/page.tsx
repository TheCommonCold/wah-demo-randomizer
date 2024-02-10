"use client";

import Image from "next/image";
import { PremiumAndFreeMessages } from "./api/messages/route";
import Queues from "./components/Queues";
import useAxios from "./hooks/useAxios";
import ClearAllDialog from "./components/ClearAllDialog";
import {
  LocalStorageProvider,
  useLocalStorage,
} from "./context/localStorageContext";
import DemoPicker from "./components/DemoPicker";
import { env } from "process";
import { ProbabilitiesMap } from "./api/probabilities/route";

function Home() {
  const probabilities = useAxios<ProbabilitiesMap>({
    url: "/api/probabilities",
  });

  const { storedData } = useLocalStorage();

  const discordMessages = useAxios<PremiumAndFreeMessages>({
    url: "/api/messages",
  });

  if (!discordMessages.data || !probabilities.data) {
    return (
      <div className="my-8 flex flex-col items-center justify-center pt-10">
        <Image
          className="rounded py-1"
          src="/assets/wah_button.gif"
          alt="wah logo"
          width={160}
          height={160}
        />
      </div>
    );
  }

  const parsedDemos = {
    premiumDemos: discordMessages.data.premiumDemos.map((demo) => ({
      ...demo,
      probability: probabilities.data
        ? probabilities.data[demo.author.id] + 1
        : 1,
      seen: storedData.seenDemos[demo.id] ?? false,
    })),
    freeDemos: discordMessages.data.freeDemos.map((demo) => ({
      ...demo,
      probability: probabilities.data
        ? probabilities.data[demo.author.id] + 1
        : 1,
      seen: storedData.seenDemos[demo.id] ?? false,
    })),
  };

  console.log(parsedDemos);

  const unseenDemos = {
    premiumDemos: parsedDemos.premiumDemos.filter((demo) => !demo.seen),
    freeDemos: parsedDemos.freeDemos.filter((demo) => !demo.seen),
  };

  return (
    <div className="my-8 flex min-h-screen flex-col items-center justify-center space-y-5 p-5">
      <DemoPicker unseenDemos={unseenDemos} />
      <div className="pt-5">
        Premium demos in a row: {storedData.premiumInARowCount}/
        {env.PREMIUM_IN_A_ROW ?? 3}
      </div>
      <Queues {...parsedDemos} />
      <ClearAllDialog />
    </div>
  );
}

export default function Wrapper() {
  return (
    <LocalStorageProvider>
      <Home />
    </LocalStorageProvider>
  );
}
