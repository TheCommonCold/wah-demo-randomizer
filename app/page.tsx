"use client";

import { PremiumAndFreeMessages } from "./api/messages/route";
import Queues from "./components/Queues";
import useAxios from "./hooks/useAxios";
import ClearAllDialog from "./components/ClearAllDialog";
import {
  LocalStorageProvider,
  useLocalStorage,
} from "./context/localStorageContext";
import DemoPicker from "./components/DemoPicker";

function Home() {
  const { storedData } = useLocalStorage();

  const discordMessages = useAxios<PremiumAndFreeMessages>({
    url: "/api/messages",
  });

  if (!discordMessages.data) {
    return <div>Loading...</div>;
  }

  const parsedDemos = {
    premiumDemos: discordMessages.data.premiumDemos.map((demo) => ({
      ...demo,
      seen: storedData.seenDemos[demo.id] ?? false,
    })),
    freeDemos: discordMessages.data.freeDemos.map((demo) => ({
      ...demo,
      seen: storedData.seenDemos[demo.id] ?? false,
    })),
  };

  const unseenDemos = {
    premiumDemos: parsedDemos.premiumDemos.filter((demo) => !demo.seen),
    freeDemos: parsedDemos.freeDemos.filter((demo) => !demo.seen),
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-5 py-5">
      <DemoPicker unseenDemos={unseenDemos} />
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
